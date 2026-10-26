import { create } from 'zustand';
import { LIBRARY } from '../common/music';
import { welcomeTrack } from '../common/constants';

/** Whether the visitor has chosen yet: the board waits until they pick sound or silence */
export type Entry = 'waiting' | 'sound' | 'silent';

interface AudioStore {
    audioUrl: string | undefined;
    // Tracks the visitor queued, played in order before anything else
    queue: string[];
    // What plays once the queue runs dry: the library, shuffled. Kept topped up so "Up next" always has something to show.
    shuffled: string[];
    // Tracks that played before this one, oldest first, for Previous
    history: string[];
    entry: Entry;
    isPlaying: boolean;
    volume: number;
    // The player's one <audio> element and its AudioContext, registered by MusicPlayer so any control can drive them
    audioElement: HTMLAudioElement | null;
    audioContext: AudioContext | null;
    setAudioUrl: (url: string) => void;
    enterSilently: () => void;
    toggleQueued: (url: string) => void;
    clearQueue: () => void;
    // Plays the next queued track, else the next shuffled one
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
const topUp = (shuffled: string[], playing: string | undefined) => (shuffled.length ? shuffled : shuffle(LIBRARY.filter((url) => url !== playing)));

const remember = (history: string[], url: string | undefined) => (url ? [...history, url].slice(-HISTORY_LIMIT) : history);

// The click that called this is the user gesture browsers want, so the context resumes inside it
const play = async (element: HTMLAudioElement, context: AudioContext | null) => {
    try {
        if (context?.state === 'suspended') await context.resume();
        await element.play();
    } catch (error) {
        console.error('Error playing audio:', error);
    }
};

export const useAudioStore = create<AudioStore>((set, get) => ({
    audioUrl: undefined,
    queue: [],
    shuffled: shuffle(LIBRARY),
    history: [],
    entry: 'waiting',
    isPlaying: false,
    volume: 1,
    audioElement: null,
    audioContext: null,
    // Playing a queued or shuffled track now takes it out of line. Picking the track that's already loaded just resumes it.
    setAudioUrl: (url) => {
        const { audioUrl, audioElement, audioContext } = get();
        if (url === audioUrl) {
            if (audioElement?.paused) play(audioElement, audioContext);
            return;
        }
        set(({ queue, shuffled, history }) => ({
            audioUrl: url,
            entry: 'sound',
            queue: queue.filter((queued) => queued !== url),
            shuffled: topUp(
                shuffled.filter((next) => next !== url),
                url,
            ),
            history: remember(history, audioUrl),
        }));
    },
    enterSilently: () => set({ entry: 'silent' }),
    toggleQueued: (url) => set(({ queue }) => ({ queue: queue.includes(url) ? queue.filter((queued) => queued !== url) : [...queue, url] })),
    clearQueue: () => set({ queue: [] }),
    playNext: () => {
        const { audioUrl, queue, shuffled, history } = get();
        if (queue.length) {
            set({ audioUrl: queue[0], queue: queue.slice(1), history: remember(history, audioUrl), entry: 'sound' });
            return;
        }
        const upNext = topUp(shuffled, audioUrl);
        if (!upNext.length) return;
        set({ audioUrl: upNext[0], shuffled: topUp(upNext.slice(1), upNext[0]), history: remember(history, audioUrl), entry: 'sound' });
    },
    playPrevious: () => {
        const { audioUrl, audioElement, history, shuffled } = get();
        if (audioElement && (audioElement.currentTime > RESTART_AFTER || !history.length)) {
            audioElement.currentTime = 0;
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
        const { audioUrl, audioElement, audioContext, setAudioUrl } = get();
        if (!audioUrl) {
            setAudioUrl(welcomeTrack.url);
            return;
        }
        if (!audioElement) return;
        if (audioElement.paused) play(audioElement, audioContext);
        else audioElement.pause();
    },
    setVolume: (volume) => {
        const { audioElement } = get();
        if (audioElement) audioElement.volume = volume;
        set({ volume });
    },
}));
