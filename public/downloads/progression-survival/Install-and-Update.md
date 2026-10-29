# Progression Survival: install and update

The newest version is always on https://jakemotta.com/minecraft, and
https://jakemotta.com/downloads/progression-survival/latest.mrpack always downloads it.

- New to the pack? Follow **First-time install**.
- Already playing? Skip to **Update an existing pack**.

## First-time install

1. Install Prism Launcher (https://prismlauncher.org/) and sign in with your Minecraft Java account.
2. Download the pack. It's a single `.mrpack` file.
3. In Prism, choose **Add Instance → Import**, select the file and confirm. Prism downloads Minecraft, NeoForge and every mod for you.
4. Launch **Progression Survival**. If Prism asks for Java, pick **Java 21**, and give the instance about **4 GB** of memory.
5. Choose **Multiplayer → Add Server** and enter the address Jake sends you.

Launch the imported instance itself. Copying the mods into another Minecraft profile won't work.

## Update an existing pack

> **Keep your old Prism instance.** Don't uninstall or delete it until the new version works and your settings have been transferred.

The pack doesn't update itself. A new version goes in as a separate instance, and it starts on Minecraft's default settings until you bring yours across. Your progress on the server stays on the server.

1. Close Minecraft completely.
2. Back up the old instance: select it in Prism, choose **Copy…**, tick **Select all** and confirm.
3. Download the new version and import it with **Add Instance → Import**, as its own instance. Leave the old one as it is.
4. For each instance, select it and click **Folder**, then open its game folder, called `minecraft` or `.minecraft`.
5. Copy `options.txt` from the old game folder into the new one. If the new one already has one, rename that to `options.txt.bak` first. This brings your FOV, GUI scale, sound, mouse sensitivity and key binds.
6. Launch the new instance, check your settings, join the server and make sure your progress is there. New or changed mods can still need a tweak.
7. Once it all works, you can remove the old instance, or keep it as a backup.

**Worth bringing too:** `servers.dat` keeps your saved servers. If you have single-player worlds, resource packs, shaders or screenshots, copy `saves`, `resourcepacks`, `shaderpacks` or `screenshots` across as well. Don't copy the old `config` or `mods` folders: they can undo the new version's settings or bring back mods it replaced. And leave the instance's Minecraft and NeoForge versions alone; the pack sets them.

## Settings reset already?

If the old instance is still there, close Minecraft and copy its `options.txt` across as above. If it's been deleted, look in your Recycle Bin and any backups for it. Reinstalling the pack won't bring your settings back.
