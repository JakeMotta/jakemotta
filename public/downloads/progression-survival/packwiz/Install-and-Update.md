# Progression Survival: install and automatic updates

1. Install Prism Launcher from https://prismlauncher.org/download/ and sign in to your Microsoft account privately.
2. Download the auto-updating Prism ZIP from https://jakemotta.com/minecraft.
3. Choose Add Instance > Import in Prism and select that ZIP. Review the included pre-launch command: it should use the bundled Packwiz installer and the HTTPS feed on jakemotta.com. Accept only the trusted download's command prompt.
4. Use Java 21 and about 4 GB of memory. Click Play. The first launch downloads the approved mods and settings; later launches check for approved updates before Minecraft starts.
5. Add the server address Jake gives you. The address is not included in public downloads.

## Bringing your settings

Keep and back up your old instance with Prism Copy > Select all before changing anything. Close Minecraft. Import the new starter as a separate instance, then copy options.txt and servers.dat from the old game folder into the new game folder. For personal worlds, resource packs, shaders and screenshots, copy saves, resourcepacks, shaderpacks and screenshots if you want them. Do not overwrite existing files without a backup.

Do not copy old mods, pack-owned config folders, launcher account files or updater state. This avoids restoring obsolete mods or private credentials. Your multiplayer progression stays on the server. Keep the old instance until the new one works.

## What updates automatically

This instance follows the server-compatible approved channel, which can intentionally be older than the latest published release. Before every game launch, Packwiz synchronizes approved mods, scripts and pack-owned configs. Personal saves, options and server lists are not in its managed file list. Edits to pack-owned configs can be replaced by an update, so back up custom changes.

An Internet connection is required. A failed check blocks startup instead of launching a partly updated pack. Close and relaunch Minecraft to get updates; a running session does not change. Minecraft/NeoForge upgrades and new updater-tool versions require a replacement starter instance and coordinated instructions. Updating downloads does not restart or update the live server.

## Manual downloads

Existing .mrpack installations remain manual. Use the release matching your server, back up first, and use Prism's Edit > Modrinth URL field > Update Pack when available. Importing a new .mrpack as a separate instance remains a fallback. Do not assume the latest published .mrpack matches the currently running server.
