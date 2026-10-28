# Psycho

Jake's final project for SJSU's CS 108 (game design), dated 2017-05-03 in its README: a browser game about nerve. A black square sits on a 640×640 canvas, and the player has three minutes to click it as many times as possible. Each click must come within 10 seconds of the last, but a click before a hidden "safe" countdown runs out (somewhere between 1 and 7 seconds; the first one is 7) ends the game. Anyone can play it safe by waiting, so the leaderboard is what makes it a game: it shows the top 15 names. It has a looping song, sounds for a good click, a name and a game over, and a Toggle Mute in the corner. The folder is `public/projects/psycho/`; the card id is `psycho`.

Jake sent it on 2026-10-28 as a folder (`Downloads\Psycho`, the files last saved on 2017-05-10 and 11) and asked for a new Firebase database to run its leaderboard again. It replaced Survivor, the same class's other game, on the project list that day ([survivor.md](survivor.md)).

## How it runs

- **`index.html`** and the rest of the folder are the 2017 game, unchanged: the page, `mainCSS.css`, `cssReset.css`, jQuery 3.2.1, the loading GIF, the six MP3s and the README. It loads Bootstrap's script and four Firebase libraries from CDNs, and its leaderboard no longer works there (see The leaderboard).
- **`play.html`** is what the card frames: `index.html` with four changes, each marked in the file. The game's own script, the second `<script>`, is copied unchanged (a check that the 638 lines appear verbatim passed when it was made).
  - **The leaderboard** is a new script on the new database, replacing the 2017 one and its libraries (Bootstrap, the two jQuerys and Firebase 2.x and 3.x). The original's name rules, `getPlayerName()` and `checkNameRules()`, are kept as they were, profanity list included.
  - **Half volume**, like every game on the site, done without touching the game: the page halves every volume the game sets.
  - **The site's music pauses** whenever one of the game's sounds starts (the `jakemotta:media-playing` message).
  - **Clicks after a resize:** the game reads the canvas's place on the page once, at load, so after the frame changed size a click missed the square. The new script reads it again on each resize.
- **Phones:** left as it was. The 640-pixel canvas and the side-by-side instructions don't fit a phone screen, and clicks are mouse clicks.

## The leaderboard

**The 2017 database is gone.** The game was built on Firebase project `psycho-c05a2`, whose Realtime Database now answers "The Firebase database 'psycho-c05a2' has been deactivated" (checked on 2026-10-28). Its 2.x JavaScript library is retired too. If Jake can still see `psycho-c05a2` in the Firebase console, reactivating it might bring the 2017 scores back; nobody has tried.

**How the new script works:**
- **The top 15**, read live (`orderByChild('playerScore').limitToLast(15)`): it updates as anyone scores.
- **Writes:** entering a name only checks it now. The visit's row, `{ playerName, playerScore }` under `psychoPlayers`, is written with the player's first score, then raised with each new high score.
  - The 2017 version wrote a row with a score of 0 as soon as a name went in, so the board filled with zeros.
  - It also set the score on the most recently added row, which was someone else's whenever another player had joined since.
- **Names are shown as text,** never as HTML. The 2017 version wrote them into the table as HTML. Its name rules only run in the browser, so a name written straight to the database could have run script in the frame, and the frame is on the site's own origin.
- **No database yet:** with `FIREBASE_CONFIG` still `null`, the board says "Offline for now" and the game plays as normal.

**The rules** are `demos/psycho/database.rules.json` (with `firebase.json` beside it, for the Firebase CLI):
- anyone can read `psychoPlayers`, and nothing else in the database;
- a row must be a `playerName` of 3 to 15 letters, digits and spaces, and a whole-ish `playerScore` from 0 to 200, and nothing else;
- a row can be created, and afterwards only its score raised, under the same name.

These keep out junk, rude edits to others' names and scores no game could reach (180 seconds gives at most about 180 clicks). They can't stop someone from writing a believable fake score through the database's API, since the game has no sign-in. That was true in 2017 as well; fine for a class game's leaderboard.

**Setting it up** (not done yet; needs Jake's Google account):
1. **Sign in:** `npx firebase-tools login`, in a terminal, as Jake.
2. **Create the project:** `npx firebase-tools projects:create <id> --display-name Psycho`.
3. **Create the database:** `npx firebase-tools database:instances:create <id>-default-rtdb --project <id> --location us-central1`.
4. **Register the web app:** `npx firebase-tools apps:create web Psycho --project <id>`.
5. **Deploy the rules:** from `demos/psycho/`, `npx firebase-tools deploy --only database --project <id>`.
6. **Point the page at it:** paste `npx firebase-tools apps:sdkconfig web --project <id>`'s config into `FIREBASE_CONFIG` in `play.html`, with its `databaseURL`. The config isn't a secret: every visitor's browser gets it.

The Spark plan (free) covers it: one database, 1 GB stored and 10 GB a month downloaded.

## Card image

`public/images/projects/psycho.webp` is just the game: the start screen with the red "Psycho!" title over the square, once a name is in (its `SHOTS` entry types "Jake" and submits). It's the 4:3 middle of the square canvas, a little low, so the title, the square and "Click the square to start!" all fit.

## Left out on purpose

- **A download:** it's a web page, and it runs here.
- **The old database's scores:** see The leaderboard.
