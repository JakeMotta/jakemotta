import { create } from 'zustand';

interface AudioStore {
    audioUrl: string | undefined;
    // Tracks the visitor queued, played in order before anything else
    queue: string[];
    // What plays once the queue runs dry: the library, shuffled
    shuffled: string[];
    setAudioUrl: (url: string | undefined) => void;
    toggleQueued: (url: string) => void;
    // Plays the next queued track, else the next shuffled one. When the shuffle runs out it
    // reshuffles the library, leaving out the track that just played so it can't repeat back to back.
    playNext: (library: string[]) => void;
}

const shuffle = <T,>(items: T[]) => {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const useAudioStore = create<AudioStore>((set, get) => ({
    audioUrl: undefined,
    queue: [],
    shuffled: [],
    // Playing a queued track now takes it out of the queue
    setAudioUrl: (url) => set(({ queue }) => ({ audioUrl: url, queue: queue.filter((queued) => queued !== url) })),
    toggleQueued: (url) => set(({ queue }) => ({ queue: queue.includes(url) ? queue.filter((queued) => queued !== url) : [...queue, url] })),
    playNext: (library) => {
        const { audioUrl, queue, shuffled } = get();
        if (queue.length) {
            set({ audioUrl: queue[0], queue: queue.slice(1) });
            return;
        }
        const upNext = shuffled.length ? shuffled : shuffle(library.filter((url) => url !== audioUrl));
        if (!upNext.length) return;
        set({ audioUrl: upNext[0], shuffled: upNext.slice(1) });
    },
}));
