# Minecraft modpack downloads

`/minecraft` (`src/components/pages/minecraft`) is the download page for Progression Survival, the modpack for Jake's modded Minecraft server. It opens as an overlay on the board, from the modpack tile. The pack itself is built elsewhere, in Jake's Codex workspace (`Documents/Codex/2026-10-23/minecraft-progressive-smithing`), and only its finished releases are published here.

The page is written for players: its readers are the public, not people hosting a server. It links each release's `.mrpack` and release notes, and nothing else. Jake had the Server files tile (the server template and the checksum file) taken off it on 2026-10-26; the server `.zip` is still published with each release (see Rules), just not linked from the page.

Self-hosters get one line at the foot of the Install tile instead: the `.mrpack` works with server tools that can install from one, and they should set `difficulty=hard` in `server.properties`. That's enough because the `.mrpack` is a complete server definition: the same mods as the server `.zip`, all marked as needed on the server, and its `server-overrides` hold the same configs, quests and KubeJS files as the zip's payload. What it lacks is `server.properties` (the release script refuses one), so a server built from it starts on Easy. The zip's extras are Windows-only PowerShell setup scripts and Jake's settings, written for friends he hosts with.

## Publishing a release

1. Build the release in the pack workspace. It produces a folder such as `outputs/Progression-Survival-1.0.0-rc.2/` holding `mods.lock.json`, `Release-Notes.md`, one `.mrpack`, one `Progression-Survival-Server-*.zip`, and the archives' hashes in `SHA256SUMS.txt` or, in builds that don't write one (rc.2, rc.6), in `latest.json`.
2. Copy it into the site:
   ```bash
   yarn modpack:release "C:/Users/Jake/Documents/Codex/2026-10-23/minecraft-progressive-smithing/outputs/Progression-Survival-1.0.0-rc.2"
   ```
3. Commit and push. The deploy uploads it.

`scripts/release-modpack.mjs` refuses a release whose archives don't match the builder's `SHA256SUMS.txt` (or, without one, the `artifacts` in its `latest.json`), or that contain worlds, player data, admin lists, `server.properties` or logs. It copies the two archives and the notes into `public/downloads/progression-survival/releases/<version>/`, writes a checksum file covering just those two archives, and regenerates:
- **`releases.json`:** every release, newest first. The download page and the board's modpack tile read it at runtime (`src/common/modpack.ts`), so a release needs no code change.
- **`latest.json`:** the newest release on its own.
- **`.htaccess`:** `latest.mrpack` and `latest-server.zip` answer with a 302 to the newest files, never a 301, which browsers would remember forever. It also sets `no-cache` on the JSON files and `no-store` on those redirects.

The deploy uploads `releases.json`, `latest.json` and `.htaccess` on every run (see the workflow). They can change between versions without changing length, and the deploy otherwise compares files by size.

## Rules

- **A deployed release folder is never edited, overwritten or deleted.** Friends and the `latest` redirects may point at it, and the deploy wouldn't notice a same-size change anyway. A fix goes out as a new version. `--force` is only for a version that hasn't been pushed yet.
- **Only four files per release are published:** the client `.mrpack`, the server `.zip`, `Release-Notes.md`, and a `SHA256SUMS.txt` covering the two archives. The builder's other output stays in its workspace on purpose. That includes the custom-source ZIP (it holds local paths and test-command names), `mods.lock.json`, `package-acceptance.json` and the other verification files.
- **Third-party mod jars are never hosted here.** The `.mrpack` downloads them from their publishers (Modrinth, FTB's Maven), because the mods' licences haven't been checked for redistribution.
- **`releases.json`, `latest.json` and the folder's `.htaccess` are generated.** Edit the script, not the output.

## State

- **Published:** `1.0.0-rc.6` (latest, added 2026-10-27, matching the updated server) and `1.0.0-rc.1`, both labelled test builds on the page. rc.2 to rc.5 were built but never published.
- **Untested (as of 2026-10-26):** a real Prism import and a friend joining over the internet.
- **Server address:** not on the page. Friends get it from Jake.
