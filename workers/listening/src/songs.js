// Jake's songs: the ones visitors may ask this Worker to find on YouTube. That's his Spotify playlist,
// his top songs on Spotify, and what ListenBrainz has him playing lately and most. Anything else is
// refused, so nobody can spend the day's YouTube searches (100 of 10,000 units each) on songs that
// aren't his.

import { getPlaylist, getTopTracks } from './spotify.js';

const LISTENBRAINZ = 'https://api.listenbrainz.org/1';
// How long the list is kept before it's built again, and how old it may be before a song missing from
// it is worth a rebuild (it may have just been played)
const SONGS_TTL = 10 * 60;
const STALE_MS = 60 * 1000;

/** How a song is recognised by name: the artist and title as ListenBrainz gives them, in lower case */
export const songKey = (artist, title) => `${artist}|${title}`.toLowerCase().replace(/\s+/g, ' ').trim();

const listenbrainz = async (path) => {
    const response = await fetch(`${LISTENBRAINZ}${path}`, { headers: { 'User-Agent': 'jakemotta-listening (jakemotta.com)' } });
    // 204: a statistics range ListenBrainz hasn't counted yet
    if (response.status === 204) return null;
    if (!response.ok) throw new Error(`ListenBrainz answered ${response.status} for ${path}`);
    return response.json();
};

const spotifyId = (value) => (typeof value === 'string' ? /open\.spotify\.com\/track\/([A-Za-z0-9]+)/.exec(value)?.[1] ?? (/^[A-Za-z0-9]{22}$/.test(value) ? value : undefined) : undefined);

// Each song as findVideo wants it. Songs known only by name get an id from their name, which keys
// their YouTube match in KV.
const fromListen = ({ track_metadata: track }) => {
    const info = track.additional_info ?? {};
    const id = spotifyId(info.spotify_id) ?? spotifyId(info.origin_url);
    return {
        id: id ?? `song:${songKey(track.artist_name, track.track_name)}`,
        spotifyId: id,
        title: track.track_name,
        artist: track.artist_name,
        artists: Array.isArray(info.artist_names) && info.artist_names.length ? info.artist_names : [track.artist_name],
        durationMs: typeof info.duration_ms === 'number' ? info.duration_ms : undefined,
    };
};

const fromTop = (item) => ({
    id: `song:${songKey(item.artist_name, item.track_name)}`,
    title: item.track_name,
    artist: item.artist_name,
    artists: [item.artist_name],
});

const fromPlaylist = (track) => ({ ...track, spotifyId: track.id, artist: track.artists.join(', ') });

const buildSongs = async (env) => {
    const user = encodeURIComponent(env.LISTENBRAINZ_USER);
    const [listens, ...tops] = await Promise.all([
        listenbrainz(`/user/${user}/listens?count=100`),
        ...['this_month', 'this_year', 'all_time'].map((range) => listenbrainz(`/stats/user/${user}/recordings?range=${range}&count=100`)),
    ]);
    const playlist = env.SPOTIFY_PLAYLIST ? await getPlaylist(env) : [];
    // The Favorite artists' songs. Without the user-top-read scope there are none, and the rest still count.
    const topTracks = await getTopTracks(env).catch(() => []);
    return [
        ...playlist.map(fromPlaylist),
        ...topTracks.map(fromPlaylist),
        ...(listens?.payload.listens ?? []).map(fromListen),
        ...tops.flatMap((top) => (top?.payload.recordings ?? []).map(fromTop)),
    ];
};

const lookUp = (songs, { spotify, artist, title }) =>
    spotify ? songs.find((song) => song.spotifyId === spotify) : songs.find((song) => songKey(song.artist, song.title) === songKey(artist, title));

/**
 * One of Jake's songs, by Spotify ID or by artist and title, or null when it isn't one of his. The
 * list is kept in KV for ten minutes, and built again sooner when a song isn't in it.
 */
export const findSong = async (env, query) => {
    const cached = await env.LISTENING.get('songs', 'json');
    const found = cached && lookUp(cached.songs, query);
    if (found || (cached && Date.now() - cached.at < STALE_MS)) return found ?? null;

    const songs = await buildSongs(env);
    await env.LISTENING.put('songs', JSON.stringify({ at: Date.now(), songs }), { expirationTtl: SONGS_TTL });
    return lookUp(songs, query) ?? null;
};
