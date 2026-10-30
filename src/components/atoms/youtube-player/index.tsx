import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { create } from 'zustand';
import { getPlaylist, matchSong } from '../../../api/listen-along';
import { MusicItemProps } from '../../../common/constants';
import { findTrack, isStreamed, spotifyUrl, streamSource } from '../../../common/music';
import { BUFFERING, ENDED, loadYouTubeApi, MUTED, PAUSED, PLAYING, YouTubePlayer as Player } from '../../../common/youtube';
import { Media, useAudioStore } from '../../../store/audio';
import { CoverArt } from '../cover-art';
import './index.scss';

// YouTube's smallest allowed player (docs/music.md)
const MIN_SIZE = 200;
const EDGE = 16;

type SlotKind = 'card' | 'floating';

// The places the video can show, newest last: the player cards' covers, and the floating player's
const slots: { element: HTMLElement; kind: SlotKind }[] = [];

// Whether the video is showing in the floating player, which only shows its slot then
export const useVideoStore = create<{ inFloating: boolean }>(() => ({ inFloating: false }));

/**
 * Where the video shows while a song plays from YouTube: in place of the cover. The video itself
 * isn't inside it. The player is laid over whichever slot is on screen, because moving its frame
 * around the page would reload the video.
 */
export const VideoSlot = ({ track, kind = 'card', className = '' }: { track?: MusicItemProps; kind?: SlotKind; className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const slot = { element: ref.current, kind };
        slots.push(slot);
        return () => {
            slots.splice(slots.indexOf(slot), 1);
        };
    }, [kind]);

    return (
        <div ref={ref} className={`video-slot ${className}`}>
            {track && <CoverArt track={track} className='video-slot__cover' />}
        </div>
    );
};

// How much of a box is inside the window, 0 to 1
const shareInView = (rect: DOMRect) => {
    if (!rect.width || !rect.height) return 0;
    const width = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
    const height = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
    return (width * height) / (rect.width * rect.height);
};

// The card the visitor can see (the newest, so the library's beats the board's under it), else the
// floating player, else whatever card is partly in view. The board's card behind an overlay is inert.
const pickSlot = () => {
    const cards = slots
        .filter(({ kind, element }) => kind === 'card' && !element.closest('[inert]'))
        .reverse()
        .map((slot) => ({ slot, share: shareInView(slot.element.getBoundingClientRect()) }));
    return cards.find(({ share }) => share >= 0.5)?.slot ?? slots.find(({ kind }) => kind === 'floating') ?? cards.find(({ share }) => share > 0)?.slot;
};

// How far the slot is turned on screen. The board's tiles lean on hover (--tilt), and the video leans
// with its tile rather than sitting square over a cover that's turned under it.
const angleOf = (element: HTMLElement) => {
    let angle = 0;
    for (let node: HTMLElement | null = element; node && node !== document.body; node = node.parentElement) {
        const transform = getComputedStyle(node).transform;
        if (transform === 'none') continue;
        const matrix = new DOMMatrix(transform);
        angle += Math.atan2(matrix.b, matrix.a);
    }
    return angle;
};

// The size of a box turned by `angle` whose bounding box is `rect`, as it shows (any scale included)
const turnedSize = (rect: DOMRect, angle: number) => {
    const cos = Math.abs(Math.cos(angle));
    const sin = Math.abs(Math.sin(angle));
    const det = cos * cos - sin * sin;
    return { width: (rect.width * cos - rect.height * sin) / det, height: (rect.height * cos - rect.width * sin) / det };
};

// The volume cards open over the cover. Wherever one overlaps the video, the video leaves a hole
// for it, as if the card were on top.
const OPEN_VOLUME = '.volume-control--open .volume-control__card, .volume-control:hover .volume-control__card, .volume-control:focus-within .volume-control__card';

const clipAround = (x: number, y: number, width: number, height: number) => {
    const holes = Array.from(document.querySelectorAll<HTMLElement>(OPEN_VOLUME))
        .map((card) => card.getBoundingClientRect())
        .filter((rect) => rect.right > x && rect.left < x + width && rect.bottom > y && rect.top < y + height);
    if (!holes.length) return '';
    // The outline clockwise, each hole counter-clockwise, so the holes are cut out
    const points = ['0 0', `${width}px 0`, `${width}px ${height}px`, `0 ${height}px`, '0 0'];
    holes.forEach((rect) => {
        const [left, top, right, bottom] = [rect.left - x, rect.top - y, rect.right - x, rect.bottom - y].map((value) => `${Math.round(value)}px`);
        points.push(`${left} ${top}`, `${left} ${bottom}`, `${right} ${bottom}`, `${right} ${top}`, `${left} ${top}`, '0 0');
    });
    return `polygon(${points.join(', ')})`;
};

