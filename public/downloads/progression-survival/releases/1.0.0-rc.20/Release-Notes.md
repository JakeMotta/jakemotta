# Progression Survival 1.0.0-rc.20

One-hour recoverable graves on top of RC19, retaining Journal 0.9.14, progression, bounties and reduced enemy scaling. Update server and clients together.

## Since rc.19 — recoverable graves

- Add You're in Grave Danger 2.0.13 and its required Cloth Config API 15.0.140 to both server and client.
- Death creates a grave holding dropped inventory, armor and offhand equipment. Anyone can break it immediately to recover its contents; no shovel, key or protection delay is required. Existing equipment-use restrictions still apply after recovery.
- Unclaimed graves expire after one hour of server game time. Expiration is processed when the grave's chunk is loaded; the contents become ordinary dropped items and can then despawn normally. Vanilla experience-loss behavior remains.
- Graves use the death location where placement is possible, nearby valid space if blocked, and a safe minimum height for void deaths. Deaths with keepInventory enabled follow that gamerule.
- This candidate builds directly on verified RC19 / Journal 0.9.14. Existing progression, bounty policies and earlier mod pins are retained. Building it does not change the live server, website or automatic-update feed.

## Since rc.16

- Bows are available from starting Wood Tools. Shields unlock at Iron Armor access without five extra skeleton kills or a shield-crafting prerequisite. Crossbows retain their Iron Armor requirement; personal matching-armor combat proof remains.
- Later Tools food preparation uses distinct vanilla mixed dishes: Iron 16 pumpkin pies and 32 cookies; Gold 12 cakes and 12 suspicious stews; Diamond 12 rabbit stews and 16 golden carrots; Netherite 8 golden apples. Any eligible small flower works for suspicious stew. Earlier wheat/bread and Copper mushroom stew plus personal cod catch/cooking remain. Completed tiers, existing counters and paid receipts stay preserved.
- Replace bounty offers with 47 jobs: 10 Easy, 10 Medium, 15 Hard and 12 Elite. Easy/Medium offer useful local harvesting, crafting, fishing, processing, shearing, mining, hunting and supply jobs. Hard/Elite gathering, capture, loot and hunts require personal work at the actual named source after acceptance. There are no unrelated travel-and-crafting pairs. The swamp hunt requires one witch.
- Server evidence checks actual drops, mature crops, crafting output, rod catches, fish capture, wool yield, ingredient-contributor smelting, generated chest loot, confirmed kills and complete dungeon censuses. Player-placed resources, repeated fish capture, old recovered loot, cancelled events and stale contract evidence cannot substitute for new work. A geode objective requires clusters beside immovable budding amethyst. Wool may be any color. Delivered tropical-fish buckets return empty buckets as part of the shown payout.
- Dungeon-clearing bounties and journal goals require at least 90% of original spawners, rounded up, after the entire structure has been counted. Each of five dungeon types and the all-types challenge has separate proof. The incremental census includes unexplored rooms, resumes across restart and excludes known placed spawners. Nearby qualifying participants share clear credit. Already earned completions remain; old destroyed-spawner history is not reconstructed.
- Enable Small Nether Dungeons in newly generated Nether terrain. Existing explored terrain is not regenerated. The pinned mod's natural generation, loot and journal census were validated.
- Easy bounties award 20-35 XP points, 1-3 emeralds and supplies. Medium awards 60-100 XP, 4-8 emeralds and supplies, with a 50% eligible-gear chance. Hard awards 180-260 XP, 12-20 emeralds, supplies and guaranteed unlocked-tier armor; Elite awards 400-600 XP, 24-40 emeralds, supplies and guaranteed armor. Modest armor-enchantment chances are 25% / 50% for Hard / Elite. Rewards never bypass progression or create personal crafting proof.
- Replace torch supply rewards with one arrow entry per tier: 8 / 16 / 32 / 64 for Easy / Medium / Hard / Elite when arrows are selected. Useful supplies also include food, fuel, mushrooms and resources. Exact rolled rewards are shown before acceptance and remain fixed afterward.
- Accepted contracts keep their original conditions, progress and payouts. Pending reward bundles, completion counters and earned receipts remain preserved. Newly generated offers use the revised catalog. Any valid board can complete a job accepted at another board. The seven-offer layout and refresh rules remain.
- Enemy scaling starts at normal base stats and rises linearly to difficulty 250 caps of 3x health, 2x melee and 1.5x projectile/explosion damage, previously 6x / 4x / 3x. Difficulty growth, nearby-player averaging and player stats are unchanged. A one-time conversion updates saved enemies only when their mod-owned modifiers exactly match the former curves; it preserves damage taken, unrelated modifiers and nonmatching custom stats. Fresh spawns use the new datapack normally.
- Newly earned journal checklist goals and tier advances announce publicly with player/tier context. Existing advancement identities and earned completion markers remain; historical achievements do not replay.
- Cod cooking and potion brewing credit ingredient contributors when processing completes, even with the menu closed or the contributor offline. A friend or hopper collecting output cannot steal credit. Durable receipts prevent duplicate progress. Copper-smelting bounties use the same per-input contribution policy, bound to the accepted contract. Other ore smelting and ordinary storage retain their normal behavior and do not create mining proof.
- Combat titles state the required action and count, including winning a raid for Hero of the Village. Food/crop descriptions and both journal representations are synchronized; new fallback quest/task IDs resolve correctly without changing existing reward identities.

