import { useEffect, useMemo } from 'react';
import { Listen } from '../../../api/listenbrainz';
import { topKey, useListeningStore, useLiveListening } from '../../../store/listening';

// How many the Favorite artists tab lists
const FAVORITES = 8;

export interface FavoriteArtist {
    name: string;
    plays: number;
    // Their most-played song among Jake's latest plays, when there is one: what the row plays and shows
    song?: Listen;
}

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
 * Jake's most-listened artists, from ListenBrainz (docs/listening.md): its all-time top artists once
 * it has counted them, and until then a count of his latest plays. `ready` is false while neither has
 * answered.
 */
export const useFavoriteArtists = () => {
    useLiveListening();
    const top = useListeningStore((store) => store.top[topKey('artists', 'all_time')]);
    const loadTop = useListeningStore((store) => store.loadTop);
    const recent = useListeningStore((store) => store.recent);
    const loaded = useListeningStore((store) => store.loaded);

    useEffect(() => {
        loadTop('artists', 'all_time');
    }, [loadTop]);

    return useMemo(() => {
        const ranked = top?.length ? top.map((item) => ({ name: item.title, plays: item.count })) : countRecent(recent);
        const artists: FavoriteArtist[] = ranked.slice(0, FAVORITES).map(({ name, plays }) => ({ name, plays, song: topSong(recent, name) }));
        return { artists, ready: top !== undefined && (!!top?.length || loaded) };
    }, [top, recent, loaded]);
};
