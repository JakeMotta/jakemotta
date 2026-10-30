import { useEffect, useMemo, useState } from 'react';
import { getTopArtists, PlaylistTrack, TopArtist } from '../../../api/listen-along';
import { Listen } from '../../../api/listenbrainz';
import { topKey, useListeningStore, useLiveListening } from '../../../store/listening';

// How many the Favorite artists tab lists
const FAVORITES = 8;

export interface FavoriteArtist {
    name: string;
    // Known when the ranking is ListenBrainz's or the latest plays'; Spotify's ranks without counts
    plays?: number;
    // Their photo, from Spotify
    image?: string;
    // Their most-played song, when there is one: what the row plays and shows
    song?: Listen;
}

// A song from Spotify's top songs, as the rows take it
const toListen = (track: PlaylistTrack): Listen => ({
    title: track.title,
    artist: track.artists.join(', '),
    album: track.album,
    source: 'spotify',
    link: track.url,
    spotifyUrl: track.url,
    cover: track.cover,
});

// Asked of the Worker once per visit
let spotifyTop: Promise<TopArtist[] | undefined> | undefined;

// "City Girl, tiffi" is a song by both
const credits = (artist: string) => artist.split(/,\s+/).filter(Boolean);
const credited = (listen: Listen, name: string) => credits(listen.artist).some((credit) => credit.toLowerCase() === name.toLowerCase());

/**
 * The artists of the latest plays, most played first. A play counts for every artist on it, but an
 * artist who is never credited first (an album's credit, like "Funk Wav") isn't listed.
 */
const countRecent = (recent: Listen[]) => {
    const counts = new Map<string, { name: string; plays: number; leads: boolean }>();
    recent.forEach((listen) =>
        credits(listen.artist).forEach((name, i) => {
            const key = name.toLowerCase();
            const entry = counts.get(key) ?? { name, plays: 0, leads: false };
            entry.plays++;
            entry.leads ||= i === 0;
            counts.set(key, entry);
        }),
    );
    return Array.from(counts.values())
        .filter((entry) => entry.leads)
        .sort((a, b) => b.plays - a.plays);
};

// The artist's most-played song among the latest plays: its newest play, so the cover and link are fresh
const topSong = (recent: Listen[], name: string) => {
    const tally = new Map<string, { listen: Listen; plays: number }>();
    recent
        .filter((listen) => credited(listen, name))
        .forEach((listen) => {
            const entry = tally.get(listen.title) ?? { listen, plays: 0 };
            entry.plays++;
            tally.set(listen.title, entry);
        });
    let best: { listen: Listen; plays: number } | undefined;
    tally.forEach((entry) => {
        if (!best || entry.plays > best.plays) best = entry;
    });
    return best?.listen;
};

/**
 * Jake's most-listened artists, from the deepest history there is (docs/listening.md): ListenBrainz's
 * all-time top artists, which hold every Spotify play he's had since 2013 once it has counted them.
 * Until it has, Spotify's own long-term top artists, through the listening Worker, which reach back a
 * year or so, and failing that a count of his latest plays. Spotify's list also lends its photos and
 * songs to the artists ListenBrainz ranks. `ready` is false while none has answered.
 */
export const useFavoriteArtists = () => {
    useLiveListening();
    // undefined while the Worker is asked, null when it couldn't say
    const [spotify, setSpotify] = useState<TopArtist[] | null | undefined>(undefined);
    const top = useListeningStore((store) => store.top[topKey('artists', 'all_time')]);
    const loadTop = useListeningStore((store) => store.loadTop);
    const recent = useListeningStore((store) => store.recent);
    const loaded = useListeningStore((store) => store.loaded);

    useEffect(() => {
        let live = true;
        spotifyTop ??= getTopArtists();
        spotifyTop.then((artists) => live && setSpotify(artists ?? null));
        loadTop('artists', 'all_time');
        return () => {
            live = false;
        };
    }, [loadTop]);

    return useMemo(() => {
        const fromSpotify = (name: string) => spotify?.find((artist) => artist.name.toLowerCase() === name.toLowerCase());
        if (top?.length) {
            const artists: FavoriteArtist[] = top.slice(0, FAVORITES).map(({ title: name, count: plays }) => {
                const known = fromSpotify(name);
                return { name, plays, image: known?.image, song: known?.song ? toListen(known.song) : topSong(recent, name) };
            });
            // Waits for Spotify too, for its photos
            return { artists, ready: spotify !== undefined };
        }
        if (spotify?.length) {
            const artists: FavoriteArtist[] = spotify.slice(0, FAVORITES).map(({ name, image, song }) => ({ name, image, song: song ? toListen(song) : topSong(recent, name) }));
            return { artists, ready: top !== undefined };
        }
        const artists: FavoriteArtist[] = countRecent(recent)
            .slice(0, FAVORITES)
            .map(({ name, plays }) => ({ name, plays, song: topSong(recent, name) }));
        return { artists, ready: spotify !== undefined && top !== undefined && loaded };
    }, [spotify, top, recent, loaded]);
};
