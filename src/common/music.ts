import { favoriteArtists, musicList, MusicItemProps, welcomeTrack, youtubeSongs } from './constants';
import { youtubeThumbnail } from './youtube';

/**
 * A track's `url` says where it plays from. A path (`/music/foo.mp3`) plays in the site's own <audio>.
 * The rest play from YouTube, in atoms/youtube-player:
 *
 *   youtube:<video id>        a YouTube video, as it is
 *   spotify:<track id>        a Spotify song, played from the YouTube copy the listening Worker finds
 *   song:<artist>/<title>     the same for a song known only by name (ListenBrainz's top songs)
 */
export const isStreamed = (url: string | undefined) => !!url && /^(youtube|spotify|song):/.test(url);

export const youtubeUrl = (videoId: string) => `youtube:${videoId}`;
export const spotifyUrl = (trackId: string) => `spotify:${trackId}`;
export const songUrl = (artist: string, title: string) => `song:${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;

/** Where the YouTube player finds a streamed track: the video itself, or what to ask the Worker for */
export const streamSource = (url: string): { videoId?: string; spotify?: string; artist?: string; title?: string } => {
    const kind = url.slice(0, url.indexOf(':'));
    const rest = url.slice(url.indexOf(':') + 1);
    if (kind === 'youtube') return { videoId: rest };
    if (kind === 'spotify') return { spotify: rest };
    const [artist, title] = rest.split('/').map(decodeURIComponent);
    return { artist, title };
};

const withThumbnail = (track: MusicItemProps) => {
    const { videoId } = isStreamed(track.url) ? streamSource(track.url) : {};
    return !track.image && videoId ? { ...track, image: youtubeThumbnail(videoId) } : track;
};

// Jake's own list wins when a track is in both, since its entries carry the full titles and notes
const allTracks: MusicItemProps[] = [...musicList, ...favoriteArtists, welcomeTrack, ...youtubeSongs.map(withThumbnail)];

// Every track the shuffle draws from, once each. The Spotify playlist's songs join it once the Worker sends them.
const library = new Set(allTracks.map((track) => track.url));

export const libraryUrls = () => Array.from(library);

export const findTrack = (url: string | undefined): MusicItemProps | undefined => allTracks.find((track) => track.url === url);

/**
 * Makes tracks from elsewhere known to the player: the Spotify playlist's songs, or a play picked
 * from Recent listens. With `inLibrary` they join the shuffle too. Returns the ones that were new to it.
 */
export const addTracks = (tracks: MusicItemProps[], inLibrary: boolean) => {
    const added: string[] = [];
    tracks.forEach((track) => {
        if (!findTrack(track.url)) allTracks.push(withThumbnail(track));
        if (inLibrary && !library.has(track.url)) {
            library.add(track.url);
            added.push(track.url);
        }
    });
    return added;
};

/** The line under a track's title */
export const trackByline = (track: MusicItemProps) => (track.artist ? track.artist : track.url === welcomeTrack.url ? 'The welcome track' : `Jake Motta · ${track.date}`);