// The Worker's answers, kept for the visit. A miss isn't kept, so it's asked again when the song comes up.
const matches = new Map<string, Promise<string | null>>();

const findVideo = (url: string) => {
    const source = streamSource(url);
    if (source.videoId) return Promise.resolve(source.videoId);
    if (!matches.has(url)) {
        const song = source.spotify ? { spotify: source.spotify } : { artist: source.artist ?? '', title: source.title ?? '' };
        matches.set(
            url,
            matchSong(song)
                .catch(() => null)
                .then((match) => {
                    if (!match?.videoId) matches.delete(url);
                    return match?.videoId ?? null;
                }),
        );
    }
    return matches.get(url)!;
};

/**
 * Puts the site's volume on the player. YouTube's player keeps a volume and mute of its own, which it
 * brings back when a video loads, so this runs then too, not only when the site's slider moves.
 */
const applyVolume = (player: Player) => {
    const volume = Math.round(useAudioStore.getState().volume * 100);
    if (MUTED || volume === 0) return player.mute();
    player.unMute();
    player.setVolume(volume);
};

// Make the player ahead of time, once the visitor is in and the browser has a moment, so the first
// song from YouTube doesn't wait for YouTube's script and frame to load
const whenIdle = (run: () => void) => {
    if ('requestIdleCallback' in window) {
        const id = window.requestIdleCallback(run, { timeout: 4000 });
        return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(run, 2000);
    return () => clearTimeout(id);
};

// The YouTube player, looking like the <audio> element to the store and the controls
const asMedia = (player: Player): Media => ({
    get paused() {
        const state = player.getPlayerState();
        return state !== PLAYING && state !== BUFFERING;
    },
    get currentTime() {
        return player.getCurrentTime() || 0;
    },
    set currentTime(seconds: number) {
        player.seekTo(seconds, true);
    },
    get duration() {
        return player.getDuration() || 0;
    },
    play: async () => player.playVideo(),
    pause: () => player.pauseVideo(),
});

/**
 * The site's YouTube player: songs whose `url` isn't a file (common/music.ts) play here, in the same
 * shuffle as the rest, through the same controls. It's YouTube's own embedded player, made ahead of
 * time once the visitor is in (or as soon as a song needs it) and laid over the cover of whichever
 * player is on screen. It stays hidden, with the cover showing, until the song's video starts.
 *
 * YouTube's rules shape it (docs/music.md): the video is always visible while it plays, and never
 * under 200×200. It keeps playing in a hidden tab, like the site's own tracks, which Jake chose
 * knowing YouTube's policies forbid it.
 *
 * It also brings in the songs on Jake's Spotify playlist, when the listening Worker is there.
 */
export const YouTubePlayer = () => {
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const entered = useAudioStore((store) => store.entry !== 'waiting');
    const nextUrl = useAudioStore((store) => store.shuffled[0]);
    const streamed = isStreamed(audioUrl);
    const frameRef = useRef<HTMLDivElement>(null);
    const hostRef = useRef<HTMLDivElement>(null);
    const player = useRef<Player | null>(null);
    const [ready, setReady] = useState(false);
    const [wanted, setWanted] = useState(false);
    // The track whose video is loaded
    const loaded = useRef<string>();
    // The track whose video has started, which is when the player shows over the cover
    const [started, setStarted] = useState<string>();

    // The Spotify playlist joins the shuffle
    useEffect(() => {
        getPlaylist().then((tracks) => {
            if (!tracks?.length) return;
            useAudioStore.getState().addToLibrary(
                tracks.map((track) => ({ image: track.cover ?? '', title: track.title, artist: track.artists.join(', '), description: '', url: spotifyUrl(track.id), date: '' })),
            );
        });
    }, []);

    // The player is wanted once the visitor is in and the browser is idle, or straight away for a song from YouTube
    useEffect(() => {
        if (streamed) setWanted(true);
        if (wanted || !entered) return;
        return whenIdle(() => setWanted(true));
    }, [streamed, entered, wanted]);

    // Make the player. It stays for the rest of the visit.
    useEffect(() => {
        if (!wanted || player.current) return;
        loadYouTubeApi().then((YT) => {
            if (player.current || !hostRef.current) return;
            const isCurrent = () => loaded.current === useAudioStore.getState().audioUrl;
            player.current = new YT.Player(hostRef.current, {
                width: '100%',
                height: '100%',
                playerVars: { playsinline: 1, rel: 0 },
                events: {
                    onReady: ({ target }: { target: Player }) => {
                        applyVolume(target);
                        useAudioStore.setState({ youtube: asMedia(target) });
                        setReady(true);
                    },
                    onStateChange: ({ data, target }: { data: number; target: Player }) => {
                        // Only the current song's video speaks for the player
                        if (!isCurrent()) return;
                        if (data === PLAYING) {
                            applyVolume(target);
                            setStarted(loaded.current);
                            useAudioStore.setState({ isPlaying: true });
                        }
                        if (data === PAUSED || data === ENDED) useAudioStore.setState({ isPlaying: false });
                        if (data === ENDED) useAudioStore.getState().playNext();
                    },
                    // The owner doesn't allow embedding, or it's gone: on to the next song
                    onError: () => isCurrent() && useAudioStore.getState().playNext(),
                    // The browser wants a click in the player itself, so it shows to take one
                    onAutoplayBlocked: () => {
                        setStarted(loaded.current);
                        useAudioStore.setState({ isPlaying: false });
                    },
                },
            });
        });
    }, [wanted]);

    // Look up the next song's video while this one plays, so it starts sooner when its turn comes
    useEffect(() => {
        if (isStreamed(nextUrl)) findVideo(nextUrl);
    }, [nextUrl]);

    // Load the current song's video, or stop it when the song isn't from YouTube
    useEffect(() => {
        const yt = player.current;
        if (!ready || !yt || !audioUrl) return;
        if (!streamed) {
            if (loaded.current) yt.stopVideo();
            loaded.current = undefined;
            return;
        }
        if (loaded.current === audioUrl) return;

        let cancelled = false;
        loaded.current = undefined;
        yt.stopVideo();
        findVideo(audioUrl).then((videoId) => {
            if (cancelled) return;
            if (!videoId) {
                console.warn(`No YouTube copy of ${findTrack(audioUrl)?.title ?? audioUrl}, skipping it`);
                useAudioStore.getState().playNext();
                return;
            }
            loaded.current = audioUrl;
            yt.loadVideoById({ videoId });
            applyVolume(yt);
        });
        return () => {
            cancelled = true;
        };
    }, [audioUrl, streamed, ready]);

    // The volume follows the site's
    useEffect(() => {
        if (!ready) return;
        return useAudioStore.subscribe((store, previous) => {
            if (store.volume !== previous.volume && player.current) applyVolume(player.current);
        });
    }, [ready]);

    // Lay the player over the slot on screen, every frame, written straight onto the element like the
    // visualizer. It takes the slot's own size, even under YouTube's 200×200: the board's one-cell Now
    // Playing tile has a smaller cover, and Jake chose the video there over a floating copy (docs/music.md).
    useEffect(() => {
        if (!streamed) {
            useVideoStore.setState({ inFloating: false });
            return;
        }
        let frame = 0;
        let last = '';
        let lastSlot: HTMLElement | undefined;
        let radius = '16px';
        const place = () => {
            frame = requestAnimationFrame(place);
            const element = frameRef.current;
            if (!element) return;
            const slot = pickSlot();
            const inFloating = slot?.kind === 'floating';
            if (inFloating !== useVideoStore.getState().inFloating) useVideoStore.setState({ inFloating });
            if (slot?.element !== lastSlot) {
                lastSlot = slot?.element;
                radius = slot ? getComputedStyle(slot.element).borderRadius : '16px';
            }

            let x = EDGE;
            let y = window.innerHeight - EDGE - MIN_SIZE;
            let width = MIN_SIZE;
            let height = MIN_SIZE;
            let angle = 0;
            if (slot) {
                // The slot's own size, turned to match it. Its bounding box is bigger than it while its tile
                // leans, so the square video stuck out past the cover, and shimmered at the edges as it grew.
                const rect = slot.element.getBoundingClientRect();
                angle = angleOf(slot.element);
                const size = turnedSize(rect, angle);
                width = size.width;
                height = size.height;
                x = rect.left + rect.width / 2 - width / 2;
                y = rect.top + rect.height / 2 - height / 2;
            }
            const clip = clipAround(x, y, width, height);
            const next = `${x}|${y}|${width}|${height}|${angle}|${radius}|${clip}`;
            if (next === last) return;
            last = next;
            element.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;
            element.style.width = `${width}px`;
            element.style.height = `${height}px`;
            element.style.borderRadius = radius;
            element.style.clipPath = clip;
        };
        frame = requestAnimationFrame(place);
        return () => cancelAnimationFrame(frame);
    }, [streamed]);

    const track = findTrack(audioUrl);
    const showing = streamed && started === audioUrl;
    return createPortal(
        <div ref={frameRef} className={`youtube-player${showing ? ' youtube-player--on' : ''}`} aria-label={track ? `${track.title} on YouTube` : undefined} aria-hidden={!showing} role='region'>
            <div ref={hostRef} />
        </div>,
        document.body,
    );
};
