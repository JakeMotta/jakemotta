import { create } from 'zustand';

interface AudioStore {
    audioUrl: string | undefined;
    setAudioUrl: (url: string | undefined) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
    audioUrl: undefined,
    setAudioUrl: (url) => set({ audioUrl: url }),
})); 