## Since rc.15 — shared crop harvesting

- Harvesting mature wheat, carrots, or potatoes now credits the player who harvests them, regardless of who planted them. Existing village crops count too. This covers the required harvesting goals and optional bulk-harvest quests.
- Planting remains a separate personal task. Immature crops and item pickups do not count as harvests, and picking up or replacing the same crop cannot create duplicate credit. Sapling-growing tasks still credit their planter.
- Existing counters, completed tiers, earned access and reward receipts are preserved. No progress reset, retrospective harvest credit or repeated payout is introduced.
- This is a server-rule update using the existing Journal 0.9.11. The manual download remains a separate release; the Prism auto-update starter follows the version approved for the running server.

## Since rc.14 — construction and the route to the End

- Iron Tools adds one working simple redstone circuit: personally place a lever/button, a straight line of 1–8 dust at the same height, and a piston or iron door at the end; switch it on and make the output respond.
- Gold Tools adds 128 personal rail placements across all four rail types and one continuous minecart trip over 64 different rails you laid. Replacing rails, swapping types, laps and teleporting do not multiply credit. Gold also requires a personal fortress visit; an earlier genuine visit counts.
- Diamond Tools adds three useful potion types, twelve personally crafted Eyes of Ender during the tier, a stronghold visit and entering the End. Its existing introductory table enchant remains. Useful potion types are Healing, Swiftness, Fire Resistance, Strength, Night Vision and Water Breathing; duration/strength/splash variants share a type. Insert brewing ingredients yourself and keep your stand open until the batch finishes.
- The existing personal Dragon advancement becomes the final Tools capstone. An earlier legitimate kill counts; no matching Netherite armor, second Dragon fight or duplicate Dragon payout is added.
- Optional Quests add all six useful brews, ten distinct table-enchanted pieces of usable gear after Diamond Tools access, and an End-city/Elytra flight milestone after the Dragon. Existing End-city, full beacon and Dragon-respawn quests remain.
- Completed tiers and earned access stay completed. New work applies to active/future tiers; preserved earlier-tier rows are clearly marked as exemptions, without inventing historical counters or paying old rewards again. Armor requirements, Stone bow access, crossbow/shield gates, current bounty rolls and reward receipts remain intact.
- Journal 0.9.14 adds the server evidence hooks. Update server/client jars together. This download does not install itself or change a running server; no updater is bundled.

## Since rc.13

