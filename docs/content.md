# The site's copy: `src/content.json`

The names, years and descriptions of Jake's songs and projects live in one file, `src/content.json`, so he can change the copy without reading code (he asked for it on 2026-10-29). The site reads it at build time: `common/constants.ts` imports it, and everything else goes on reading `musicList` and `homeProjectList` from there as before.

## What's in it

```json
{
    "music": [
        { "title": "Uprising", "date": "2021", "description": "…", "image": "/images/music/ctrl_alt_del.jpeg", "url": "/music/uprising.mp3" }
    ],
    "projects": [
        { "id": "tapslaydie", "title": "TapSlayDie", "date": "2026", "description": "…" }
    ]
}
```

- **`music`** is Jake's own songs, whole: name, year, description, cover and file, in the library's order (newest first). A song is added, removed, renamed or moved here and nowhere else. An empty `description` shows none, and an empty `image` gives a monogram tile in the hue.
- **`projects`** is every project's name, year and description, **in the order the site shows them**: the first is the board's featured tile ("Newest"), and the board's Projects tile, each section of the all-projects overlay and the viewer's Back and Forward all keep this order. So the list is newest first, apart from anything placed by hand (Black Chamber Redesign right after Dan James, 2026-10-29). The `id` ties an entry to the rest of the project in `projectDetails` in `constants.ts`: its card image, section, tags, preview, hub pages and download. Renaming, redating, rewording or reordering a project is an edit here only; adding one takes both files ([projects/README.md](projects/README.md#adding-a-project)), and the site stops with an error naming the id if a project here has no details there. Removing one is taking it out of both.

The rules for the words themselves are in `CLAUDE.md`: in Jake's voice, one plain sentence for a project, and an empty field rather than filler.

## What reads it

- `common/constants.ts`: `musicList` is `content.music`; `homeProjectList` is `content.projects`, each with its `projectDetails` added.
- `scripts/write-sitemap.mjs` takes the project ids from it for `build/sitemap.xml`.
- `tsconfig.json` has `resolveJsonModule` on for the import.

Songs from YouTube (`youtubeSongs` in `constants.ts`) and the project categories, social links and modpack releases aren't in it.
