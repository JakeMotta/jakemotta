/**
 * Reads Jake's listening from ListenBrainz's public API. Reads need no key and ListenBrainz allows
 * them from any origin, so this runs straight from the browser. Everything is turned into the two
 * small shapes the UI uses, `Listen` and `TopItem`, here, so no component reads ListenBrainz's own.
 */

const API = 'https://api.listenbrainz.org/1';

export type ListenSource = 'spotify' | 'youtube-music' | 'other';

export interface Listen {
    title: string;
    artist: string;
    album?: string;
    /** Unix seconds. Absent for the track playing now. */
    listenedAt?: number;
    source: ListenSource;
    /** Where the track opens: its Spotify or YouTube Music page */
    link?: string;
    spotifyUrl?: string;
    videoId?: string;
    /** A cover known without another request: the Cover Art Archive's or the YouTube thumbnail */
    cover?: string;
}

export interface TopItem {
    title: string;
    subtitle?: string;
    count: number;
    cover?: string;
}

export type TopKind = 'recordings' | 'release-groups' | 'artists';

/**
 * ListenBrainz recalculates statistics now and then rather than live. The ranges it hasn't counted
 * yet answer 204, which comes back from getTop as null.
 */
export type TopRange = 'this_month' | 'this_year' | 'all_time';

// The parts of ListenBrainz's responses that are read here
interface RawListen {
    listened_at?: number;
    track_metadata: {
        artist_name: string;
        track_name: string;
        release_name?: string;
        additional_info?: Record<string, unknown>;
        mbid_mapping?: { caa_id?: number; caa_release_mbid?: string };
    };
}

interface RawTop {
    artist_name: string;
    listen_count: number;
    track_name?: string;
    release_group_name?: string;
    caa_id?: number;
    caa_release_mbid?: string;
}

const getJson = async <T>(path: string): Promise<T | null> => {
    const response = await fetch(`${API}${path}`, { signal: AbortSignal.timeout(10_000) });
    if (response.status === 204) return null;
    if (!response.ok) throw new Error(`ListenBrainz answered ${response.status} for ${path}`);
    return response.json();
};

const caaCover = (mbid?: string, id?: number) => (mbid && id ? `https://coverartarchive.org/release/${mbid}/${id}-250.jpg` : undefined);

const youtubeVideoId = (url?: string) => {
    if (!url) return undefined;
    try {
        const { hostname, searchParams } = new URL(url);
        return /(^|\.)youtube\.com$/.test(hostname) ? searchParams.get('v') ?? undefined : undefined;
    } catch {
        return undefined;
    }
};

const text = (value: unknown) => (typeof value === 'string' && value ? value : undefined);

export const toListen = ({ listened_at, track_metadata: track }: RawListen): Listen => {
    const info = track.additional_info ?? {};
    const originUrl = text(info.origin_url);
    const spotifyUrl = text(info.spotify_id) ?? (originUrl?.startsWith('https://open.spotify.com/') ? originUrl : undefined);
    const videoId = youtubeVideoId(originUrl);
    // Web Scrobbler names the service; ListenBrainz's Spotify link and the iPhone sync give its domain
    const service = `${text(info.music_service) ?? ''} ${text(info.music_service_name) ?? ''}`.toLowerCase();
    const source: ListenSource = spotifyUrl || service.includes('spotify') ? 'spotify' : videoId || service.includes('youtube') ? 'youtube-music' : 'other';

    return {
        title: track.track_name,
        artist: track.artist_name,
        album: text(track.release_name),
        listenedAt: listened_at,
        source,
        link: spotifyUrl ?? (videoId ? `https://music.youtube.com/watch?v=${videoId}` : undefined),
        spotifyUrl,
        videoId,
        // The video's thumbnail is the album art for YouTube Music's own uploads; the CAA's is better still
        cover: caaCover(track.mbid_mapping?.caa_release_mbid, track.mbid_mapping?.caa_id) ?? (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : undefined),
    };
};

/** What's playing right now, or null when nothing is */
export const getPlayingNow = async (user: string) => {
    const data = await getJson<{ payload: { listens: RawListen[] } }>(`/user/${encodeURIComponent(user)}/playing-now`);
    const listen = data?.payload.listens[0];
    return listen ? { ...toListen(listen), listenedAt: undefined } : null;
};

/** The latest finished plays, newest first */
// The last 100 plays: the library's Recent listens tab shows them all
export const getRecentListens = async (user: string, count = 100) => {
    const data = await getJson<{ payload: { listens: RawListen[] } }>(`/user/${encodeURIComponent(user)}/listens?count=${count}`);
    return data?.payload.listens.map(toListen) ?? [];
};

/** Top songs, albums or artists over a range, or null while ListenBrainz hasn't counted that range */
export const getTop = async (user: string, kind: TopKind, range: TopRange, count = 50): Promise<TopItem[] | null> => {
    const data = await getJson<{ payload: Record<string, RawTop[]> }>(`/stats/user/${encodeURIComponent(user)}/${kind}?range=${range}&count=${count}`);
    if (!data) return null;
    const items = data.payload[kind.replace('-', '_')] ?? [];
    return items.map((item) => ({
        title: item.track_name ?? item.release_group_name ?? item.artist_name,
        subtitle: kind === 'artists' ? undefined : item.artist_name,
        count: item.listen_count,
        cover: caaCover(item.caa_release_mbid, item.caa_id),
    }));
};

const spotifyCovers = new Map<string, Promise<string | undefined>>();

/**
 * The cover for a Spotify track that ListenBrainz hasn't matched to MusicBrainz yet, which includes
 * whatever is playing now. Spotify's oEmbed answers without a key and from any origin. Each track is
 * asked about once per visit.
 */
export const getSpotifyCover = (spotifyUrl: string) => {
    let cover = spotifyCovers.get(spotifyUrl);
    if (!cover) {
        cover = fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`, { signal: AbortSignal.timeout(10_000) })
            .then((response) => (response.ok ? response.json() : undefined))
            .then((data) => text(data?.thumbnail_url))
            .catch(() => undefined);
        spotifyCovers.set(spotifyUrl, cover);
    }
    return cover;
};
