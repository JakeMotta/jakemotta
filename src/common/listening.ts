/**
 * Jake's ListenBrainz account (listenbrainz.org/user/draymothisk). The listening card and the Lately
 * panel read everything from it, and show nothing while it's empty. Spotify reaches it through ListenBrainz's own Spotify link, YouTube
 * Music on the web through Web Scrobbler, and the iPhone's YouTube Music plays through the sync job
 * in scripts/ytmusic-sync. See docs/listening.md.
 */
export const LISTENBRAINZ_USER = 'draymothisk';

/** How often the card asks ListenBrainz what's playing, while the page is visible */
export const LISTENING_POLL_MS = 30_000;

/**
 * "3h ago", never a clock time: when Jake listens says when he sleeps. The iPhone sync only knows the
 * day a song was played, so its times are rough anyway.
 */
export const listenedAgo = (seconds: number) => {
    const minutes = Math.round((Date.now() / 1000 - seconds) / 60);
    if (minutes < 2) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.round(hours / 24);
    return days < 30 ? `${days}d ago` : `${Math.round(days / 30)}mo ago`;
};