- Bow use now unlocks at Stone Tools, where the journal asks you to craft it. It no longer waits for Copper Armor. Bow kill eligibility follows that same Tools gate; matching armor and personal crafting/owner-earned armor requirements remain. Crossbow and shield gates are unchanged. Existing crafting progress, counters and reward receipts remain intact.

## Full release audit since rc.12

- Journal 0.9.9 removes the development-only JVM-property-controlled server shutdown hook while retaining the accepted 0.9.8 journal/bounty behavior. Removed the adapter's test-tag combat exception and the two Hello World example scripts. No changes to normal progression, rewards, saved state or network protocol.

- Source, content/privacy and nested companion-jar checks are now mandatory before the standard verifier can promote a release. They cover both client/server payloads, templates, manifests, all runtime script locations, private state, tokens, machine paths, backups, launcher settings and machine keepalive scripts. Promotion validates the evidence against exact artifact hashes and checks preservation of older files before replacing the stable handoff.

- Eleven offline release-pipeline regressions exercise deterministic archives, nested audit stripping, public-command preservation, privacy/test-hook rejection, lock-side metadata, source changes and failed/successful promotion. Existing gameplay remains covered by the engine and Java test suites.

## Since rc.10

- All tool-work tasks now require the exact active Tools tier and correct tool category, including mining practice, log chopping, digging, tilling, scoped block gathering and named ore quotas. Lower- and higher-tier equipment cannot fill those tasks. Removed only Gold's impossible diamond/redstone ore quotas; Gold quartz and every other harvestable quota remain. Existing progress, unlocks and reward receipts are preserved.

- Includes Journal 0.9.14: quest category choices save immediately per player UUID across reconnects and client restarts; first use opens Farming and closes other categories. Each header shows completed quests / actual total, including while collapsed.

- Restores the original Village Bounties board and bottom-left tracker, with centered journal category headers, concise actual reward previews, scrolling long reward details and one native completion toast for each completed bounty. Removes redundant board milestone/refresh displays while preserving the real ten-bounty quest and refresh rules. Elite text/stripes use pale lavender.

- Protects bounty boards and their three template-associated display signs against survival breaking, explosions and pistons. Ordinary signs and building planks remain destructible; creative/admin removal is available.

- New Hard/Elite bounty offers have 25%/35% gear odds and a 10% conditional enchantment chance after awarding gear. Existing rolled offers, contracts and pending rewards retain their exact rewards. Medium remains at 50% gear.

- Update the server and clients together when coming from rc.10 (Journal 0.9.0). This release contains Journal 0.9.14 and the matching server policy. Preserve the existing world/player data; never run the fresh-server creator over an existing instance. Applying the startup engine requires a server restart. Packaging this release does not update any running server.

- Continues excluding KubeJS's private `web_server.json`; KubeJS creates its own settings on startup. No new third-party mod versions.

- Release packaging removes operator audit/diagnostic commands from every server script, including the armor-return test fixture. Player commands such as `/progress`, `/claimrewards` and `/refreshgear` remain available. rc.11 failed the initial packaging check and was not promoted; rc.12 passed that check, and rc.13 adds the full release audit above.

## Changes

- Quest categories collapse/expand with a same-row pixel chevron, persist each player's choices across client restarts, and show completed / total quest counts even while collapsed. Other journal navigation remains scoped to the connection.

- Reopening the journal advances to the new current tier only when the remembered view was the exact active tier completed while closed. Other tabs and intentionally earlier pages keep their place.

- Pillagers start at Iron, vindicators at Gold, and evokers/ravagers at Diamond. They replace part of the zombie quotas so tier totals and 50% weapon quotas stay unchanged. Five new optional quests cover individual raider hunts and vanilla Hero of the Village raid victory.

- Armor completion supplies award 32 arrows from Leather through Diamond; food and Netherite capstones stay unchanged. Already claimed rewards do not pay again.

