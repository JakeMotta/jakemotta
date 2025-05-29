import { create } from "zustand";

export interface CommonProps {
  musicEnabled: boolean;
  setMusicEnabled: (musicEnabled: boolean) => void;

  isMusicPlaying: boolean;
  setIsMusicPlaying: (isMusicPlaying: boolean) => void;
}

export const useCommonStore = create<CommonProps>((set) => ({
  musicEnabled: false,
  setMusicEnabled: (musicEnabled: boolean) => set({ musicEnabled }),

  isMusicPlaying: false,
  setIsMusicPlaying: (isMusicPlaying: boolean) => set({ isMusicPlaying }),
}));
