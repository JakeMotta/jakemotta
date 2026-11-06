# The dev log

`/devlog` (`src/components/pages/devlog`) is an overlay on the board, opened from the board's **Dev log** tile (it was the Hero's Dev log chip until 2026-10-29, when that tile took Up next's cell and the Hero's chips went). Jake asked for it on 2026-10-27, to post updates on what he's working on and to show how much he works with Claude. It's laid out as a board of its own, like the modpack page:

| Tile | What it shows | Where it comes from |
| --- | --- | --- |
| **Updates** (left, over On GitHub on a desktop) | Jake's posts, newest first | Markdown files in `src/devlog/posts/` |
| **Me & Claude** | Hours, tokens and sessions; a chart since the first session (hours or tokens, stacked by project, with a hover/focus tooltip), a bar per day, week (Monday on) or month, which Jake asked for on 2026-10-28; each project's totals; when it was last updated | `src/devlog/stats.json` |
| **On GitHub** (bottom left) | GitHub's contribution count for the last year, Jake's commits and the lines he's written; a code frequency chart (below); each project's commits and lines added and removed. Jake asked for the commits and code frequency on 2026-10-29 | `src/devlog/stats.json` |
| **Latest commits** (right, under Me & Claude) | The newest commits of the public repositories, linked to GitHub | `src/devlog/stats.json` |

On a desktop, Me & Claude and On GitHub take the height they need as far as the screen allows (`minmax(0, auto)` rows) and scroll past that, and Updates and Latest commits share the rest; a tile's contents never shrink, so a short screen scrolls a tile rather than flattening its chart. On tablets and phones the tiles stack and the overlay scrolls.

## The board's tile

`DevlogTile` (`pages/home/tiles.tsx`) is the dev log on the board, in the cell Up next had: the newest post's date and title, the code frequency chart small (the same `CodeFrequency`, `compact`: no dates, legend or hover numbers, and drawn as one element cut to the bars by a mask, since 2026-11-05, rather than the full chart's 150 or so; see [performance.md](performance.md#keep-the-board-small)), and the commit and contribution counts. It reads the same `stats.json`, and the posts through the same `useDevlogPosts()`, so opening the overlay after it fetches nothing again.

## Code frequency

`atoms/code-frequency` draws Jake's code a week (Monday on) at a time, like GitHub's code frequency graph: lines added rise from the line and lines removed hang under it, both to the same scale, in the tile's text colour (removed at 45%), with a legend, so colour alone never tells them apart. It starts at the first week with a commit (`codeWeeks()`), not on months of nothing. Hovering or focusing a week names its commits and lines.

## Naming Claude

Until 2026-10-27 the site never mentioned Claude anywhere. Jake chose to name it openly in the dev log: the page, its title and description (`OVERLAYS` in `common/seo.ts`) and the posts. The rest of the site still doesn't. Source comments about the muted preview setup still say "the preview server".

## Writing a post

Add a file to `src/devlog/posts/`, named `YYYY-MM-DD-slug.md`:

```markdown
---
title: The site got a dev log
project: jakemotta.com
---

First paragraph, in Jake's voice.

- a list
- [a link to a project](/project/tapslaydie), which opens over the board
```

- **The header:** `title` is needed. `project` is optional and shows as a pill. `date` is optional and overrides the one in the file name.
- **Loading:** `common/devlog.ts` finds every `.md` there with webpack's `require.context`. webpack copies each one into the build under a hashed name, and the page fetches them when it opens. So a post needs no code change and no deploy exception.
- **Markdown:** `atoms/markdown` covers only a little of it: paragraphs, `#`/`##` headings, `-` lists, a picture alone on a line (`![alt](/images/…)`, kept under `public/images/`), and **bold**, *italic*, `code` and links within them. It renders elements and never injects HTML. A link to an app path (`/project/…`, `/library`) is a router link, so the music keeps playing; anything else opens in a new tab.
- **Copy:** posts are in Jake's voice, like the rest of the site's copy (see Style in `CLAUDE.md`).

Claude can draft a post at the end of a session when Jake asks. Jake reads it before it's committed.

## Refreshing the numbers

```bash
yarn devlog:stats
```

`scripts/devlog-stats.mjs` runs on Jake's machine, by hand, and rewrites `src/devlog/stats.json`. Commit that file and push to publish. CI can't run the script, because it reads things only this machine has. Since 2026-11-05, as Jake asked, it reads everywhere he contributes, TYB included, not just the four repositories it started with:

- **Claude Code's transcripts** in `~/.claude/projects/`, subagent and workflow transcripts included. For each reply it takes the model, the token counts (input, output, cache writes, cache reads) and the timestamp, counting each reply once by its message id, since a reply is written once per content block. It tells sessions apart by their ids, and the project by the session's working folder: the first part of its path that's one of a project's `folders`, so a worktree counts toward its repository, Friday's worktrees (`~/.personal-voice-agent/worktrees/jakemotta-task-35`) toward theirs, and Friday's own task folders toward Friday.
- **Why some days are empty.** The chart can only count what's still on disk, and two things leave gaps (checked 2026-11-06):
  - Claude Code deletes a transcript a month after its last use (`cleanupPeriodDays`, 30 by default, in `~/.claude/settings.json`). Most of September and early October was gone before the dev log existed, TapSlayDie's daily work among it, and can't be brought back.
  - Days worked in Codex rather than Claude Code (most of October 21 to 25, and October 31 and November 4) aren't Claude's, so they're left out on purpose. The commits on GitHub count those days whatever wrote them.
- **Counted days are kept** (since 2026-11-06, as Jake asked). `stats.json` is the record of what's been counted, so the transcripts can go: the script starts from the last `stats.json` and adds to it. A day the transcripts now show fewer replies for than the last run keeps the last run's rows wherever they're larger, and the difference goes into the totals (hours, sessions, replies, tokens and each model's tokens); it prints which days it kept. A day they show at least as much of is counted fresh. Each day's row carries its tokens by model (`models`) for this. So never delete days from `stats.json` by hand, and run the script at least once a month, before Claude Code deletes a month's transcripts.
- **Another machine's transcripts.** TYB is worked on from the Momo machine, whose sessions aren't here, and nor are the ones run in the cloud. Copy that machine's `~/.claude/projects/` anywhere outside this repository and name it in `DEVLOG_TRANSCRIPTS` (several folders separated by `;` on Windows, `:` elsewhere); its paths are matched the same way, so `/Users/…/tyb-app` counts as TYB. Replies are counted once by id, so a folder copied twice does no harm. Until then TYB's hours are only what was run here.
- **The sibling repositories** (`../<folder>`, beside the main checkout, so the script works from a worktree too), for `git log`. Every clone there counts, listed in `PROJECTS` or not (then as Other).
- **GitHub, signed in as the GitHub CLI is** (`gh auth token`, or `GITHUB_TOKEN`), for the repositories Jake works in that aren't cloned here: TYB's (`TYB-U/*`, `tyb-app` above all), Ambii's and old teams'. It lists every repository he owns, collaborates on or is in the organisation of, and any he's committed to besides, then reads his commits on each one's default branch and GitHub's own weekly count of his lines. GitHub works those numbers out when first asked, so a run takes a few minutes. Without a sign-in only the clones count.
- **Jake's GitHub profile page** (`github.com/users/JakeMotta/contributions`, public, no key), for GitHub's own "contributions in the last year". When it can't be read, the last count stays, with the day it was read.

