"""Import Jake's past YouTube Music plays from a Google Takeout export into ListenBrainz.

The sync job (sync.py) only reaches back a day or two, so everything before it started comes from
Takeout. Export "YouTube and YouTube Music" → history, in JSON format and with the Google account set
to English (the entries read "Watched <song>"). Then, on your own computer:

    LISTENBRAINZ_TOKEN=… python import_takeout.py path/to/watch-history.json --before 2026-10-27 --dry-run

and again without --dry-run once the list looks right. --before is the day the sync job started:
plays from then on are the sync's, and importing them too would count them twice.

Takeout has the exact time of each play but not how long it lasted, so a song opened and skipped
counts like one played through. ListenBrainz ignores a play it already has at the same second, so
running the import again is harmless.

Only the standard library is needed.
"""

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone

from sync import CLIENT, LISTENBRAINZ, video_id

BATCH = 500  # ListenBrainz takes up to 1000 per request; half keeps each request well under its size cap


def parse_time(text):
    return int(datetime.fromisoformat(text.replace("Z", "+00:00")).timestamp())


def to_listen(entry):
    """A ListenBrainz listen for one Takeout entry, or None when it isn't a YouTube Music song"""
    if entry.get("header") != "YouTube Music":
        return None
    vid = video_id(entry.get("titleUrl"))
    title = entry.get("title", "")
    subtitles = entry.get("subtitles") or []
    # Removed or private videos keep only their link, with no channel
    if not vid or not subtitles or not title.startswith("Watched ") or title.endswith(vid):
        return None
    channel = subtitles[0].get("name", "")
    # YouTube Music's own uploads come from "Artist - Topic"; anything else keeps its channel's name
    artist = channel[: -len(" - Topic")] if channel.endswith(" - Topic") else channel
    if not artist:
        return None
    return {
        "listened_at": parse_time(entry["time"]),
        "track_metadata": {
            "artist_name": artist,
            "track_name": title[len("Watched ") :],
            "additional_info": {
                "origin_url": f"https://music.youtube.com/watch?v={vid}",
                "music_service": "music.youtube.com",
                "music_service_name": "YouTube Music",
                "submission_client": CLIENT,
            },
        },
    }


def listens_before(entries, before):
    """Every YouTube Music play before `before` (Unix seconds), oldest first"""
    listens = [listen for listen in map(to_listen, entries) if listen and listen["listened_at"] < before]
    return sorted(listens, key=lambda listen: listen["listened_at"])


def submit(listens, token):
    body = json.dumps({"listen_type": "import", "payload": listens}).encode()
    request = urllib.request.Request(f"{LISTENBRAINZ}/submit-listens", data=body, headers={"Authorization": f"Token {token}", "Content-Type": "application/json"})
    while True:
        try:
            with urllib.request.urlopen(request, timeout=60):
                return
        except urllib.error.HTTPError as error:
            if error.code != 429:
                raise SystemExit(f"ListenBrainz answered {error.code}: {error.read().decode(errors='replace')[:300]}")
            # Rate limited: wait as long as it asks
            time.sleep(int(error.headers.get("X-RateLimit-Reset-In", "10")) + 1)


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("history", help="watch-history.json from Google Takeout")
    parser.add_argument("--before", required=True, help="the day the sync job started, as YYYY-MM-DD (UTC); later plays are skipped")
    parser.add_argument("--dry-run", action="store_true", help="list what would be imported, without importing it")
    args = parser.parse_args()

    before = int(datetime.strptime(args.before, "%Y-%m-%d").replace(tzinfo=timezone.utc).timestamp())
    with open(args.history, encoding="utf-8") as file:
        listens = listens_before(json.load(file), before)

    if not listens:
        print("No YouTube Music plays found before that day. Is the export JSON, and the account in English?")
        return
    first = datetime.fromtimestamp(listens[0]["listened_at"], timezone.utc).date()
    last = datetime.fromtimestamp(listens[-1]["listened_at"], timezone.utc).date()
    print(f"{len(listens)} YouTube Music play{'' if len(listens) == 1 else 's'} from {first} to {last}.")

    if args.dry_run:
        for listen in listens[-20:]:
            track = listen["track_metadata"]
            print(f"  {datetime.fromtimestamp(listen['listened_at'], timezone.utc):%Y-%m-%d}  {track['track_name']} by {track['artist_name']}")
        print("(the latest 20; run without --dry-run to import them all)")
        return

    token = os.environ.get("LISTENBRAINZ_TOKEN", "").strip()
    if not token:
        raise SystemExit("Set LISTENBRAINZ_TOKEN to the user token from listenbrainz.org/settings.")
    for start in range(0, len(listens), BATCH):
        submit(listens[start : start + BATCH], token)
        print(f"  imported {min(start + BATCH, len(listens))} of {len(listens)}", file=sys.stderr)
    print("Done.")


if __name__ == "__main__":
    main()
