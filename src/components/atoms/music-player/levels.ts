/**
 * The current track's band levels, 0 at rest to 1 at full, written by the MusicPlayer's analyser loop
 * every frame. Small visualizers (the eq bars) read them in their own animation loops, so per-frame
 * values never pass through React state.
 */
export const audioLevels = { lows: 0, highs: 0 };
