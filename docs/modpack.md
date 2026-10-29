# Minecraft modpack downloads

`/minecraft` (`src/components/pages/minecraft`) is the download page for Progression Survival, the modpack for Jake's modded Minecraft server. It opens as an overlay on the board, from the modpack tile. The pack itself is built elsewhere, in Jake's Codex workspace (`Documents/Codex/2026-10-23/minecraft-progressive-smithing`), and only its finished releases are published here.

The page is written for players: its readers are the public, not people hosting a server. It links each release's `.mrpack` and release notes, and nothing else. The Download tile describes the pack in one fixed, plain sentence written in the page itself; a release's `summary` in `releases.json` reads like a changelog, so the page doesn't show it (Jake asked on 2026-10-27). The tile keeps to the version, its release date, that sentence, the release notes link and then the download button; the Minecraft, NeoForge and Java versions and the test-build tag were taken off it the same day (the Install steps still say to pick Java 21). Older releases have a tile of their own, one line each: the version, its pack and its notes. Jake had the Server files tile (the server template and the checksum file) taken off it on 2026-10-26; the server `.zip` is still published with each release (see Rules), just not linked from the page.

## First-time install and updates

The page keeps the two apart, so a new player never reads about moving settings (changed on 2026-10-29, after a friend imported rc.6 as a new instance and found Minecraft's default FOV, GUI scale, sound, sensitivity and key binds; he may also have deleted the old instance). The audited rc.1 and rc.6 client packs hold no `options.txt` and no scripts, so the pack didn't wipe anything. The old guide simply said to import an update as a new instance, and a new Prism instance starts with default options.

- **First-time install** keeps the five plain steps and a link down to the update tile.
- **Update an existing pack** opens with a warning, before any step: keep the old Prism instance until the new version works and your settings have been moved. Then: close Minecraft, back up the old instance with Prism's **Copy…** (Select all), import the new pack as its own instance, open each instance's game folder through **Folder** (it's `minecraft` or `.minecraft` inside the instance folder, never a fixed path), copy `options.txt` across (renaming any copy already there to `options.txt.bak`), then launch, check settings, join and check progress before removing the old instance, which may stay as a backup. Under the steps: `servers.dat`, and `saves`, `resourcepacks`, `shaderpacks` and `screenshots` for players who have them; never the old `config` or `mods`, which would undo the new version's settings or bring back mods it replaced; leave Minecraft and NeoForge to the pack. A recovery note says what to do when settings have already reset, without promising anything once the old instance is gone.
- **What it must not claim:** that the pack updates itself, that settings move by themselves, that Prism has an "Update pack" button for an imported `.mrpack`, or that every copied setting will carry over. Server progress lives on the server and needs no moving; single-player saves are local and do.
- **Prism's labels** (**Add Instance → Import**, **Folder**, **Copy…** with **Select all**) were checked against Prism Launcher 11.1.1, the current release on 2026-10-29 (its `MainWindow.ui` and `CopyInstanceDialog.ui`), and Prism's [download-modpacks](https://prismlauncher.org/wiki/getting-started/download-modpacks/) page. Check them again before adding screenshots or if Prism renames them.

The same steps are a file players can keep: `public/downloads/progression-survival/Install-and-Update.md`, linked as "Save these steps" from both tiles. It names no version (it points at the page and `latest.mrpack`), so it doesn't change with a release. Edit it alongside the page whenever the steps change. It's rewritten in place, so the deploy uploads it on every run.

The README inside each `.mrpack` (`overrides/README-Progression.md`) comes from the pack builder. rc.6's still gives the old one-line update advice and can't be changed, since a published release is never edited. The builder's README for the next release should match these steps.

## Self-hosting

Self-hosters get one line at the foot of the Install tile instead: the `.mrpack` works with server tools that can install from one, and they should set `difficulty=hard` in `server.properties`. That's enough because the `.mrpack` is a complete server definition: the same mods as the server `.zip`, all marked as needed on the server, and its `server-overrides` hold the same configs, quests and KubeJS files as the zip's payload. What it lacks is `server.properties` (the release script refuses one), so a server built from it starts on Easy. The zip's extras are Windows-only PowerShell setup scripts and Jake's settings, written for friends he hosts with.

## Publishing a release

1. Build the release in the pack workspace. It produces a folder such as `outputs/Progression-Survival-1.0.0-rc.2/` holding `mods.lock.json`, `Release-Notes.md`, one `.mrpack`, one `Progression-Survival-Server-*.zip`, and the archives' hashes in `SHA256SUMS.txt` or, in builds that don't write one (rc.2, rc.6), in `latest.json`.
2. Copy it into the site:
   ```bash
   yarn modpack:release "C:/Users/Jake/Documents/Codex/2026-10-23/minecraft-progressive-smithing/outputs/Progression-Survival-1.0.0-rc.2"
   ```
3. Commit and push. The deploy uploads it.

`scripts/release-modpack.mjs` refuses a release whose archives don't match the builder's `SHA256SUMS.txt` (or, without one, the `artifacts` in its `latest.json`), or that contain worlds, player data, admin lists, `server.properties` or logs. Since 2026-10-29 it also refuses a player's own client files: `options.txt` (and `optionsof.txt`, `optionsshaders.txt`), `servers.dat`, `saves/`, `screenshots/` and a launcher's `accounts.json`. A pack shipping the builder's `options.txt` would replace every player's settings on import. A mod config that happens to be called `options.txt` would trip it too; rename it in the builder rather than loosening the check. It copies the two archives and the notes into `public/downloads/progression-survival/releases/<version>/`, writes a checksum file covering just those two archives, and regenerates:
- **`releases.json`:** every release, newest first. The download page and the board's modpack tile read it at runtime (`src/common/modpack.ts`), so a release needs no code change.
- **`latest.json`:** the newest release on its own.
- **`.htaccess`:** `latest.mrpack` and `latest-server.zip` answer with a 302 to the newest files, never a 301, which browsers would remember forever. It also sets `no-cache` on the JSON files and `no-store` on those redirects.

The deploy uploads `releases.json`, `latest.json`, `.htaccess` and `Install-and-Update.md` on every run (see the workflow). They can change between versions without changing length, and the deploy otherwise compares files by size.

## Rules

- **A deployed release folder is never edited, overwritten or deleted.** Friends and the `latest` redirects may point at it, and the deploy wouldn't notice a same-size change anyway. A fix goes out as a new version. `--force` is only for a version that hasn't been pushed yet.
- **Only four files per release are published:** the client `.mrpack`, the server `.zip`, `Release-Notes.md`, and a `SHA256SUMS.txt` covering the two archives. The builder's other output stays in its workspace on purpose. That includes the custom-source ZIP (it holds local paths and test-command names), `mods.lock.json`, `package-acceptance.json` and the other verification files.
- **Third-party mod jars are never hosted here.** The `.mrpack` downloads them from their publishers (Modrinth, FTB's Maven), because the mods' licences haven't been checked for redistribution.
- **`releases.json`, `latest.json` and the folder's `.htaccess` are generated.** Edit the script, not the output.

## State

- **Published:** `1.0.0-rc.6` (latest, added 2026-10-27, matching the updated server) and `1.0.0-rc.1`, both labelled test builds on the page. rc.2 to rc.5 were built but never published.
- **Untested (as of 2026-10-26):** a real Prism import and a friend joining over the internet.
- **Server address:** not on the page. Friends get it from Jake.
- **Installers:** the site offers plain downloads only; nothing on it installs or updates the pack. The server `.zip`'s PowerShell scripts (not linked from the page) only ever write into a new folder: `Create-Server-Instance.ps1` refuses a name that already exists, and none of them deletes anything or touches a client's files (checked 2026-10-29 on rc.6).
