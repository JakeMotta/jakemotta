# Automatic client update publication

The Minecraft page reads `public/downloads/progression-survival/packwiz/current.json`. Its starter ZIP follows the approved `packwiz/pack.toml` feed. This channel is independent of the latest manual release.

`yarn modpack:release` now generates an immutable Packwiz candidate from the sibling Minecraft repository's verified release. It does not advance the approved feed. Python 3.11+ is needed; set `MODPACK_PYTHON` to its executable if discovery fails.

Backfill a candidate:

```powershell
yarn modpack:updates --release-dir ../minecraft-progression/outputs/Progression-Survival-1.0.0-rc.15
```

After a separately coordinated server update/restart, approve its matching client:

```powershell
yarn modpack:updates --release-dir ../minecraft-progression/outputs/Progression-Survival-1.0.0-rc.15 --approve-server ../minecraft-progression/server-instances/Survival-001
```

This Windows-only read-only gate verifies the active instance and runtime hashes before changing the feed. It never updates the server. A Minecraft/NeoForge change requires a new starter channel. The initial approved client is RC 12 / Journal 0.9.8, matching the running server's shared runtime; RC 15 remains only a candidate until that server is upgraded. The server's stale lock-file version is not runtime evidence.

Run `yarn test:packwiz`, the normal site tests and `yarn build`, then commit/push the focused website files. Deployment uploads immutable payloads before force-uploading the non-cached approved pointers. Never overwrite a versioned distribution, point the feed at a nested index, or copy private account/world/settings files into the starter.

The full build/delivery checks and operator guide are in the sibling repository's `work/packwiz-publishing.md`. Source scripts live in `work/build-packwiz-release.py`, `work/verify-packwiz-server.py`, and `work/packwiz-runtime.json` there. Player instructions are published at `packwiz/Install-and-Update.md`.
