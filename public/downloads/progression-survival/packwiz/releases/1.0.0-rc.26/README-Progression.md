# Progression Survival

**Friend test · 1.0.0-rc.26**

Minecraft Java 1.21.1 · NeoForge 21.1.264 · Java 21

## Install

1. Install [Prism Launcher](https://prismlauncher.org/) and sign in with your Minecraft Java account.

2. Download `Progression-Survival-1.0.0-rc.26.mrpack` from Jake.

3. In Prism, choose **Add Instance → Import**, select that file, and confirm. Let it download the pack.

4. Launch **Progression Survival**. If asked for Java, select **Java 21**. Use about **4 GB** of memory for this pack.

5. Choose **Multiplayer → Add Server**. Enter the address Jake gives you.

One pack import installs the mods together. Launch that instance rather than a plain Minecraft profile. Keep Minecraft and NeoForge on the pack's pinned versions.

## Play

**J** opens your Progression Journal. **E** opens inventory and shows your mob difficulty.

Quest categories show completed / total quests and remember your choices per player across reconnects and game restarts. On first use, Farming opens and the other categories close.

Bows are usable from starting Wood Tools. The later bow-crafting goal still asks you to make your own. Crossbows require Iron Armor access; shields unlock with Iron Armor access without an extra skeleton-kill requirement.

- **Armor:** craft your own sets, equip the matching full set, and complete combat and dungeon goals.

- **Tools:** craft utility tools and weapons, and complete mining, farming, food and other survival tasks. Material swords follow Tools unlocks.

- **Quests:** optional challenges with one-time XP rewards.

Iron Tools adds a working switch → 1–8 dust in a straight line → piston or iron-door circuit. Gold adds 128 rail placements and one continuous cart trip over 64 different rails you laid, plus a fortress visit. Diamond adds three useful brews, twelve crafted Eyes, a stronghold and End entry; the final Tools tier includes your personal Dragon milestone. Older legitimate discoveries/Dragon proof count, and previously completed tiers remain completed. For brewing credit, insert the ingredient yourself; credit arrives when brewing finishes, even with the screen closed. Expanded brewing, ten distinct enchanted gear pieces and post-Dragon Elytra flight are optional Quests.

Armor crafting can happen before its wear unlock. Shield crafting and use unlock together at Iron Armor access; there is no extra skeleton-kill or shield-crafting prerequisite. Tool recipes follow their Tools stages. Combat credit requires your full crafted set for the active Armor tier. Weapon-specific kills also count toward ordinary mob goals. Mining practice, log chopping, digging and tilling require the exact active Tools tier and the correct pickaxe, axe, shovel or hoe. Tier block-gathering tasks also require the matching shovel (sand/clay) or pickaxe (deepslate/obsidian/end stone). Named ore quotas require the exact active-tier pickaxe too. Impossible Gold diamond/redstone quotas are removed; Gold quartz and all other possible quotas remain. Progression ore and scoped food/fishing work do not prefill later tiers. Optional prospecting quests retain lifetime totals. Repeatedly placing ore won't count. Sharing supplies is allowed, but personal task credit isn't shared. Nearby players can share dungeon-clear credit.

Food preparation uses different dishes at each later Tools tier: Iron needs 16 pumpkin pies and 32 cookies; Gold needs 12 cakes and 12 suspicious stews; Diamond needs 12 rabbit stews and 16 golden carrots; Netherite needs 8 golden apples. Suspicious stew accepts any eligible small flower. Earlier wheat/bread and Copper mushroom stew plus personal cod fishing/cooking remain. Cod cooking credits the input contributor when cooking finishes, regardless of who collects it. Already completed tiers remain completed.

Village Bounties adds noticeboards with seven personal offers from a 47-job catalog. Easy jobs are small local tasks; Medium adds varied work; Hard and Elite require resources or enemies at their actual destination. Accept before doing the stated work. Gathering, fishing, capture, shearing, crafting, mining, processing and hunts use personal server evidence; visiting once or carrying old supplies does not count as that work. Explicit supply-delivery jobs can use existing stock. Work and destination instructions are shown in the details and tracker. Dungeon jobs require a fresh 90%-spawner clear after acceptance. Turn in at any valid board, including a different village.

Exact rewards are fixed and visible before acceptance. Easy pays 20-35 XP points and 1-3 emeralds; Medium 60-100 XP and 4-8 emeralds. Both include supplies, and Medium has a 50% eligible-gear chance. Hard pays 180-260 XP and 12-20 emeralds; Elite 400-600 XP and 24-40 emeralds. Hard/Elite guarantee supplies and one unlocked-tier armor piece, with a 25% / 50% chance of modest enchantments. Arrow supply rewards are 8 / 16 / 32 / 64 by difficulty; torches are removed from the supply pools. Elite opens after Gold access and some destinations need later Tools access. Accepted old contracts retain their conditions and payouts. Completion restores a refresh charge; refresh spends one. Finish or cancel the active job before refreshing. Delivered fish buckets return empty buckets. Optional journal quests include ten bounties and blocking twenty arrows after the Iron shield unlock.

Newly earned journal goals and tier advances announce to online players with their tier context. Dungeon clears require destroying at least 90% of original spawners after the whole structure has been counted; nearby participants can share credit. Each dungeon type and the all-types challenge have their own proof. Small Nether Dungeons can generate in new Nether terrain.

Task XP is awarded once per personal goal. Finishing a tier gives a small supply bundle; finishing Netherite gives a final enchanted item. Rewards do not count as crafting the equipment yourself. Bounty-earned matching armor can qualify for combat only for the player who earned it; other armor pieces must have personal crafting proof. Gear never bypasses tier use restrictions. If inventory space is insufficient, the entire bundle stays safe: free space and run `/claimrewards`.

This server is **Hard**, with personal mob health and damage scaling. At difficulty 250, scaling caps at 3× base health, 2× base melee damage and 1.5× projectile/explosion damage; difficulty zero starts at normal base stats. Special mob AI, equipment, block breaking, stealing, speed and size changes are disabled. Armor and Tools progress separately. New worlds start fresh; updating an existing server preserves its characters and progression.

When you die, a grave stores your dropped inventory and equipment. Anyone can break it immediately to recover the contents, without a special tool. An unclaimed grave expires after one hour of server game time; when its chunk is loaded, its contents become normal item drops. Graves use nearby safe space if the exact death position is blocked, including a safe minimum height for void deaths. XP still follows vanilla death rules.

## If something looks wrong

- **Missing AStages/channel error:** launch the imported pack instance, not a plain NeoForge profile.

- **J opens nothing:** check Options → Controls → Key Binds for **Open Progression Journal** and assign a free key.

- **Can't mine while holding locked gear:** select an allowed tool or an empty hand.

- **Can't connect:** confirm Jake's server is running and use the address he supplied. Everyone needs matching client/server pack versions.

## Updates

This pack includes Journal 0.9.19. When updating from rc.10 / Journal 0.9.0, the server and clients must update together. The server also needs the new rules and bounty policy plus a coordinated restart. Existing character progress and earned rewards remain; Gold's impossible diamond/redstone quotas are removed. The pack does not automatically update a running server.

**Do not uninstall or delete your old instance first.** A new Prism instance starts with its own default preferences; it does not automatically inherit your settings.

1. Fully close Minecraft and back up your old Prism instance.

2. Import the new pack as a separate instance, keeping the old one.

3. Open each instance's actual Minecraft/game folder through Prism. Copy **options.txt** from the old game folder into the new one, backing up any destination copy first. This carries FOV, GUI scale, sound, sensitivity and keybind preferences; verify them after launch.

4. Optionally copy **servers.dat** for server addresses. Preserve any local worlds, screenshots, resource/shader packs and mod-specific personal data separately. Don't blindly copy old mods or the entire config folder over the new release.

5. Launch, check settings and join before considering removing the old instance. Keeping it as a backup is fine. Server-side character progression stays on the server; single-player worlds are local.

If preferences reset, the old instance or its backup may still contain options.txt. Check backups or the Recycle Bin if it was deleted; recovery is not guaranteed. This archive is not an automatic updater.

Reference: [Prism's import instructions](https://prismlauncher.org/wiki/help-pages/Zip-import/).


## Personal Settings and player locator

Press **E**, then the **gear in the top-left corner**. Difficulty is displayed beside the gear. Share my location starts off; enable it only when you want others to find you. Disable it before travelling to a hidden base. This controls the locator, not physical visibility.

Show locator bar, Show bounty tracker and Quest notification sounds start on. Always show player names starts off; hold Tab to see names. Each checkbox is independent and saved for your character on this server. Hiding the tracker does not pause your bounty, and muted quest sounds retain visual notices and announcements.
