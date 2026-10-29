/**
 * Talks to the listening Worker (workers/listening): what Jake's Spotify is playing, to the second,
 * and the YouTube copy of it. Unlike ListenBrainz this needs Spotify's keys, which only the Worker
 * holds. See docs/listening.md.
 */

const NOW = '/api/listening/now';

export interface NowPlayingTrack {
    id: string;
    title: string;
    artists: string[];
    album?: string;
    durationMs: number;
    cover?: string;
    url?: string;
}

export interface NowAnswer {
    playing: {
        isPlaying: boolean;
        progressMs: number;
        // The Worker's clock when Spotify answered
        fetchedAt: number;
        track: NowPlayingTrack;
    } | null;
    // Present when asked for. null: no YouTube copy could be found (or the day's search quota is spent).
    // synced: the copy has the same audio as Spotify's, so it can join mid-song.
    youtube?: { videoId: string; synced: boolean } | null;
}

/**
 * The Worker's answer, or undefined when it isn't there: not deployed yet, or `yarn dev` running
 * without it, where CRA answers the path with the app's own HTML.
 */
export const getNow = async (withYoutube: boolean): Promise<NowAnswer | undefined> => {
    try {
        const response = await fetch(withYoutube ? `${NOW}?youtube=1` : NOW, { signal: AbortSignal.timeout(10_000) });
        if (!response.ok || !response.headers.get('Content-Type')?.includes('application/json')) return undefined;
        return await response.json();
    } catch {
        return undefined;
    }
};

/** Where Jake is in the song now, in seconds, allowing for how old the answer is */
export const positionNow = (playing: NonNullable<NowAnswer['playing']>) => (playing.progressMs + (playing.isPlaying ? Date.now() - playing.fetchedAt : 0)) / 1000;

/** A song from Jake's Spotify playlist, as the Worker sends it */
export interface PlaylistTrack {
    id: string;
    title: string;
    artists: string[];
    album?: string;
    durationMs?: number;
    cover?: string;
    url?: string;
}

const getWorkerJson = async <T>(path: string): Promise<T | undefined> => {
    try {
        const response = await fetch(path, { signal: AbortSignal.timeout(10_000) });
        if (!response.ok || !response.headers.get('Content-Type')?.includes('application/json')) return undefined;
        return await response.json();
    } catch {
        return undefined;
    }
};

/** The songs on Jake's Spotify playlist, which join the shuffle, or undefined when the Worker isn't there */
export const getPlaylist = async () => (await getWorkerJson<{ tracks: PlaylistTrack[] }>('/api/listening/playlist'))?.tracks;

/** One of Jake's most-played artists on Spotify, as the Worker sends it, with their top song when he has one */
export interface TopArtist {
    name: string;
    image?: string;
    url?: string;
    song?: PlaylistTrack;
}

/** Jake's 50 most-played artists on Spotify over its longest range, or undefined when the Worker can't say */
export const getTopArtists = async () => (await getWorkerJson<{ artists: TopArtist[] }>('/api/listening/top-artists'))?.artists;

/**
 * The YouTube copy of one of Jake's songs: a Spotify track by its ID, or a song by artist and title.
 * The Worker only looks up songs from his playlist, his Spotify top songs and his ListenBrainz history. null when there's
 * nothing to play: no copy was found, it isn't one of his, or the Worker isn't there.
 */
export const matchSong = async (song: { spotify: string } | { artist: string; title: string }) => {
    const answer = await getWorkerJson<{ youtube: { videoId: string; synced: boolean } | null }>(`/api/listening/match?${new URLSearchParams(song)}`);
    return answer?.youtube ?? null;
};
