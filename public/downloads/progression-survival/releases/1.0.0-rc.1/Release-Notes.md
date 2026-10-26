# Progression Survival 1.0.0-rc.1

First reusable private-test release candidate. Includes the custom Progression Journal 0.7.2, independent armor/tool progression, 53 optional XP quests, mining provenance, dungeon challenges, inventory-safe armor rejection, deduplicated task/tier notifications, Improved Mobs and YUNG's Better Dungeons.

## Included files

- `Progression-Survival-1.0.0-rc.1.mrpack`: one client-pack import for a compatible launcher.
- `Progression-Survival-Server-1.0.0-rc.1.zip`: reusable Windows server creator and clean payload.
- `Friend-Quickstart.md`: installation and play instructions.
- `mods.lock.json`: pinned download metadata and hashes.
- `latest.json`: versioned artifact metadata for future hosting; currently local only.
- `download-and-archive-verification.json`: publisher-download and ZIP integrity results.
- `package-acceptance.json`: actual bootstrap/runtime verification results when present.

Worlds, personal progress, admin passwords, Minecraft binaries and Java are not distributed. Third-party jars download from publishers. The custom companion jar and configuration are included.

## Limits of this candidate

This is an importable pack, not a standalone EXE or automatic updater. Publisher download bytes and local server startup have been verified. A real launcher import, client join and two-account gameplay check remain required. Home-network firewall/forwarding and a public address remain required before friends can connect over the internet.

Public Modrinth publication needs additional review because FTB dependencies use the publisher's Maven domain. No website or public listing has been created.

## Rebuild

From the project workspace, run `work/build-first-pack.py` using Python 3. It reads the existing authoritative server and pinned metadata; it does not package a world. Run `work/verify-first-pack.py` to download and verify the listed publisher files. Keep these source scripts and custom-mod source with the project. Do not build from the synthetic development server adapter.
