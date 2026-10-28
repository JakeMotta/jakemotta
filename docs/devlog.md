# The dev log

`/devlog` (`src/components/pages/devlog`) is an overlay on the board, opened from the Hero's **Dev log** chip. Jake asked for it on 2026-10-27, to post updates on what he's working on and to show how much he works with Claude. It's laid out as a board of its own, like the modpack page:

| Tile | What it shows | Where it comes from |
| --- | --- | --- |
| **Updates** (left, both rows on a desktop) | Jake's posts, newest first | Markdown files in `src/devlog/posts/` |
| **Me & Claude** | Hours, tokens and sessions; a chart since the first session (hours or tokens, stacked by project, with a hover/focus tooltip), a bar per day, week (Monday on) or month, which Jake asked for on 2026-10-28; each project's totals; when it was last updated | `src/devlog/stats.json` |
| **Latest commits** | The newest commits of the public repositories, linked to GitHub | `src/devlog/stats.json` |

On tablets and phones the tiles stack and the overlay scrolls.

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

`scripts/devlog-stats.mjs` runs on Jake's machine, by hand, and rewrites `src/devlog/stats.json`. Commit that file and push to publish. CI can't run the script, because it reads two things only this machine has:

- **Claude Code's transcripts** in `~/.claude/projects/`, subagent and workflow transcripts included. For each reply it takes the model, the token counts (input, output, cache writes, cache reads) and the timestamp, counting each reply once by its message id, since a reply is written once per content block. It tells sessions apart by their ids, and the project by the session's working folder: the folder under `Documents\Github\`, so a worktree counts toward its repository.
- **The sibling repositories** (`../<folder>`), for `git log`.

How it counts:

- **Hours:** each project's messages in time order. A gap of 15 minutes or less (`IDLE_MINUTES`) counts as working time, and a longer one ends the stretch. The headline hours put every project's messages on one timeline, so two sessions running at once count once. That's why it can be a little less than the per-project hours added up.
- **Tokens:** everything sent to and from the model, cache reads included. Cache reads are most of it ("Claude rereading my code"), so the tile also says how many tokens Claude wrote itself (output).
- **Days:** the machine's local time zone.

## What is and isn't published

- **Only totals leave the transcripts.** Nothing typed, no file contents, no session titles.
- **Folder names:** a session in a folder that isn't in the script's `PROJECTS` counts as **Other**, so a folder's name is never published unless it's listed there. To give a new project its own name and colour, add it to `PROJECTS`.
- **Commits:** subjects are published only for repositories with `commits: true`, which is on only for public ones. As of 2026-10-27 that's just `jakemotta`; TapSlayDie, asteroids and farming-game are private, so they show up in the hours but not in the commits. Long subjects (TapSlayDie writes whole paragraphs) are cut to their first sentence, at most 140 characters. Each repository gives its newest 20.

## Colours

The projects' colours come from the cycling hue (`.devlog-swatch--0` to `--3`: `primary-light`, `primary` and two mixes with `primary-dark`). They're given out in the order each project first shows up, with Other always last, so a project keeps its colour as the numbers change. A legend (the per-project list) always names them, so colour alone never identifies a project.
