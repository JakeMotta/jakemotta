// What Jake's Spotify account is playing, from the Web API. Only this Worker holds the keys.

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOW_URL = 'https://api.spotify.com/v1/me/player/currently-playing';

export class SpotifyError extends Error {
    constructor(message, status, retryAfter) {
        super(message);
        this.status = status;
        this.retryAfter = retryAfter;
    }
}

// An access token lasts an hour. It's kept in KV until a minute before it runs out, so most requests
// skip the refresh. Spotify sometimes hands back a new refresh token with it, and that one replaces
// the secret from then on.
const accessToken = async (env) => {
    const cached = await env.LISTENING.get('spotify:access_token');
    if (cached) return cached;

    const refreshToken = (await env.LISTENING.get('spotify:refresh_token')) ?? env.SPOTIFY_REFRESH_TOKEN;
    const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
    });
    if (!response.ok) throw new SpotifyError(`Spotify refused the refresh token (${response.status})`, 502);

    const data = await response.json();
    if (data.refresh_token) await env.LISTENING.put('spotify:refresh_token', data.refresh_token);
    await env.LISTENING.put('spotify:access_token', data.access_token, { expirationTtl: Math.max(60, data.expires_in - 60) });
    return data.access_token;
};

/**
 * The track playing now, with where in it Spotify is, or null when nothing is (or it's a podcast or
 * an ad). `fetchedAt` is this Worker's clock when Spotify answered: a visitor's position in the song
 * is progressMs plus however long it's been since then.
 */
export const getNowPlaying = async (env) => {
    const response = await fetch(NOW_URL, { headers: { Authorization: `Bearer ${await accessToken(env)}` } });
    const fetchedAt = Date.now();

    if (response.status === 204) return null;
    if (response.status === 401) {
        // Revoked or expired early: forget it so the next request refreshes
        await env.LISTENING.delete('spotify:access_token');
        throw new SpotifyError('Spotify rejected the access token', 502);
    }
    if (response.status === 429) throw new SpotifyError('Spotify is rate limiting', 503, response.headers.get('Retry-After') ?? '30');
    if (!response.ok) throw new SpotifyError(`Spotify answered ${response.status}`, 502);

    const data = await response.json();
    const item = data.item;
    if (!item || data.currently_playing_type !== 'track') return null;

    return {
        isPlaying: !!data.is_playing,
        progressMs: data.progress_ms ?? 0,
        fetchedAt,
        track: {
            id: item.id,
            title: item.name,
            artists: (item.artists ?? []).map((artist) => artist.name),
            album: item.album?.name,
            durationMs: item.duration_ms,
            cover: item.album?.images?.[0]?.url,
            url: item.external_urls?.spotify,
        },
    };
};

/** Whether HIDDEN lists the track's artist, or "artist - title" */
export const isHidden = (track, hidden = '') => {
    const names = hidden
        .split(',')
        .map((name) => name.trim().toLowerCase())
        .filter(Boolean);
    if (!names.length) return false;
    const artists = track.artists.map((artist) => artist.toLowerCase());
    return artists.some((artist) => names.includes(artist) || names.includes(`${artist} - ${track.title.toLowerCase()}`));
};
