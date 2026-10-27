"""Tests for the secrets setup's handover to GitHub. Run with: python -m unittest"""

import unittest
from unittest import mock

import setup_secrets
from setup_secrets import hand_to_github, repo_slug

SECRETS = {"LISTENBRAINZ_TOKEN": "lb-token", "YTMUSIC_OAUTH_JSON": '{"refresh_token": "r"}'}


class RepoSlug(unittest.TestCase):
    def test_reads_https_and_ssh_remotes(self):
        self.assertEqual(repo_slug("https://github.com/JakeMotta/jakemotta.git\n"), "JakeMotta/jakemotta")
        self.assertEqual(repo_slug("git@github.com:JakeMotta/jakemotta.git"), "JakeMotta/jakemotta")

    def test_ignores_other_hosts(self):
        self.assertIsNone(repo_slug("https://gitlab.com/someone/thing.git"))


class HandToGithub(unittest.TestCase):
    def test_sets_each_secret_through_gh_when_signed_in(self):
        with mock.patch.object(setup_secrets, "gh_ready", return_value=True), mock.patch("subprocess.run") as run, mock.patch("builtins.print"):
            hand_to_github(SECRETS, "o/r")
        self.assertEqual(
            [(call.args[0], call.kwargs["input"]) for call in run.call_args_list],
            [(["gh", "secret", "set", "LISTENBRAINZ_TOKEN", "--repo", "o/r"], "lb-token"), (["gh", "secret", "set", "YTMUSIC_OAUTH_JSON", "--repo", "o/r"], '{"refresh_token": "r"}')],
        )

    def test_uses_the_clipboard_without_printing_values(self):
        printed = []
        with (
            mock.patch.object(setup_secrets, "gh_ready", return_value=False),
            mock.patch.object(setup_secrets, "clipboard_command", return_value=["clip"]),
            mock.patch("subprocess.run") as run,
            mock.patch("webbrowser.open") as opened,
            mock.patch("builtins.input", return_value=""),
            mock.patch("builtins.print", side_effect=lambda *args, **_: printed.append(" ".join(map(str, args)))),
        ):
            hand_to_github(SECRETS, "o/r")
        copied = [call.kwargs["input"] for call in run.call_args_list]
        self.assertEqual(copied, ["lb-token", '{"refresh_token": "r"}', " "], "copies each value, then clears the clipboard")
        self.assertEqual(opened.call_args.args[0], "https://github.com/o/r/settings/secrets/actions/new")
        self.assertFalse(any("lb-token" in line or "refresh_token" in line for line in printed))


if __name__ == "__main__":
    unittest.main()
