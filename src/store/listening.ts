import { useEffect } from 'react';
import { create } from 'zustand';
import { getPlayingNow, getRecentListens, getTop, Listen, TopItem, TopKind, TopRange } from '../api/listenbrainz';
import { LISTENBRAINZ_USER, LISTENING_POLL_MS } from '../common/listening';

/**
 * What Jake is listening to, from ListenBrainz (see docs/listening.md). This is separate from the
 * audio store: nothing here plays on the site, it's only shown and linked out.
 */
interface ListeningStore {
    nowPlaying: Listen | null;
    recent: Listen[];
    // Set once the first live refresh has answered, so the UI can tell "nothing yet" from "loading"
    loaded: boolean;
    // Keyed `${kind}:${range}`. null means ListenBrainz hasn't counted that range yet.
    top: Record<string, TopItem[] | null | undefined>;
    refreshLive: () => Promise<void>;
    loadTop: (kind: TopKind, range: TopRange) => Promise<void>;
}

export const topKey = (kind: TopKind, range: TopRange) => `${kind}:${range}`;

export const useListeningStore = create<ListeningStore>((set, get) => ({
    nowPlaying: null,
    recent: [],
    loaded: false,
    top: {},
    refreshLive: async () => {
        if (!LISTENBRAINZ_USER) return;
        try {
            const [nowPlaying, recent] = await Promise.all([getPlayingNow(LISTENBRAINZ_USER), getRecentListens(LISTENBRAINZ_USER)]);
            set({ nowPlaying, recent, loaded: true });
        } catch {
            // Keep showing what was there; the next poll tries again
            set({ loaded: true });
        }
    },
    loadTop: async (kind, range) => {
        const key = topKey(kind, range);
        if (!LISTENBRAINZ_USER || get().top[key] !== undefined) return;
        try {
            const items = await getTop(LISTENBRAINZ_USER, kind, range);
            set((store) => ({ top: { ...store.top, [key]: items } }));
        } catch {
            set((store) => ({ top: { ...store.top, [key]: [] } }));
        }
    },
}));

// However many components want live data, there's one poll. It runs while at least one is mounted
// and the page is visible, and refreshes as soon as the page comes back into view.
let subscribers = 0;
let timer: number | undefined;

const tick = () => {
    if (document.visibilityState === 'visible') useListeningStore.getState().refreshLive();
};

const onVisibility = () => {
    window.clearInterval(timer);
    timer = undefined;
    if (document.visibilityState === 'visible') {
        tick();
        timer = window.setInterval(tick, LISTENING_POLL_MS);
    }
};

/** Keep nowPlaying and recent fresh while the calling component is mounted */
export const useLiveListening = () => {
    useEffect(() => {
        if (subscribers++ === 0) {
            document.addEventListener('visibilitychange', onVisibility);
            onVisibility();
        }
        return () => {
            if (--subscribers === 0) {
                document.removeEventListener('visibilitychange', onVisibility);
                window.clearInterval(timer);
                timer = undefined;
            }
        };
    }, []);
};
