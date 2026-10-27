"""Copy YouTube Music plays from Jake's iPhone into ListenBrainz.

iOS doesn't let any app see what YouTube Music is playing, so the iPhone's plays can't be scrobbled as
they happen the way Web Scrobbler does on the desktop. Instead .github/workflows/ytmusic-sync.yml runs
this every 30 minutes: it reads the account's YouTube Music history, which holds the plays from every
device, and submits the ones ListenBrainz doesn't have yet. docs/listening.md has the whole picture.

What the history can't say, and so what this can't do:
- When a song was played, beyond "Today" or "Yesterday". New plays are laid end to end, finishing at the
  moment they were found, which keeps their order and puts them within half an hour or so of the truth.
- Whether a song was played to the end. Skips are counted like anything else.
- How many times. Playing a song again moves it to the top rather than adding it twice, so a song
  ListenBrainz already has from the last few days is never submitted again, from any device.

Only ytmusicapi is needed beyond the standard library, and it's imported in main(), so the functions
here can be tested without it (python -m unittest in this folder).

The repository is public, and so are the workflow's logs: nothing here may print a token.
"""

import json
import os
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request

LISTENBRAINZ = "https://api.listenbrainz.org/1"
CLIENT = "jakemotta-ytmusic-sync"

# The history's shelves are titled by day. Only these two are recent enough to sync; the rest were
# synced on earlier runs or predate the job (those come from the Google Takeout import instead).
RECENT_SHELVES = ("Today", "Yesterday")

# Wide enough to cover everything on those two shelves, with room to spare across midnight
KNOWN_WINDOW = 72 * 60 * 60

# For the rare song the history gives no length for
FALLBACK_SECONDS = 210


def video_id(url):
    """The ?v= of a YouTube or YouTube Music watch link, else None"""
    if not url:
        return None
    parts = urllib.parse.urlparse(url)
    host = parts.hostname or ""
    if host != "youtube.com" and not host.endswith(".youtube.com"):
        return None
    return urllib.parse.parse_qs(parts.query).get("v", [None])[0]


def known_video_ids(listens, playing_now=None):
    """Every video ListenBrainz already has, from Web Scrobbler or from earlier runs of this job"""
    ids = set()
    for listen in listens + ([playing_now] if playing_now else []):
        info = listen.get("track_metadata", {}).get("additional_info") or {}
        found = video_id(info.get("origin_url"))
        if found:
            ids.add(found)
    return ids


def new_plays(history, known):
    """The recent history items ListenBrainz doesn't have, newest first, one per video"""
    plays = []
    seen = set(known)
    for item in history:
        if item.get("played") not in RECENT_SHELVES:
            break
        vid = item.get("videoId")
        artists = [artist["name"] for artist in item.get("artists") or [] if artist.get("name")]
        if not vid or vid in seen or not artists or not item.get("title"):
            continue
        if item.get("videoType") == "MUSIC_VIDEO_TYPE_PODCAST_EPISODE":
            continue
        seen.add(vid)
        plays.append(item)
    return plays


def to_listens(plays, now):
    """ListenBrainz listens for the new plays, laid end to end so the newest finishes at `now`"""
    listens = []
    end = now
    for item in plays:
        seconds = item.get("duration_seconds") or FALLBACK_SECONDS
        end -= seconds
        artists = [artist["name"] for artist in item["artists"] if artist.get("name")]
        info = {
            "artist_names": artists,
            "duration_ms": seconds * 1000,
            "origin_url": f"https://music.youtube.com/watch?v={item['videoId']}",
            "music_service": "music.youtube.com",
            "music_service_name": "YouTube Music",
            "submission_client": CLIENT,
        }
        track = {"artist_name": ", ".join(artists), "track_name": item["title"], "additional_info": info}
        album = (item.get("album") or {}).get("name")
        if album:
            track["release_name"] = album
        listens.append({"listened_at": int(end), "track_metadata": track})
    return listens


def listenbrainz(path, token, body=None):
    request = urllib.request.Request(
        f"{LISTENBRAINZ}{path}",
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Token {token}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        # The body says what was wrong with the request; it never echoes the token
        raise SystemExit(f"::error::ListenBrainz answered {error.code} to {path}: {error.read().decode(errors='replace')[:300]}")


def main():
    dry_run = "--dry-run" in sys.argv or os.environ.get("DRY_RUN") == "true"
    names = ("LISTENBRAINZ_TOKEN", "YTMUSIC_CLIENT_ID", "YTMUSIC_CLIENT_SECRET", "YTMUSIC_OAUTH_JSON")
    secrets = {name: os.environ.get(name, "").strip() for name in names}
    missing = [name for name, value in secrets.items() if not value]
    if len(missing) == len(names):
        print("::warning::The YouTube Music sync isn't set up yet, so there's nothing to do. docs/listening.md says how.")
        return
    if missing:
        raise SystemExit(f"::error::Missing {', '.join(missing)}. Add each under Settings > Secrets and variables > Actions.")

    token = secrets["LISTENBRAINZ_TOKEN"]
    check = listenbrainz("/validate-token", token)
    if not check.get("valid"):
        raise SystemExit("::error::ListenBrainz says LISTENBRAINZ_TOKEN isn't valid. Copy it again from listenbrainz.org/settings.")
    user = urllib.parse.quote(check["user_name"])

    from ytmusicapi import OAuthCredentials, YTMusic

    # ytmusicapi reads the sign-in from a file, and writes the refreshed token back to it. Keep that
    # file private to this run.
    fd, oauth_path = tempfile.mkstemp(suffix=".json")
    try:
        with os.fdopen(fd, "w") as file:
            file.write(secrets["YTMUSIC_OAUTH_JSON"])
        credentials = OAuthCredentials(client_id=secrets["YTMUSIC_CLIENT_ID"], client_secret=secrets["YTMUSIC_CLIENT_SECRET"])
        history = YTMusic(oauth_path, oauth_credentials=credentials).get_history()
    finally:
        os.remove(oauth_path)

    now = int(time.time())
    listens = listenbrainz(f"/user/{user}/listens?min_ts={now - KNOWN_WINDOW}&count=1000", token)["payload"]["listens"]
    playing = listenbrainz(f"/user/{user}/playing-now", token)["payload"]["listens"]
    plays = new_plays(history, known_video_ids(listens, playing[0] if playing else None))

    if not plays:
        print("Nothing new in the YouTube Music history.")
        return

    for item in plays:
        print(f"{'Would add' if dry_run else 'Adding'}: {item['title']} by {', '.join(a['name'] for a in item['artists'])}")
    if not dry_run:
        listenbrainz("/submit-listens", token, {"listen_type": "import", "payload": to_listens(plays, now)})
        print(f"Added {len(plays)} play{'' if len(plays) == 1 else 's'} to ListenBrainz.")


if __name__ == "__main__":
    main()
