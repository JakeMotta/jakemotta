# Progression Survival 1.0.0-rc.14

Combined release with Journal 0.9.9, independent Armor/Tools tracks, 60 optional quests, Village Bounties, and personal rewards.

## Since rc.13

- Bow use now unlocks at Stone Tools, where the journal asks you to craft it. It no longer waits for Copper Armor. Bow kill eligibility follows that same Tools gate; matching armor and personal crafting/owner-earned armor requirements remain. Crossbow and shield gates are unchanged. Existing crafting progress, counters and reward receipts remain intact.

## Full release audit since rc.12

- Journal 0.9.9 removes the development-only JVM-property-controlled server shutdown hook while retaining the accepted 0.9.8 journal/bounty behavior. Removed the adapter's test-tag combat exception and the two Hello World example scripts. No changes to normal progression, rewards, saved state or network protocol.

- Source, content/privacy and nested companion-jar checks are now mandatory before the standard verifier can promote a release. They cover both client/server payloads, templates, manifests, all runtime script locations, private state, tokens, machine paths, backups, launcher settings and machine keepalive scripts. Promotion validates the evidence against exact artifact hashes and checks preservation of older files before replacing the stable handoff.

- Eleven offline release-pipeline regressions exercise deterministic archives, nested audit stripping, public-command preservation, privacy/test-hook rejection, lock-side metadata, source changes and failed/successful promotion. Existing gameplay remains covered by the engine and Java test suites.

## Since rc.10

- All tool-work tasks now require the exact active Tools tier and correct tool category, including mining practice, log chopping, digging, tilling, scoped block gathering and named ore quotas. Lower- and higher-tier equipment cannot fill those tasks. Removed only Gold's impossible diamond/redstone ore quotas; Gold quartz and every other harvestable quota remain. Existing progress, unlocks and reward receipts are preserved.

- Includes Journal 0.9.9: quest category choices save immediately per player UUID across reconnects and client restarts; first use opens Farming and closes other categories. Each header shows completed quests / actual total, including while collapsed.

- Restores the original Village Bounties board and bottom-left tracker, with centered journal category headers, concise actual reward previews, scrolling long reward details and one native completion toast for each completed bounty. Removes redundant board milestone/refresh displays while preserving the real ten-bounty quest and refresh rules. Elite text/stripes use pale lavender.

- Protects bounty boards and their three template-associated display signs against survival breaking, explosions and pistons. Ordinary signs and building planks remain destructible; creative/admin removal is available.

- New Hard/Elite bounty offers have 25%/35% gear odds and a 10% conditional enchantment chance after awarding gear. Existing rolled offers, contracts and pending rewards retain their exact rewards. Medium remains at 50% gear.

- Update the server and clients together when coming from rc.10 (Journal 0.9.0). This release contains Journal 0.9.9 and the matching server policy. Preserve the existing world/player data; never run the fresh-server creator over an existing instance. Applying the startup engine requires a server restart. Packaging this release does not update any running server.

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
