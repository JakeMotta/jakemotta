import { getNowPlaying, isHidden, SpotifyError } from './spotify.js';
import { findVideo } from './youtube.js';

/**
 * GET /api/listening/now              what Jake's Spotify is playing, to the second
 * GET /api/listening/now?youtube=1    the same, plus the YouTube copy to listen along with
 *
 * Answers are cached for 5 seconds, so however many visitors are listening along, Spotify is asked
 * at most once per 5 seconds per Cloudflare location.
 */
const CACHE_SECONDS = 5;

const json = (body, status = 200, headers = {}) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': `public, max-age=${CACHE_SECONDS}`, ...headers },
    });

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        if (url.pathname !== '/api/listening/now') return json({ error: 'Not found' }, 404, { 'Cache-Control': 'no-store' });
        if (request.method !== 'GET') return json({ error: 'GET only' }, 405, { 'Cache-Control': 'no-store', Allow: 'GET' });

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
            const status = error instanceof SpotifyError ? error.status : 500;
            console.error(error.message);
            return json({ error: 'Spotify is unavailable right now' }, status, { 'Cache-Control': 'no-store', ...(error.retryAfter ? { 'Retry-After': error.retryAfter } : {}) });
        }

        const response = json(body);
        if (cache) ctx.waitUntil(cache.put(cacheKey, response.clone()));
        return response;
    },
};
