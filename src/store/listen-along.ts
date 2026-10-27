import { create } from 'zustand';
import { getNow, NowAnswer } from '../api/listen-along';
import { useAudioStore } from './audio';

/**
 * Listen along: a visitor plays the YouTube copy of whatever Jake has on Spotify, in sync with him.
 * The player is atoms/listen-along; this holds whether it's on and the Worker's latest answer.
 *
 * It also holds `capture`, the tab's own sound when the visitor opts in to lighting up the visualizer
 * (Chrome and Edge on desktop only). The YouTube player is a cross-origin frame the site's analyser
 * can't hear, so this is the only way the vignette can follow it. The music player feeds the stream
 * to its analyser and never to the speakers, since the tab is already playing it.
 */
interface ListenAlongStore {
    // Whether the Worker answers. undefined until asked.
    available: boolean | undefined;
    active: boolean;
    answer: NowAnswer | null;
    capture: MediaStream | null;
    captureNote: string | undefined;
    probe: () => Promise<void>;
    start: () => void;
    // resumeSite: play the site's music again if listen-along interrupted it
    stop: (resumeSite?: boolean) => void;
    refresh: () => Promise<void>;
    startCapture: () => Promise<void>;
    stopCapture: () => void;
}

// Whether the site's own music was playing when listen-along started
let interruptedSite = false;

export const useListenAlongStore = create<ListenAlongStore>((set, get) => ({
    available: undefined,
    active: false,
    answer: null,
    capture: null,
    captureNote: undefined,
    probe: async () => {
        if (get().available !== undefined) return;
        set({ available: (await getNow(false)) !== undefined });
    },
    start: () => {
        // Two songs at once is nobody's idea of fun
        const media = useAudioStore.getState().media();
        interruptedSite = !!media && !media.paused;
        media?.pause();
        set({ active: true, answer: null });
        get().refresh();
    },
    stop: (resumeSite = true) => {
        get().stopCapture();
        set({ active: false, answer: null });
        if (resumeSite && interruptedSite) useAudioStore.getState().togglePlayback();
        interruptedSite = false;
    },
    refresh: async () => {
        const answer = await getNow(true);
        if (!get().active) return;
        if (answer) set({ answer });
    },
    startCapture: async () => {
        set({ captureNote: undefined });
        try {
            // Chrome won't share a tab's sound without its picture, so the picture is asked for and
            // dropped. preferCurrentTab offers just this tab rather than the screen or other tabs.
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: { suppressLocalAudioPlayback: false },
                preferCurrentTab: true,
                selfBrowserSurface: 'include',
                surfaceSwitching: 'exclude',
                systemAudio: 'exclude',
                monitorTypeSurfaces: 'exclude',
            } as DisplayMediaStreamOptions);
            stream.getVideoTracks().forEach((track) => track.stop());
            const [audio] = stream.getAudioTracks();
            if (!audio) {
                stream.getTracks().forEach((track) => track.stop());
                set({ captureNote: 'Keep "Also share tab audio" ticked to light it up.' });
                return;
            }
            // Chrome's own "Stop sharing" ends it too
            audio.addEventListener('ended', () => get().stopCapture());
            set({ capture: stream });
        } catch (error) {
            // Cancelling the picker isn't worth a message
            if ((error as DOMException).name !== 'NotAllowedError') set({ captureNote: "Your browser couldn't share this tab's sound." });
        }
    },
    stopCapture: () => {
        get()
            .capture?.getTracks()
            .forEach((track) => track.stop());
        set({ capture: null });
    },
}));

interface UserAgentData {
    brands: { brand: string }[];
    mobile: boolean;
}

/** Only desktop Chrome and Edge can share a tab's sound with the page */
export const supportsTabCapture = () => {
    const data = (navigator as Navigator & { userAgentData?: UserAgentData }).userAgentData;
    const chromiumDesktop = data ? data.brands.some(({ brand }) => brand === 'Chromium') && !data.mobile : /Chrome\//.test(navigator.userAgent) && !/Mobi|Android/.test(navigator.userAgent);
    return chromiumDesktop && typeof navigator.mediaDevices?.getDisplayMedia === 'function';
};
