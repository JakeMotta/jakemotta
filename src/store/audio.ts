import { create } from 'zustand';
import { addTracks, isStreamed, libraryUrls } from '../common/music';
import { MusicItemProps, welcomeTrack } from '../common/constants';

/** Whether the visitor has chosen yet: the board waits until they pick sound or silence */
export type Entry = 'waiting' | 'sound' | 'silent';

/** What the controls drive: the <audio> element, or the YouTube player standing in for one */
export type Media = Pick<HTMLMediaElement, 'paused' | 'currentTime' | 'duration' | 'play' | 'pause'>;

interface AudioStore {
    audioUrl: string | undefined;
    // What plays next: the whole library, shuffled. Kept topped up so "Up next" always has something to show.
    shuffled: string[];
    // Tracks that played before this one, oldest first, for Previous
    history: string[];
    entry: Entry;
    isPlaying: boolean;
    volume: number;
    // The player's one <audio> element and its AudioContext, registered by MusicPlayer so any control can drive them
    audioElement: HTMLAudioElement | null;
    audioContext: AudioContext | null;
    // The YouTube player (atoms/youtube-player), registered once it's ready, for the songs that play from YouTube
    youtube: Media | null;
    // Whichever of the two is playing the current track
    media: () => Media | null;
    setAudioUrl: (url: string) => void;
    // Plays a track from elsewhere (a play picked from Recent listens) that isn't in the library
    playTrack: (track: MusicItemProps) => void;
    // The songs from Jake's Spotify playlist, once the Worker sends them, for the library's Playlist tab
    playlist: MusicItemProps[];
    // Adds songs to the library and deals them into the shuffle (the Spotify playlist's)
    addToLibrary: (tracks: MusicItemProps[]) => void;
    enterSilently: () => void;
    // Plays the next track in the shuffle
    playNext: () => void;
    // Restarts the track if it's a few seconds in, else goes back to the one before it
    playPrevious: () => void;
    // Starts the welcome track when nothing has played yet
    togglePlayback: () => void;
    setVolume: (volume: number) => void;
}

const HISTORY_LIMIT = 50;
// Past this many seconds, Previous restarts the track instead of going back
const RESTART_AFTER = 3;

const shuffle = <T,>(items: T[]) => {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// When the shuffle runs out, deal the library again without the track that's playing, so it can't repeat back to back
const topUp = (shuffled: string[], playing: string | undefined) => (shuffled.length ? shuffled : shuffle(libraryUrls().filter((url) => url !== playing)));

// Songs that arrive later go in at random places, so they come round as often as the rest
const dealIn = (shuffled: string[], urls: string[]) => {
    const dealt = [...shuffled];
    urls.forEach((url) => dealt.splice(Math.floor(Math.random() * (dealt.length + 1)), 0, url));
    return dealt;
};

const remember = (history: string[], url: string | undefined) => (url ? [...history, url].slice(-HISTORY_LIMIT) : history);

// The click that called this is the user gesture browsers want, so the context resumes inside it
const play = async (media: Media, context: AudioContext | null) => {
    try {
        if (context?.state === 'suspended') await context.resume();
        await media.play();
    } catch (error) {
        console.error('Error playing audio:', error);
    }
};

export const useAudioStore = create<AudioStore>((set, get) => ({
    audioUrl: undefined,
    shuffled: shuffle(libraryUrls()),
    history: [],
    entry: 'waiting',
    isPlaying: false,
    volume: 1,
    audioElement: null,
    audioContext: null,
    youtube: null,
    playlist: [],
    media: () => {
        const { audioUrl, audioElement, youtube } = get();
        return isStreamed(audioUrl) ? youtube : audioElement;
    },
    // Picking a song plays it now, and takes it out of the shuffle so it doesn't come round again straight after. Picking the track that's already loaded just resumes it.
    setAudioUrl: (url) => {
        const { audioUrl, media, audioContext } = get();
        if (url === audioUrl) {
            const current = media();
            if (current?.paused) play(current, audioContext);
            return;
        }
        set(({ shuffled, history }) => ({
            audioUrl: url,
            entry: 'sound',
            shuffled: topUp(
                shuffled.filter((next) => next !== url),
                url,
            ),
            history: remember(history, audioUrl),
        }));
    },
    playTrack: (track) => {
        addTracks([track], false);
        get().setAudioUrl(track.url);
    },
    addToLibrary: (tracks) => {
        const added = addTracks(tracks, true);
        if (!added.length) return;
        set(({ shuffled, playlist }) => ({ shuffled: dealIn(shuffled, added), playlist: [...playlist, ...tracks.filter((track) => added.includes(track.url))] }));
    },
    enterSilently: () => set({ entry: 'silent' }),
    playNext: () => {
        const { audioUrl, shuffled, history } = get();
        const upNext = topUp(shuffled, audioUrl);
        if (!upNext.length) return;
        set({ audioUrl: upNext[0], shuffled: topUp(upNext.slice(1), upNext[0]), history: remember(history, audioUrl), entry: 'sound' });
    },
    playPrevious: () => {
        const { audioUrl, media, history, shuffled } = get();
        const current = media();
        if (current && (current.currentTime > RESTART_AFTER || !history.length)) {
            current.currentTime = 0;
            return;
        }
        if (!history.length) return;
        // The track we leave goes back to the front of the shuffle, so Next returns to it
        set({
            audioUrl: history[history.length - 1],
            history: history.slice(0, -1),
            shuffled: audioUrl ? [audioUrl, ...shuffled.filter((next) => next !== audioUrl)] : shuffled,
        });
    },
    togglePlayback: () => {
        const { audioUrl, media, audioContext, setAudioUrl } = get();
        if (!audioUrl) {
            setAudioUrl(welcomeTrack.url);
            return;
        }
        const current = media();
        if (!current) return;
        if (current.paused) play(current, audioContext);
        else current.pause();
    },
    // The YouTube player follows the volume through the store
    setVolume: (volume) => {
        const { audioElement } = get();
        if (audioElement) audioElement.volume = volume;
        set({ volume });
    },
}));
