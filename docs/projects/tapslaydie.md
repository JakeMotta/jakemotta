# TapSlayDie

A hardcore fantasy clicker RPG for iOS and Android, started in 2026: tap the enemy to kill it, loot gear off what you kill, and die. Built in Godot, with a React web app and a leaderboard server.

- **Source:** its own repository, `JakeMotta/TapSlayDie` (locally `Documents/Github/TapSlayDie`), a monorepo with `mobile-game/`, `web/` and `server/`. Its own README and CLAUDE.md govern it.
- **Live:** the web app at `https://tapslaydie.com/` (landing page, leaderboards, wiki, support), the leaderboard API at `api.tapslaydie.com`. It's hosted on the same Namecheap account as this site, but deployed from its own repo.

## Preview

The card's `preview` is the live site's address, `https://tapslaydie.com/`, so the viewer frames the real thing and stays current with no copy here. On 2026-10-26 the site sent no `X-Frame-Options` or `frame-ancestors`, so framing works. If TapSlayDie ever adds either, the frame goes blank, and the card needs a static copy in `public/projects/` or a preview-less card instead.

The framed document is cross-origin, so the viewer can't apply its link handling inside it: TapSlayDie's links behave as that site wrote them.

Nothing from TapSlayDie is copied into this repo except the card image.

## Card image

`public/images/projects/tapslaydie.webp`, a screenshot of the live landing page taken by `yarn projects:screenshot tapslaydie`. Retake it when the landing page changes.
