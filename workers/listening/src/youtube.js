// Finds the YouTube copy of a Spotify track, for visitors to listen along with.
//
// YouTube Music's own uploads ("Artist - Topic" channels) carry the album audio, so their timing
// matches Spotify's and the player can join Jake mid-song. A music video usually has an intro or a
// skit, so it's a last resort and plays from the top. Search costs 100 of the API's 10,000 free daily
// units, so each track is looked up once and the answer kept, and only when a visitor is listening along.

const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';

// YouTube's policies allow keeping API data for 30 days before it must be refreshed (III.E.4.d)
const MATCH_TTL = 30 * 24 * 60 * 60;
// A miss is worth asking again sooner: the song may be uploaded, or the quota may have run out
const MISS_TTL = 24 * 60 * 60;
// How far apart the two lengths may be for the player to sync to Spotify's position
const SYNC_TOLERANCE = 3;

/** "PT3M58S" in seconds */
export const parseDuration = (iso) => {
    const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso ?? '');
    return match ? Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0) : undefined;
};

const isTopic = (video, artists) => {
    const channel = video.channelTitle.toLowerCase();
    return channel.endsWith(' - topic') && artists.some((artist) => channel.startsWith(artist.toLowerCase()));
};

/**
 * The best of the search results for the track: an embeddable video within a few seconds of its
 * length, preferring YouTube Music's own upload, which then plays in sync. Failing that, the best
 * embeddable one, played from the top.
 */
export const pickVideo = (track, videos) => {
    const target = track.durationMs / 1000;
    const playable = videos.filter((video) => video.embeddable && video.durationSeconds);
    const gap = (video) => Math.abs(video.durationSeconds - target);
    const topicFirst = (a, b) => Number(isTopic(b, track.artists)) - Number(isTopic(a, track.artists));

    const synced = playable.filter((video) => gap(video) <= SYNC_TOLERANCE).sort((a, b) => topicFirst(a, b) || gap(a) - gap(b));
    if (synced.length) return { videoId: synced[0].id, synced: true };

    // Search order is YouTube's relevance; keep it among equals
    const fallback = [...playable].sort(topicFirst)[0];
    return fallback ? { videoId: fallback.id, synced: false } : null;
};

const youtube = async (url, params, key) => {
    const response = await fetch(`${url}?${new URLSearchParams({ ...params, key })}`);
    if (!response.ok) {
        const reason = (await response.json().catch(() => ({})))?.error?.errors?.[0]?.reason;
        throw new Error(`YouTube answered ${response.status}${reason ? ` (${reason})` : ''}`);
    }
    return response.json();
};

/**
 * The YouTube match for a Spotify track, from KV when it's been looked up before. A hand-picked
 * override, `yt-override:<spotify track id>` set with `wrangler kv key put`, always wins.
 */
export const findVideo = async (track, env) => {
    const override = await env.LISTENING.get(`yt-override:${track.id}`);
    if (override) return { videoId: override, synced: true };

    const key = `yt:${track.id}`;
    const cached = await env.LISTENING.get(key, 'json');
    if (cached) return cached.match;

    let match = null;
    try {
        const search = await youtube(
            SEARCH_URL,
            { part: 'snippet', type: 'video', videoEmbeddable: 'true', videoCategoryId: '10', maxResults: '8', q: `${track.artists[0] ?? ''} ${track.title}` },
            env.YOUTUBE_API_KEY,
        );
        const ids = (search.items ?? []).map((item) => item.id.videoId).filter(Boolean);
        if (ids.length) {
            const details = await youtube(VIDEOS_URL, { part: 'snippet,contentDetails,status', id: ids.join(',') }, env.YOUTUBE_API_KEY);
            const byId = new Map((details.items ?? []).map((item) => [item.id, item]));
            const videos = ids
                .map((id) => byId.get(id))
                .filter(Boolean)
                .map((item) => ({
                    id: item.id,
                    channelTitle: item.snippet?.channelTitle ?? '',
                    durationSeconds: parseDuration(item.contentDetails?.duration),
                    embeddable: item.status?.embeddable !== false,
                }));
            match = pickVideo(track, videos);
        }
    } catch (error) {
        // Most often the day's quota. Don't remember the miss for long.
        console.error(error.message);
        await env.LISTENING.put(key, JSON.stringify({ match: null }), { expirationTtl: 60 * 60 });
        return null;
    }

    await env.LISTENING.put(key, JSON.stringify({ match }), { expirationTtl: match ? MATCH_TTL : MISS_TTL });
    return match;
};
