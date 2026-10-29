import { musicList, MusicItemProps, youtubeSongs } from '../common/constants';
import { listenUrl, streamedTrack } from '../common/music';
import { useAudioStore } from './audio';
import { useListenAlongStore } from './listen-along';
import { useListeningStore } from './listening';

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

/**
 * The song a visit starts with, picked when the visitor asks for sound: one of Jake's own, one he
 * listened to lately, or one from his playlist. The source is picked first, so his own few songs come
 * up as often as a playlist of hundreds. Sources that haven't answered yet (or can't play here) sit out.
 */
export const pickFirstSong = (): MusicItemProps => {
    const worker = !!useListenAlongStore.getState().available;
    const recent = useListeningStore
        .getState()
        .recent.map((listen) => {
            const url = listenUrl(listen, worker);
            return url && streamedTrack(url, listen.title, listen.artist, listen.cover);
        })
        .filter((track): track is MusicItemProps => !!track);
    const playlist = [...youtubeSongs, ...useAudioStore.getState().playlist];
    return pick(pick([musicList, recent, playlist].filter((source) => source.length)));
};

/** "Play with sound": starts the visit on a random song */
export const playFirstSong = () => useAudioStore.getState().playTrack(pickFirstSong());
