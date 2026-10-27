/**
 * YouTube's IFrame Player API, loaded once and shared by the two players that use it: the site's own
 * (atoms/youtube-player), for songs that play from YouTube, and listen-along's (atoms/listen-along).
 */

// The parts of the IFrame Player API used here
export interface YouTubePlayer {
    loadVideoById(options: { videoId: string; startSeconds?: number }): void;
    cueVideoById(options: { videoId: string; startSeconds?: number }): void;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): number;
    setVolume(volume: number): void;
    mute(): void;
    destroy(): void;
}

export interface YouTubeApi {
    Player: new (element: HTMLElement, options: object) => YouTubePlayer;
}

declare global {
    interface Window {
        YT?: YouTubeApi;
        onYouTubeIframeAPIReady?: () => void;
    }
}

export const UNSTARTED = -1;
export const ENDED = 0;
export const PLAYING = 1;
export const PAUSED = 2;
export const BUFFERING = 3;

let youtubeApi: Promise<YouTubeApi> | undefined;

export const loadYouTubeApi = () =>
    (youtubeApi ??= new Promise((resolve) => {
        if (window.YT?.Player) return resolve(window.YT);
        const previous = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            previous?.();
            if (window.YT) resolve(window.YT);
        };
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.head.appendChild(script);
    }));

// The preview server keeps the site silent (src/muteAudio.js), but can't reach into YouTube's
// cross-origin frame, so each player mutes itself instead
export const MUTED = !!process.env.REACT_APP_MUTE_AUDIO;

/** A video's thumbnail. For YouTube Music's own uploads it's the album art. */
export const youtubeThumbnail = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
