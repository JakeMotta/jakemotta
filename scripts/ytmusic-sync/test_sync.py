"""Tests for the parts of sync.py that decide what gets submitted. Run with: python -m unittest"""

import unittest

from sync import FALLBACK_SECONDS, known_video_ids, new_plays, to_listens, video_id


def song(vid, played="Today", title=None, artists=("Artist",), seconds=200, **extra):
    return {
        "videoId": vid,
        "title": title or f"Song {vid}",
        "artists": [{"name": name, "id": None} for name in artists],
        "album": {"name": "Album", "id": None},
        "duration_seconds": seconds,
        "played": played,
        "videoType": "MUSIC_VIDEO_TYPE_ATV",
        **extra,
    }


def listen(origin_url):
    return {"track_metadata": {"artist_name": "A", "track_name": "T", "additional_info": {"origin_url": origin_url}}}


class VideoId(unittest.TestCase):
    def test_reads_youtube_music_and_youtube_links(self):
        self.assertEqual(video_id("https://music.youtube.com/watch?v=abc123&list=RDAMVM"), "abc123")
        self.assertEqual(video_id("https://www.youtube.com/watch?v=xyz"), "xyz")

    def test_ignores_everything_else(self):
        self.assertIsNone(video_id("https://open.spotify.com/track/abc"))
        self.assertIsNone(video_id("https://notyoutube.com/watch?v=abc"))
        self.assertIsNone(video_id(None))


class KnownVideoIds(unittest.TestCase):
    def test_collects_from_listens_and_playing_now(self):
        listens = [listen("https://music.youtube.com/watch?v=a"), listen("https://open.spotify.com/track/s")]
        self.assertEqual(known_video_ids(listens, listen("https://music.youtube.com/watch?v=b")), {"a", "b"})


class NewPlays(unittest.TestCase):
    def test_skips_what_listenbrainz_has(self):
        history = [song("new"), song("web")]
        self.assertEqual([item["videoId"] for item in new_plays(history, {"web"})], ["new"])

    def test_stops_at_older_shelves(self):
        history = [song("a"), song("b", played="Yesterday"), song("c", played="This week"), song("d")]
        self.assertEqual([item["videoId"] for item in new_plays(history, set())], ["a", "b"])

    def test_counts_a_repeat_once(self):
        history = [song("a"), song("a", played="Yesterday")]
        self.assertEqual(len(new_plays(history, set())), 1)

    def test_skips_podcasts_and_items_without_artists(self):
        history = [song("pod", videoType="MUSIC_VIDEO_TYPE_PODCAST_EPISODE"), song("nobody", artists=()), song("ok")]
        self.assertEqual([item["videoId"] for item in new_plays(history, set())], ["ok"])


class ToListens(unittest.TestCase):
    def test_lays_plays_end_to_end_before_now(self):
        listens = to_listens([song("a", seconds=100), song("b", seconds=None)], now=10_000)
        self.assertEqual([item["listened_at"] for item in listens], [9_900, 9_900 - FALLBACK_SECONDS])

    def test_describes_the_track(self):
        [item] = to_listens([song("a", title="Digital Love", artists=("Daft Punk", "DJ Falcon"))], now=10_000)
        track = item["track_metadata"]
        self.assertEqual(track["artist_name"], "Daft Punk, DJ Falcon")
        self.assertEqual(track["track_name"], "Digital Love")
        self.assertEqual(track["release_name"], "Album")
        self.assertEqual(track["additional_info"]["origin_url"], "https://music.youtube.com/watch?v=a")
        self.assertEqual(track["additional_info"]["music_service"], "music.youtube.com")


if __name__ == "__main__":
    unittest.main()
