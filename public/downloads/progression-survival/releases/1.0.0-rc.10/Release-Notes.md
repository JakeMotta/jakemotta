# Progression Survival 1.0.0-rc.10

Combined release with Journal 0.9.0, independent Armor/Tools tracks, 60 optional quests, Village Bounties, and personal rewards.

## Since rc.9

- No gameplay changes: the same mods, journal, rules, quests and bounties as rc.9. If you're on rc.9, you don't need to update to keep playing.

- The pack no longer carries KubeJS's `web_server.json`, a settings file holding a private access token that every earlier release included. KubeJS writes a fresh one the first time a server starts.

## Changes

- Quests categories collapse/expand with a same-row pixel chevron and remember their state within a connected session. Progress totals include hidden rows.

- Reopening the journal advances to the new current tier only when the remembered view was the exact active tier completed while closed. Other tabs and intentionally earlier pages keep their place.

- Pillagers start at Iron, vindicators at Gold, and evokers/ravagers at Diamond. They replace part of the zombie quotas so tier totals and 50% weapon quotas stay unchanged. Five new optional quests cover individual raider hunts and vanilla Hero of the Village raid victory.

- Armor completion supplies award 32 arrows from Leather through Diamond; food and Netherite capstones stay unchanged. Already claimed rewards do not pay again.

- The ten-bounty quest is titled Village Bounties. Future generated board signs are waxed without changing ordinary signs. Existing board signage needs a separate world-specific update.

- Material swords follow Tools stages; weapon/utility crafting belongs in Tools. Armor owns personal set crafting, combat and dungeon challenges.

- Combat requires the full matching personally crafted or owner-earned bounty armor set. Weapon quotas start at Copper and total 50% of each tier mob quota. A kill can satisfy one weapon category and its ordinary mob goal. No locked-tier overflow. No new trident, mace or spear requirements.

- Retuned material-aware goals and food progression. Wood pickaxe remains 256 blocks. Later ore/food/fishing tasks require fresh work in their tier. Earlier unlocked tools can satisfy current-tier practice, avoiding golden-tool waste. Obsidian waits until Diamond access.

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

- Medium has a 50% gear chance. Hard/Elite guarantee one current-tier eligible gear item, with 25%/35% chances of modest I–II enchantments. Offers show their exact fixed rewards before acceptance.

- 233 distinct difficulty/objective/target combinations, with additional hunts, farming and utility deliveries. Elite combat needs Gold Armor; Elite deliveries need Gold Tools. Normal trading remains.

- One personal completion toast per turned-in contract; no replay on reopen/reconnect. Native completion counters still drive the optional ten-bounty quest.

- Owner-earned armor fills matching-set combat eligibility only for its recipient. It never creates crafting credit or transfers earned eligibility with the item. Ordinary gear and weapon tier limits remain.

- Full inventories defer the entire item bundle; `/claimrewards` retries without another XP payout.

- Previously accepted native contracts retain their objective and progress when first opening the new board; their rewards are converted once to the new tier-capped policy. Completed history stays unchanged.

- Completion restores one native refresh charge; refreshing spends one charge. The publisher's existing ten-completion window and cooldown remain. No extra refresh timer is added.

- Current-client visual review, simultaneous real-player notification visibility, and long-session pacing remain playtests. Automated/native server checks cover persistence, ownership, payout safety and existing progression.

