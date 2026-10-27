import React, { useEffect, useRef, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { MdGraphicEq } from 'react-icons/md';
import { positionNow } from '../../../api/listen-along';
import { useAudioStore } from '../../../store/audio';
import { supportsTabCapture, useListenAlongStore } from '../../../store/listen-along';
import './index.scss';

// How often to check what Jake is playing while listening along, and how far off before jumping back in line
const POLL_MS = 5_000;
const DRIFT_SECONDS = 4;

// The parts of YouTube's IFrame Player API used here
interface YouTubePlayer {
    loadVideoById(options: { videoId: string; startSeconds?: number }): void;
    cueVideoById(options: { videoId: string; startSeconds?: number }): void;
    playVideo(): void;
    pauseVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    getCurrentTime(): number;
    getPlayerState(): number;
    destroy(): void;
}

interface YouTubeApi {
    Player: new (element: HTMLElement, options: object) => YouTubePlayer;
}

declare global {
    interface Window {
        YT?: YouTubeApi;
        onYouTubeIframeAPIReady?: () => void;
    }
}

const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;

let youtubeApi: Promise<YouTubeApi> | undefined;

const loadYouTubeApi = () =>
    (youtubeApi ??= new Promise((resolve) => {
        if (window.YT?.Player) return resolve(window.YT);
        const previous = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            previous?.();
            if (window.YT) resolve(window.YT);
        };
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.head.appendChild(script);
    }));

/**
 * The listen-along player: YouTube's own embedded player, floating over the site, playing the copy
 * of whatever Jake has on Spotify and keeping in step with him. It follows his skips and pauses, and
 * when he stops it finishes the song and closes.
 *
 * YouTube's rules shape it (docs/listening.md): the player is always visible and at least 200×200,
 * it pauses whenever the tab is hidden (no background play), and nothing covers or alters it.
 */
