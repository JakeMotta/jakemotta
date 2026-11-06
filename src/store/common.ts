import { create } from "zustand";

export interface CommonProps {
    // An overlay (a tile opened over the board) is showing. The hue cycle takes bigger, rarer steps
    // meanwhile: the board is dimmed behind it, and a framed project, a Java game above all, runs on
    // the same thread and needs it (docs/board.md).
    overlayOpen: boolean;
}

export const useCommonStore = create<CommonProps>(() => ({
    overlayOpen: false,
}));
