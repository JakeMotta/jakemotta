"""Tests for reading a Google Takeout watch history. Run with: python -m unittest"""

import unittest

from import_takeout import listens_before, to_listen


def entry(title="Watched Digital Love", vid="Smi8vAbm_8o", channel="Daft Punk - Topic", when="2024-03-01T12:34:56.789Z", header="YouTube Music"):
    item = {"header": header, "title": title, "titleUrl": f"https://music.youtube.com/watch?v={vid}", "time": when, "products": ["YouTube"]}
    if channel is not None:
        item["subtitles"] = [{"name": channel, "url": "https://www.youtube.com/channel/x"}]
    return item


class ToListen(unittest.TestCase):
    def test_reads_a_youtube_music_song(self):
        listen = to_listen(entry())
        self.assertEqual(listen["listened_at"], 1709296496)
        track = listen["track_metadata"]
        self.assertEqual(track["track_name"], "Digital Love")
        self.assertEqual(track["artist_name"], "Daft Punk")
        self.assertEqual(track["additional_info"]["origin_url"], "https://music.youtube.com/watch?v=Smi8vAbm_8o")

    def test_keeps_a_channel_name_that_isnt_a_topic(self):
        self.assertEqual(to_listen(entry(channel="DaftPunkVEVO"))["track_metadata"]["artist_name"], "DaftPunkVEVO")

    def test_skips_plain_youtube(self):
        self.assertIsNone(to_listen(entry(header="YouTube")))

    def test_skips_removed_videos(self):
        self.assertIsNone(to_listen(entry(title="Watched https://music.youtube.com/watch?v=gone", vid="gone", channel=None)))

    def test_skips_other_languages(self):
        self.assertIsNone(to_listen(entry(title="A regardé Digital Love")))


class ListensBefore(unittest.TestCase):
    def test_keeps_only_plays_before_the_cutoff_oldest_first(self):
        entries = [entry(when="2024-03-02T00:00:00Z"), entry(when="2024-03-01T00:00:00Z"), entry(when="2024-03-05T00:00:00Z")]
        listens = listens_before(entries, before=1709510400)  # 2024-03-04
        self.assertEqual([listen["listened_at"] for listen in listens], [1709251200, 1709337600])


if __name__ == "__main__":
    unittest.main()
