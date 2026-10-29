import { getNowPlaying, getPlaylist, getTopArtists, isHidden, SpotifyError } from './spotify.js';
import { findSong } from './songs.js';
import { findVideo } from './youtube.js';

/**
 * GET /api/listening/now              what Jake's Spotify is playing, to the second
 * GET /api/listening/now?youtube=1    the same, plus the YouTube copy to listen along with
 * GET /api/listening/playlist         the songs on Jake's Spotify playlist, which join the site's shuffle
 * GET /api/listening/top-artists      Jake's most-played artists on Spotify, for the library's Favorite artists
 * GET /api/listening/match?spotify=<track id>
 * GET /api/listening/match?artist=<artist>&title=<title>
 *                                     the YouTube copy of one of Jake's songs, for the site's player
 *
 * Answers to /now are cached for 5 seconds, so however many visitors are listening along, Spotify is
 * asked at most once per 5 seconds per Cloudflare location. The others change far less often.
 */
const CACHE_SECONDS = 5;
const PLAYLIST_CACHE_SECONDS = 10 * 60;
const MATCH_CACHE_SECONDS = 60 * 60;
const TOP_CACHE_SECONDS = 6 * 60 * 60;
// Longer than any artist or title worth looking up
const MAX_QUERY = 200;

const json = (body, status = 200, headers = {}) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': `public, max-age=${CACHE_SECONDS}`, ...headers },
    });

const failed = (error) => {
    const status = error instanceof SpotifyError ? error.status : 500;
    console.error(error.message);
    return json({ error: 'Unavailable right now' }, status, { 'Cache-Control': 'no-store', ...(error.retryAfter ? { 'Retry-After': error.retryAfter } : {}) });
};

// Answers from Cloudflare's cache under a key holding only the parameters that matter, so nothing
// else in the URL can bypass it
const fromCache = async (key, ctx, answer) => {
    const cache = typeof caches === 'undefined' ? undefined : caches.default;
    const request = new Request(key);
    const hit = await cache?.match(request);
    if (hit) return hit;
    const response = await answer();
    if (cache && response.status === 200) ctx.waitUntil(cache.put(request, response.clone()));
    return response;
};

const playlist = async (env) => {
    try {
        const tracks = (await getPlaylist(env)).filter((track) => !isHidden(track, env.HIDDEN));
        return json({ tracks }, 200, { 'Cache-Control': `public, max-age=${PLAYLIST_CACHE_SECONDS}` });
    } catch (error) {
        return failed(error);
    }
};

const topArtists = async (env) => {
    try {
        const artists = (await getTopArtists(env))
            .filter((artist) => !isHidden({ artists: [artist.name], title: '' }, env.HIDDEN))
            .map(({ song, ...artist }) => (song && !isHidden(song, env.HIDDEN) ? { ...artist, song } : artist));
        return json({ artists }, 200, { 'Cache-Control': `public, max-age=${TOP_CACHE_SECONDS}` });
    } catch (error) {
        return failed(error);
    }
};

const match = async (query, env) => {
    try {
        const song = await findSong(env, query);
        if (!song || isHidden(song, env.HIDDEN)) return json({ error: "Not one of Jake's songs" }, 404, { 'Cache-Control': 'no-store' });
        return json({ youtube: await findVideo(song, env) }, 200, { 'Cache-Control': `public, max-age=${MATCH_CACHE_SECONDS}` });
    } catch (error) {
        return failed(error);
    }
};

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        if (request.method !== 'GET') return json({ error: 'GET only' }, 405, { 'Cache-Control': 'no-store', Allow: 'GET' });

        if (url.pathname === '/api/listening/playlist') return fromCache(`${url.origin}${url.pathname}`, ctx, () => playlist(env));
        if (url.pathname === '/api/listening/top-artists') return fromCache(`${url.origin}${url.pathname}`, ctx, () => topArtists(env));

        if (url.pathname === '/api/listening/match') {
            const spotify = url.searchParams.get('spotify') ?? '';
            const artist = url.searchParams.get('artist') ?? '';
            const title = url.searchParams.get('title') ?? '';
            if (spotify ? !/^[A-Za-z0-9]{1,40}$/.test(spotify) : !artist || !title || artist.length > MAX_QUERY || title.length > MAX_QUERY) {
                return json({ error: 'Give spotify, or artist and title' }, 400, { 'Cache-Control': 'no-store' });
            }
            const query = spotify ? { spotify } : { artist, title };
            return fromCache(`${url.origin}${url.pathname}?${new URLSearchParams(query)}`, ctx, () => match(query, env));
        }

        if (url.pathname !== '/api/listening/now') return json({ error: 'Not found' }, 404, { 'Cache-Control': 'no-store' });

        const withYoutube = url.searchParams.get('youtube') === '1';
        // Only the one parameter that matters goes into the cache key, so nothing else can bypass it
        const cacheKey = new Request(`${url.origin}${url.pathname}${withYoutube ? '?youtube=1' : ''}`);
        const cache = typeof caches === 'undefined' ? undefined : caches.default;
        const cached = await cache?.match(cacheKey);
        if (cached) return cached;

        let body;
        try {
            const now = await getNowPlaying(env);
            body = { playing: now && !isHidden(now.track, env.HIDDEN) ? now : null };
            if (body.playing && withYoutube) body.youtube = await findVideo(body.playing.track, env);
        } catch (error) {
            return failed(error);
        }

        const response = json(body);
        if (cache) ctx.waitUntil(cache.put(cacheKey, response.clone()));
        return response;
    },
};