How it counts:

- **Hours:** each project's messages in time order. A gap of 15 minutes or less (`IDLE_MINUTES`) counts as working time, and a longer one ends the stretch. The headline hours put every project's messages on one timeline, so two sessions running at once count once. That's why it can be a little less than the per-project hours added up.
- **Tokens:** everything sent to and from the model, cache reads included. Cache reads are most of it ("Claude rereading my code"), so the tile also says how many tokens Claude wrote itself (output).
- **Days:** the machine's local time zone.
- **Commits and lines:** only Jake's (`AUTHOR_NAMES` in a clone, his GitHub login elsewhere), so other people's commits in a shared repository (Friday is Austin's) and bots' don't count; merges are left out. A clone counts its default branch (`origin/HEAD`) and the branch it has checked out, not branches that were never merged, as GitHub doesn't. Each commit counts once wherever it turns up, by its author time and subject, which survive a rebase or a copy: TapSlayDie Ascension began as a copy of TapSlayDie's history, and the Ambii and Kavi repositories have forks and copies. Only code counts toward a clone's lines: each project's `notCode` folders (the archived sites, Ruffle, the modpack downloads and scratch, TapSlayDie's art) and lockfiles are left out of them, or they'd bury the code. GitHub's count can't leave anything out, so a repository read from there counts its lockfiles and builds too (the old Ambii repositories have hundreds of thousands of lines of them); where some of a week's commits were already counted elsewhere, that week keeps only its new commits' share of the lines. The chart covers the last 52 weeks (`CODE_WEEKS`); the totals, all time.
- **Contributions:** GitHub's number, which counts commits, pull requests, issues and reviews, and private repositories when the profile shows them. It's a different count from the commits, so both are shown.

## What is and isn't published

- **Only totals leave the transcripts.** Nothing typed, no file contents, no session titles.
- **Folder and repository names:** a session in a folder, or a repository, that isn't in the script's `PROJECTS` counts as **Other**, so its name is never published unless it's listed there. To give a project its own name and colour, add it to `PROJECTS` with its `folders` and `repos` (`owner/name`, `owner/*` for a whole organisation, `*/ambii*` for every repository named that). As of 2026-11-05 they're jakemotta.com, TYB, TapSlayDie (Ascension included), Progression Survival, Friday, Black Box, Ambii, Asteroids and the farming game.
- **Commits:** only counts and lines leave a private repository. Subjects are published only for repositories with `commits: true`, which is on only for public ones. As of 2026-11-05 that's still just `jakemotta`; every other repository in `PROJECTS` is private, so they show up in the hours and the totals but not in the latest commits. Long subjects (TapSlayDie writes whole paragraphs) are cut to their first sentence, at most 140 characters. Each repository gives its newest 20.

## Colours

The projects' colours come from the cycling hue (`.devlog-swatch--0` to `--3`: `primary-light`, `primary` and two mixes with `primary-dark`). Past four, one hue's shades get too close to tell apart, so `--4` to `--7` (2026-11-05) use the hue turned a third of the way round and two thirds (`--color-accent-1` and `--color-accent-2`, which `applyHue` writes beside the others) and their pale mixes; they cycle with it. After eight they start over. They're given out in the order each project first shows up, with Other always last, so a project keeps its colour as the numbers change. A legend (the per-project list) always names them, so colour alone never identifies a project.
