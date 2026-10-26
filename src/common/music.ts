import { favoriteArtists, musicList, MusicItemProps, welcomeTrack } from './constants';

// Jake's own list wins when a track is in both, since its entries carry the full titles and notes
const allTracks = [...musicList, ...favoriteArtists, welcomeTrack];

/** Every track on the site, once each: what the shuffle draws from */
export const LIBRARY = Array.from(new Set(allTracks.map((track) => track.url)));

export const findTrack = (url: string | undefined): MusicItemProps | undefined => allTracks.find((track) => track.url === url);

/** The line under a track's title */
export const trackByline = (track: MusicItemProps) => (track.url === welcomeTrack.url ? 'The welcome track' : `Jake Motta · ${track.date}`);