- The ten-bounty quest is titled Village Bounties. Future generated board signs are waxed without changing ordinary signs. Existing board signage needs a separate world-specific update.

- Material swords follow Tools stages; weapon/utility crafting belongs in Tools. Armor owns personal set crafting, combat and dungeon challenges.

- Combat requires the full matching personally crafted or owner-earned bounty armor set. Weapon quotas start at Copper and total 50% of each tier mob quota. A kill can satisfy one weapon category and its ordinary mob goal. No locked-tier overflow. No new trident, mace or spear requirements.

- Retuned material-aware goals and food progression. Wood pickaxe remains 256 blocks. Later ore/food/fishing tasks require fresh work in their tier. Practice and tier block-gathering tasks require the exact active tier and correct tool category. Named ore quotas require the exact active-tier pickaxe too. Removed only the impossible Gold diamond/redstone quotas; Gold quartz and every other possible quota remain. Obsidian waits until Diamond access.

- Shield crafting and use unlock together after five skeleton kills in crafted or owner-earned Iron armor, with no circular prior-craft requirement; existing shield access stays valid. Optional training rewards blocking 20 arrows. Projectile credit uses the firing weapon.

- Moderate once-only task XP 10–40 points, plus rebalanced optional quest XP. Moved goals retain payout identity; completed historical tasks are not back-paid.

- Small personal supplies for intermediate tier completion; named enchanted capstones after completing Netherite. A full inventory defers the entire bundle; /claimrewards retries. Reward items never fabricate crafting proof. Previously completed tiers are historical rather than triggering a supply backlog.

- Village Bounties adds village boards with personal hunt/delivery contracts. Normal trades remain. The personal board now shows seven stable offers: 3 Easy / 2 Medium / 2 Hard, changing to 2 / 2 / 2 / 1 Elite after Gold access on the applicable track. Completing 10 bounties is optional and does not gate tiers.

- Improved Mobs retains personal health/damage scaling on Hard, with special AI/equipment, stealing/block breaking and speed/size changes disabled. Its world HUD stays hidden; inventory difficulty remains.

- Updated Prism instructions preserve preferences. This is an importable pack, not an automatic updater.

## Release contents

A versioned client .mrpack, matching reusable Windows server creator ZIP, pinned publisher downloads/hashes, our companion jar, rules/quests/settings, and friend instructions. No worlds, player data or administration secrets are included. Third-party jars download from publishers.

## Personal bounty expansion

- Guaranteed XP points: Easy 10–15, Medium 20–30, Hard 40–60, Elite 70–100. Independent emerald and supply rolls can stack with gear.

- Medium has a 50% gear chance. Hard/Elite have a 25%/35% chance of one current-tier eligible gear item; awarded gear has a conditional 10% chance of modest I–II enchantments. Existing rolled offers/contracts retain their rewards; only newly generated offers use the new odds. Offers show their exact fixed rewards before acceptance.

- 233 distinct difficulty/objective/target combinations, with additional hunts, farming and utility deliveries. Elite combat needs Gold Armor; Elite deliveries need Gold Tools. Normal trading remains.

- One personal completion toast per turned-in contract; no replay on reopen/reconnect. Native completion counters still drive the optional ten-bounty quest.

- Owner-earned armor fills matching-set combat eligibility only for its recipient. It never creates crafting credit or transfers earned eligibility with the item. Ordinary gear and weapon tier limits remain.

- Full inventories defer the entire item bundle; `/claimrewards` retries without another XP payout.

- Previously accepted native contracts retain their objective and progress when first opening the new board; their rewards are converted once to the new tier-capped policy. Completed history stays unchanged.

- Completion restores one native refresh charge; refreshing spends one charge. The publisher's existing ten-completion window and cooldown remain. No extra refresh timer is added.

- Current-client visual review, simultaneous real-player notification visibility, and long-session pacing remain playtests. Automated/native server checks cover persistence, ownership, payout safety and existing progression.

