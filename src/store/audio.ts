import { create } from 'zustand';

interface AudioStore {
    audioContext: AudioContext | null;
    analyser: AnalyserNode | null;
    source: MediaElementAudioSourceNode | null;
    setAudioContext: (context: AudioContext | null) => void;
    setAnalyser: (analyser: AnalyserNode | null) => void;
    setSource: (source: MediaElementAudioSourceNode | null) => void;
    audioUrl: string | undefined;
    setAudioUrl: (url: string | undefined) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
    audioContext: null,
    analyser: null,
    source: null,
    setAudioContext: (context) => set({ audioContext: context }),
    setAnalyser: (analyser) => set({ analyser }),
    setSource: (source) => set({ source }),
    audioUrl: undefined,
    setAudioUrl: (url) => set({ audioUrl: url }),
})); 