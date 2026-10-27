// Runs the Worker in Node with Spotify, YouTube and KV faked. Run with: node --test (in workers/listening)

import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';
import { isHidden } from '../src/spotify.js';
import { parseDuration, pickVideo } from '../src/youtube.js';

const track = { id: 'sp1', title: 'Digital Love', artists: ['Daft Punk'], durationMs: 301_000 };

const kv = () => {
    const store = new Map();
    return {
        store,
        get: async (key, type) => (store.has(key) ? (type === 'json' ? JSON.parse(store.get(key)) : store.get(key)) : null),
        put: async (key, value) => void store.set(key, value),
        delete: async (key) => void store.delete(key),
    };
};

const env = (overrides = {}) => ({
    LISTENING: kv(),
    SPOTIFY_CLIENT_ID: 'id',
    SPOTIFY_CLIENT_SECRET: 'secret',
    SPOTIFY_REFRESH_TOKEN: 'refresh',
    YOUTUBE_API_KEY: 'key',
    HIDDEN: '',
    ...overrides,
});

const ctx = { waitUntil: () => {} };
const get = (path, e) => worker.fetch(new Request(`https://jakemotta.com${path}`), e, ctx);

const answer = (body, status = 200) => new Response(body === undefined ? null : JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const spotifyPlaying = {
    is_playing: true,
    progress_ms: 61_000,
    currently_playing_type: 'track',
    item: { id: 'sp1', name: 'Digital Love', duration_ms: 301_000, artists: [{ name: 'Daft Punk' }], album: { name: 'Discovery', images: [{ url: 'cover.jpg' }] }, external_urls: { spotify: 'https://open.spotify.com/track/sp1' } },
};

let calls;
const realFetch = globalThis.fetch;
const fakeFetch = (routes) => {
    globalThis.fetch = async (url) => {
        const href = String(url);
        calls.push(href);
        const route = Object.keys(routes).find((prefix) => href.startsWith(prefix));
        if (!route) throw new Error(`Unexpected fetch: ${href}`);
        return routes[route](href);
    };
};

beforeEach(() => {
    calls = [];
});
afterEach(() => {
    globalThis.fetch = realFetch;
});

describe('GET /api/listening/now', () => {
    it("returns the track and position, and keeps Spotify's access token", async () => {
        fakeFetch({
            'https://accounts.spotify.com/api/token': () => answer({ access_token: 'access', expires_in: 3600 }),
            'https://api.spotify.com/v1/me/player/currently-playing': () => answer(spotifyPlaying),
        });
        const e = env();
        const body = await (await get('/api/listening/now', e)).json();
        assert.equal(body.playing.track.title, 'Digital Love');
        assert.equal(body.playing.progressMs, 61_000);
        assert.equal(body.playing.isPlaying, true);
        assert.equal(body.youtube, undefined);
        assert.equal(e.LISTENING.store.get('spotify:access_token'), 'access');

        await get('/api/listening/now', e);
        assert.equal(calls.filter((call) => call.includes('/api/token')).length, 1, 'refreshes once, then reuses the token');
    });

    it('returns null when nothing is playing', async () => {
        fakeFetch({
            'https://accounts.spotify.com/api/token': () => answer({ access_token: 'access', expires_in: 3600 }),
            'https://api.spotify.com/v1/me/player/currently-playing': () => answer(undefined, 204),
        });
        assert.deepEqual(await (await get('/api/listening/now', env())).json(), { playing: null });
    });

    it('keeps hidden artists off', async () => {
        fakeFetch({
            'https://accounts.spotify.com/api/token': () => answer({ access_token: 'access', expires_in: 3600 }),
            'https://api.spotify.com/v1/me/player/currently-playing': () => answer(spotifyPlaying),
        });
        assert.deepEqual(await (await get('/api/listening/now', env({ HIDDEN: 'daft punk' }))).json(), { playing: null });
    });

    it('stores a rotated refresh token', async () => {
        fakeFetch({
            'https://accounts.spotify.com/api/token': () => answer({ access_token: 'access', expires_in: 3600, refresh_token: 'rotated' }),
            'https://api.spotify.com/v1/me/player/currently-playing': () => answer(undefined, 204),
        });
        const e = env();
        await get('/api/listening/now', e);
        assert.equal(e.LISTENING.store.get('spotify:refresh_token'), 'rotated');
    });

    it('says Spotify is unavailable when the refresh fails, without caching that', async () => {
        fakeFetch({ 'https://accounts.spotify.com/api/token': () => answer({ error: 'invalid_grant' }, 400) });
        const response = await get('/api/listening/now', env());
        assert.equal(response.status, 502);
        assert.equal(response.headers.get('Cache-Control'), 'no-store');
    });

    it('finds the YouTube copy once, then answers from KV', async () => {
        fakeFetch({
            'https://accounts.spotify.com/api/token': () => answer({ access_token: 'access', expires_in: 3600 }),
            'https://api.spotify.com/v1/me/player/currently-playing': () => answer(spotifyPlaying),
            'https://www.googleapis.com/youtube/v3/search': () => answer({ items: [{ id: { videoId: 'mv' } }, { id: { videoId: 'topic' } }] }),
            'https://www.googleapis.com/youtube/v3/videos': () =>
                answer({
                    items: [
                        { id: 'mv', snippet: { channelTitle: 'DaftPunkVEVO' }, contentDetails: { duration: 'PT5M3S' }, status: { embeddable: true } },
                        { id: 'topic', snippet: { channelTitle: 'Daft Punk - Topic' }, contentDetails: { duration: 'PT5M1S' }, status: { embeddable: true } },
                    ],
                }),
        });
        const e = env();
        const body = await (await get('/api/listening/now?youtube=1', e)).json();
        assert.deepEqual(body.youtube, { videoId: 'topic', synced: true });

        await get('/api/listening/now?youtube=1', e);
        assert.equal(calls.filter((call) => call.includes('/youtube/v3/search')).length, 1, 'searches once per track');
    });

    it('prefers a hand-picked override', async () => {
        fakeFetch({
            'https://accounts.spotify.com/api/token': () => answer({ access_token: 'access', expires_in: 3600 }),
            'https://api.spotify.com/v1/me/player/currently-playing': () => answer(spotifyPlaying),
        });
        const e = env();
        e.LISTENING.store.set('yt-override:sp1', 'picked');
        assert.deepEqual((await (await get('/api/listening/now?youtube=1', e)).json()).youtube, { videoId: 'picked', synced: true });
    });

    it('answers a missing YouTube match with null when the quota is out', async () => {
        fakeFetch({
            'https://accounts.spotify.com/api/token': () => answer({ access_token: 'access', expires_in: 3600 }),
            'https://api.spotify.com/v1/me/player/currently-playing': () => answer(spotifyPlaying),
            'https://www.googleapis.com/youtube/v3/search': () => answer({ error: { errors: [{ reason: 'quotaExceeded' }] } }, 403),
        });
        const body = await (await get('/api/listening/now?youtube=1', env())).json();
        assert.equal(body.youtube, null);
        assert.equal(body.playing.track.title, 'Digital Love');
    });

    it('404s anything else', async () => {
        assert.equal((await get('/api/listening/other', env())).status, 404);
    });
});

describe('pickVideo', () => {
    const video = (id, channelTitle, durationSeconds, embeddable = true) => ({ id, channelTitle, durationSeconds, embeddable });

    it("syncs to the artist's Topic upload of the same length", () => {
        assert.deepEqual(pickVideo(track, [video('mv', 'DaftPunkVEVO', 300), video('topic', 'Daft Punk - Topic', 301)]), { videoId: 'topic', synced: true });
    });

    it('syncs to any video of the same length when there is no Topic upload', () => {
        assert.deepEqual(pickVideo(track, [video('long', 'Fan', 400), video('close', 'Fan 2', 303)]), { videoId: 'close', synced: true });
    });

    it('falls back to playing from the top when nothing matches the length', () => {
        assert.deepEqual(pickVideo(track, [video('mv', 'DaftPunkVEVO', 360)]), { videoId: 'mv', synced: false });
    });

    it('never picks a video that cannot be embedded', () => {
        assert.equal(pickVideo(track, [video('blocked', 'Daft Punk - Topic', 301, false)]), null);
    });

    it("gives another artist's Topic channel no head start", () => {
        assert.deepEqual(pickVideo(track, [video('cover', 'Someone Else - Topic', 301), video('real', 'Daft Punk', 302)]), { videoId: 'cover', synced: true });
    });
});

describe('helpers', () => {
    it('parses ISO 8601 durations', () => {
        assert.equal(parseDuration('PT5M1S'), 301);
        assert.equal(parseDuration('PT1H2M3S'), 3723);
        assert.equal(parseDuration('PT45S'), 45);
        assert.equal(parseDuration('P1D'), undefined);
    });

    it('matches HIDDEN by artist or by "artist - title"', () => {
        assert.equal(isHidden(track, 'Daft Punk'), true);
        assert.equal(isHidden(track, ' daft punk - digital love '), true);
        assert.equal(isHidden(track, 'daft punk - one more time'), false);
        assert.equal(isHidden(track, ''), false);
    });
});
