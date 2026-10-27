"""Set up the YouTube Music sync's four GitHub secrets, once, on your own computer.

    py -m pip install --user -r scripts/ytmusic-sync/requirements.txt
    py scripts/ytmusic-sync/setup_secrets.py

It asks for the Google OAuth client's ID and secret, signs you in to YouTube Music with them (a link
and a code, approved in the browser), and asks for your ListenBrainz user token. Then it checks that
both work: it reads your latest YouTube Music plays and asks ListenBrainz whose token it is.

Last, it hands the four values to GitHub. With the GitHub CLI (`gh`) installed and signed in, it sets
them itself. Without it, it puts each one on the clipboard in turn and opens GitHub's "new secret"
page for you to paste into.

Secrets are typed without echo and never printed or saved: the YouTube Music sign-in is written to a
temporary file only for as long as ytmusicapi needs it. See docs/listening.md.
"""

import getpass
import json
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
import webbrowser

LISTENBRAINZ = "https://api.listenbrainz.org/1"
FALLBACK_REPO = "JakeMotta/jakemotta"


def repo_slug(remote_url):
    """owner/name from a GitHub remote URL, https or ssh"""
    path = remote_url.strip().removesuffix(".git")
    for prefix in ("https://github.com/", "http://github.com/", "git@github.com:", "ssh://git@github.com/"):
        if path.startswith(prefix):
            return path[len(prefix) :]
    return None


def current_repo():
    try:
        url = subprocess.run(["git", "remote", "get-url", "origin"], capture_output=True, text=True, check=True).stdout
        return repo_slug(url) or FALLBACK_REPO
    except (OSError, subprocess.CalledProcessError):
        return FALLBACK_REPO


def clipboard_command():
    """The command that puts stdin on the clipboard here, or None"""
    for command in (["clip"], ["pbcopy"], ["wl-copy"], ["xclip", "-selection", "clipboard"]):
        if shutil.which(command[0]):
            return command
    return None


def gh_ready():
    if not shutil.which("gh"):
        return False
    return subprocess.run(["gh", "auth", "status"], capture_output=True).returncode == 0


def ask(prompt, secret=False):
    value = (getpass.getpass(prompt) if secret else input(prompt)).strip()
    if not value:
        raise SystemExit("Nothing entered, so nothing was changed.")
    return value


def listenbrainz_user(token):
    request = urllib.request.Request(f"{LISTENBRAINZ}/validate-token", headers={"Authorization": f"Token {token}"})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            answer = json.load(response)
    except urllib.error.URLError as error:
        raise SystemExit(f"Couldn't reach ListenBrainz: {error}")
    if not answer.get("valid"):
        raise SystemExit("ListenBrainz doesn't recognise that token. Copy it again from listenbrainz.org/settings.")
    return answer["user_name"]


def youtube_music_sign_in(client_id, client_secret):
    """The sign-in ytmusicapi writes, as text, after checking it can read the history"""
    from ytmusicapi import OAuthCredentials, YTMusic, setup_oauth

    fd, path = tempfile.mkstemp(suffix=".json")
    os.close(fd)
    try:
        print("\nSign in to YouTube Music with the Google account you listen on.")
        print('Google will warn that it "hasn\'t verified this app": it\'s your own app, so choose Advanced, then continue.\n')
        setup_oauth(client_id, client_secret, filepath=path, open_browser=True)
        with open(path, encoding="utf-8") as file:
            sign_in = file.read()
        history = YTMusic(path, oauth_credentials=OAuthCredentials(client_id=client_id, client_secret=client_secret)).get_history()
    finally:
        os.remove(path)

    recent = [item for item in history if item.get("played") in ("Today", "Yesterday")]
    print(f"\nYouTube Music works: {len(history)} songs in your history, {len(recent)} from today or yesterday.")
    for item in history[:3]:
        print(f"  {item.get('played', '')}: {item.get('title')} by {', '.join(a['name'] for a in item.get('artists') or [])}")
    if not history:
        print("  It's empty. Check YouTube History isn't paused at myactivity.google.com, or the sync will find nothing.")
    return sign_in


def hand_to_github(secrets, repo):
    if gh_ready():
        for name, value in secrets.items():
            subprocess.run(["gh", "secret", "set", name, "--repo", repo], input=value, text=True, check=True)
            print(f"  set {name}")
        return

    clipboard = clipboard_command()
    if not clipboard:
        raise SystemExit("No GitHub CLI and no clipboard tool here, so the values can't be handed over without printing them. Install the GitHub CLI (gh) and run this again.")
    page = f"https://github.com/{repo}/settings/secrets/actions/new"
    print("\nThe GitHub CLI isn't set up here, so this goes through the clipboard. For each secret, GitHub's page opens:")
    print("type the name shown, paste the value (Ctrl+V) and choose Add secret.\n")
    for name, value in secrets.items():
        input(f"Press Enter to copy {name} ...")
        subprocess.run(clipboard, input=value, text=True, check=True)
        webbrowser.open(page)
        print(f"  {name} is on the clipboard. Name it {name}.")
    input("\nPress Enter once the last one is added, to clear the clipboard ...")
    subprocess.run(clipboard, input=" ", text=True, check=True)


def main():
    repo = current_repo()
    print(f"Setting up the YouTube Music sync's secrets for {repo}.\n")
    print("From the Google Cloud OAuth client (type: TVs and Limited Input devices):")
    client_id = ask("  Client ID: ")
    client_secret = ask("  Client secret (hidden): ", secret=True)

    try:
        sign_in = youtube_music_sign_in(client_id, client_secret)
    except ImportError:
        raise SystemExit("ytmusicapi isn't installed. Run: py -m pip install --user -r scripts/ytmusic-sync/requirements.txt")

    token = ask("\nListenBrainz user token, from listenbrainz.org/settings (hidden): ", secret=True)
    print(f"ListenBrainz works: the token is {listenbrainz_user(token)}'s.")

    hand_to_github(
        {
            "LISTENBRAINZ_TOKEN": token,
            "YTMUSIC_CLIENT_ID": client_id,
            "YTMUSIC_CLIENT_SECRET": client_secret,
            "YTMUSIC_OAUTH_JSON": sign_in,
        },
        repo,
    )
    print("\nDone. The sync runs every 30 minutes once its workflow is on master.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit("\nStopped. Any secret already added on GitHub stays; run this again to redo them all.")
