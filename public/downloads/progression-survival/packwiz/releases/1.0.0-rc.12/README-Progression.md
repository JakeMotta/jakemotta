# Progression Survival

**Friend test · 1.0.0-rc.12**

Minecraft Java 1.21.1 · NeoForge 21.1.264 · Java 21

## Install

1. Install [Prism Launcher](https://prismlauncher.org/) and sign in with your Minecraft Java account.

2. Download `Progression-Survival-1.0.0-rc.12.mrpack` from Jake.

3. In Prism, choose **Add Instance → Import**, select that file, and confirm. Let it download the pack.

4. Launch **Progression Survival**. If asked for Java, select **Java 21**. Use about **4 GB** of memory for this pack.

5. Choose **Multiplayer → Add Server**. Enter the address Jake gives you.

One pack import installs the mods together. Launch that instance rather than a plain Minecraft profile. Keep Minecraft and NeoForge on the pack's pinned versions.

## Play

**J** opens your Progression Journal. **E** opens inventory and shows your mob difficulty.

Quest categories show completed / total quests and remember your choices per player across reconnects and game restarts. On first use, Farming opens and the other categories close.

- **Armor:** craft your own sets, equip the matching full set, and complete combat and dungeon goals.

- **Tools:** craft utility tools and weapons, and complete mining, farming, food and other survival tasks. Material swords follow Tools unlocks.

- **Quests:** optional challenges with one-time XP rewards.

Armor crafting can happen before its wear unlock. Shield crafting and use unlock together after five eligible Iron skeleton kills. Tool recipes follow their Tools stages. Combat credit requires your full crafted set for the active Armor tier. Weapon-specific kills also count toward ordinary mob goals. Mining practice, log chopping, digging and tilling require the exact active Tools tier and the correct pickaxe, axe, shovel or hoe. Tier block-gathering tasks also require the matching shovel (sand/clay) or pickaxe (deepslate/obsidian/end stone). Named ore quotas require the exact active-tier pickaxe too. Impossible Gold diamond/redstone quotas are removed; Gold quartz and all other possible quotas remain. Progression ore and scoped food/fishing work do not prefill later tiers. Optional prospecting quests retain lifetime totals. Repeatedly placing ore won't count. Sharing supplies is allowed, but personal task credit isn't shared. Nearby players can share dungeon-clear credit.

Village Bounties adds village noticeboards with seven personal hunt/delivery offers. Accept before doing hunt kills; turn in at a board. Exact rewards are fixed and shown before acceptance. Easy always pays 10–15 XP points, Medium 20–30, Hard 40–60 and Elite 70–100. Emeralds, supplies and eligible gear can stack. Medium has a 50% gear chance; Hard/Elite have a 25%/35% chance of one eligible gear item, with a conditional 10% chance of modest enchantments after gear is awarded. Existing rolled offers/contracts retain their rewards; only newly generated offers use the new odds. Elite jobs unlock after Gold access on the relevant progression track. Completion restores a refresh charge; refresh spends one. Finish or cancel the active job before refreshing. Delivering items is distinct from our mining-action tasks. Ordinary villager trading remains. The journal includes optional quests for completing ten bounties and blocking twenty arrows after the Iron shield unlock.

Task XP is awarded once per personal goal. Finishing a tier gives a small supply bundle; finishing Netherite gives a final enchanted item. Rewards do not count as crafting the equipment yourself. Bounty-earned matching armor can qualify for combat only for the player who earned it; other armor pieces must have personal crafting proof. Gear never bypasses tier use restrictions. If inventory space is insufficient, the entire bundle stays safe: free space and run `/claimrewards`.

This server is **Hard**, with personal mob health and damage scaling. Special mob AI, equipment, block breaking, stealing, speed and size changes are disabled. Armor and Tools progress separately. Each player starts fresh on the friend-test server.

## If something looks wrong

- **Missing AStages/channel error:** launch the imported pack instance, not a plain NeoForge profile.

- **J opens nothing:** check Options → Controls → Key Binds for **Open Progression Journal** and assign a free key.

- **Can't mine while holding locked gear:** select an allowed tool or an empty hand.

- **Can't connect:** confirm Jake's server is running and use the address he supplied. Everyone needs matching client/server pack versions.

## Updates

This pack includes Journal 0.9.8. When updating from rc.10 / Journal 0.9.0, the server and clients must update together. The server also needs the new rules and bounty policy plus a coordinated restart. Existing character progress and earned rewards remain; Gold's impossible diamond/redstone quotas are removed. The pack does not automatically update a running server.

**Do not uninstall or delete your old instance first.** A new Prism instance starts with its own default preferences; it does not automatically inherit your settings.

1. Fully close Minecraft and back up your old Prism instance.

2. Import the new pack as a separate instance, keeping the old one.

3. Open each instance's actual Minecraft/game folder through Prism. Copy **options.txt** from the old game folder into the new one, backing up any destination copy first. This carries FOV, GUI scale, sound, sensitivity and keybind preferences; verify them after launch.

4. Optionally copy **servers.dat** for server addresses. Preserve any local worlds, screenshots, resource/shader packs and mod-specific personal data separately. Don't blindly copy old mods or the entire config folder over the new release.

5. Launch, check settings and join before considering removing the old instance. Keeping it as a backup is fine. Server-side character progression stays on the server; single-player worlds are local.

If preferences reset, the old instance or its backup may still contain options.txt. Check backups or the Recycle Bin if it was deleted; recovery is not guaranteed. This archive is not an automatic updater.

Reference: [Prism's import instructions](https://prismlauncher.org/wiki/help-pages/Zip-import/).