export const ListenAlong = () => {
    const active = useListenAlongStore((store) => store.active);
    const answer = useListenAlongStore((store) => store.answer);
    const capture = useListenAlongStore((store) => store.capture);
    const captureNote = useListenAlongStore((store) => store.captureNote);
    const { refresh, stop, startCapture, stopCapture } = useListenAlongStore.getState();
    const host = useRef<HTMLDivElement>(null);
    const player = useRef<YouTubePlayer | null>(null);
    const [ready, setReady] = useState(false);
    const [problem, setProblem] = useState<string>();
    // What's loaded, and whether the visitor paused it themselves (then it isn't forced back on)
    const loaded = useRef<{ videoId: string; synced: boolean } | null>(null);
    const ourPause = useRef(false);
    const visitorPaused = useRef(false);
    // Jake stopped: play out the current song, then close
    const finishing = useRef(false);

    // Make the player when listen-along starts, and take it down when it stops
    useEffect(() => {
        if (!active) return;
        let cancelled = false;
        loadYouTubeApi().then((YT) => {
            if (cancelled || !host.current) return;
            player.current = new YT.Player(host.current, {
                width: '100%',
                height: '100%',
                playerVars: { playsinline: 1, rel: 0 },
                events: {
                    onReady: () => setReady(true),
                    onStateChange: ({ data }: { data: number }) => {
                        if (data === PAUSED) {
                            visitorPaused.current = !ourPause.current;
                            ourPause.current = false;
                        }
                        if (data === PLAYING) visitorPaused.current = false;
                        if (data === ENDED && finishing.current) stop();
                    },
                    // 101 and 150: the owner doesn't allow embedding; 100: gone; 2 and 5: couldn't play
                    onError: () => setProblem("This one can't play here."),
                    onAutoplayBlocked: () => setProblem('Your browser held it back. Press play on the video.'),
                },
            });
        });
        return () => {
            cancelled = true;
            player.current?.destroy();
            player.current = null;
            loaded.current = null;
            finishing.current = false;
            visitorPaused.current = false;
            setReady(false);
            setProblem(undefined);
        };
    }, [active, stop]);

    // Ask the Worker what Jake's playing every few seconds, but only while the tab is showing
    useEffect(() => {
        if (!active) return;
        const timer = window.setInterval(() => document.visibilityState === 'visible' && refresh(), POLL_MS);
        const onVisibility = () => {
            if (document.visibilityState === 'visible') {
                refresh();
            } else if (player.current && ready) {
                ourPause.current = true;
                player.current.pauseVideo();
            }
        };
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            window.clearInterval(timer);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [active, ready, refresh]);

    // Starting the site's own music ends listen-along
    useEffect(() => {
        if (!active) return;
        return useAudioStore.subscribe((store, previous) => {
            if (store.isPlaying && !previous.isPlaying) stop(false);
        });
    }, [active, stop]);

    // Follow Jake
    useEffect(() => {
        const yt = player.current;
        if (!active || !ready || !yt || !answer) return;
        const { playing, youtube } = answer;

        if (!playing) {
            // He stopped. Let the song play out, unless nothing is playing anyway.
            finishing.current = true;
            if (!loaded.current || yt.getPlayerState() !== PLAYING) stop();
            return;
        }
        finishing.current = false;

        if (!youtube) {
            setProblem("Couldn't find this one on YouTube.");
            if (yt.getPlayerState() === PLAYING) {
                ourPause.current = true;
                yt.pauseVideo();
            }
            return;
        }

        const start = youtube.synced ? positionNow(playing) : 0;
        if (loaded.current?.videoId !== youtube.videoId) {
            setProblem(undefined);
            loaded.current = youtube;
            visitorPaused.current = false;
            if (playing.isPlaying) yt.loadVideoById({ videoId: youtube.videoId, startSeconds: start });
            else yt.cueVideoById({ videoId: youtube.videoId, startSeconds: start });
            return;
        }

        if (!playing.isPlaying) {
            if (yt.getPlayerState() === PLAYING) {
                ourPause.current = true;
                yt.pauseVideo();
            }
            return;
        }
        if (visitorPaused.current) return;
        if (yt.getPlayerState() !== PLAYING) yt.playVideo();
        if (youtube.synced && Math.abs(yt.getCurrentTime() - start) > DRIFT_SECONDS) yt.seekTo(start, true);
    }, [active, ready, answer, stop]);

    if (!active) return null;

    const track = answer?.playing?.track;
    const synced = answer?.youtube?.synced;
    return (
        <section className='listen-along' aria-label='Listening along with Jake'>
            <div className='listen-along__frame'>
                <div ref={host} />
            </div>
            <div className='listen-along__bar'>
                <span className='listen-along__text'>
                    <span className='listen-along__label'>{!answer ? 'Tuning in…' : synced ? 'In sync with Jake' : track ? 'Listening along' : 'Jake stopped'}</span>
                    {track && (
                        <span className='listen-along__track'>
                            {track.title} · {track.artists.join(', ')}
                        </span>
                    )}
                    {problem && (
                        <span className='listen-along__problem'>
                            {problem}{' '}
                            {track?.url && (
                                <a href={track.url} target='_blank' rel='noopener noreferrer'>
                                    Open in Spotify
                                </a>
                            )}
                        </span>
                    )}
                    {captureNote && <span className='listen-along__problem'>{captureNote}</span>}
                </span>
                {supportsTabCapture() && (
                    <button
                        type='button'
                        className='listen-along__capture'
                        aria-pressed={!!capture}
                        title={capture ? 'Stop sharing the sound' : 'Your browser will ask to share this tab. Keep "Also share tab audio" ticked, and the visualizer follows the song.'}
                        onClick={() => (capture ? stopCapture() : startCapture())}>
                        <MdGraphicEq aria-hidden /> {capture ? 'Visualizer on' : 'Light up the visualizer'}
                    </button>
                )}
                <button type='button' className='listen-along__close' aria-label='Stop listening along' onClick={() => stop()}>
                    <FiX />
                </button>
            </div>
        </section>
    );
};
