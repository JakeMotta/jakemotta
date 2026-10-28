# Psycho

Jake's final project for SJSU's CS 108 (game design), dated 2017-05-03 in its README: a browser game about nerve. A black square sits on a 640×640 canvas, and the player has three minutes to click it as many times as possible. Each click must come within 10 seconds of the last, but a click before a hidden "safe" countdown runs out (somewhere between 1 and 7 seconds; the first one is 7) ends the game. Anyone can play it safe by waiting, so the leaderboard is what makes it a game: it shows the top 15 names. It has a looping song, sounds for a good click, a name and a game over, and a Toggle Mute in the corner. The folder is `public/projects/psycho/`; the card id is `psycho`.

Jake sent it on 2026-10-28 as a folder (`Downloads\Psycho`, the files last saved on 2017-05-10 and 11) and asked for its leaderboard to work again. It runs on the game's own 2017 Firebase project, switched back on that day. It replaced Survivor, the same class's other game, on the project list that day ([survivor.md](survivor.md)).

## How it runs

- **`index.html`** and the rest of the folder are the 2017 game, unchanged: the page, `mainCSS.css`, `cssReset.css`, jQuery 3.2.1, the loading GIF, the six MP3s and the README. It loads Bootstrap's script and four Firebase libraries from CDNs, and its leaderboard no longer works there (see The leaderboard).
- **`play.html`** is what the card frames: `index.html` with four changes, each marked in the file. The game's own script, the second `<script>`, is copied unchanged (a check that the 638 lines appear verbatim passed when it was made).
  - **The leaderboard** is a new script on the same 2017 database, replacing the 2017 script and its libraries (Bootstrap, the two jQuerys and Firebase 2.x and 3.x). The original's name rules, `getPlayerName()` and `checkNameRules()`, are kept as they were, profanity list included.
  - **Half volume**, like every game on the site, done without touching the game: the page halves every volume the game sets.
  - **The site's music pauses** whenever one of the game's sounds starts (the `jakemotta:media-playing` message).
  - **Clicks after a resize:** the game reads the canvas's place on the page once, at load, so after the frame changed size a click missed the square. The new script reads it again on each resize.
- **Phones:** left as it was. The 640-pixel canvas and the side-by-side instructions don't fit a phone screen, and clicks are mouse clicks.

## The leaderboard

**It's the 2017 database, switched back on.** The game was built on Firebase project `psycho-c05a2` (display name "psycho", on Jake's Google account, Spark plan, us-central1). By 2026 its Realtime Database answered "The Firebase database 'psycho-c05a2' has been deactivated". On 2026-10-28, as Jake asked, it was enabled again from the console's Realtime Database page, and its 35 rows from 2017 came back (Jake's 15 on top). The 2017 rules were `".read": "true", ".write": "true"`, so anyone could have rewritten or wiped the whole database; they were replaced with the rules below straight after. The 2017 page's 2.x JavaScript library is retired, which is why `play.html` has a new script.

**How the new script works:**
- **The top 15**, read live: it updates as anyone scores.
  - **How:** it reads the 200 highest rows (`orderByChild('playerScore').limitToLast(200)`) and shows each name once, with its best score.
  - **Why once per name:** the 2017 bugs below left the same name many times over (`hii` 5 is in there 20-odd times), which filled the board with one player. Nothing was deleted from the database.
- **Writes:** entering a name only checks it now. The visit's row, `{ playerName, playerScore }` under `psychoPlayers`, is written with the player's first score, then raised with each new high score.
  - The 2017 version wrote a row with a score of 0 as soon as a name went in, so the board filled with zeros.
  - It also set the score on the most recently added row, which was someone else's whenever another player had joined since.
- **Names are shown as text,** never as HTML. The 2017 version wrote them into the table as HTML. Its name rules only run in the browser, so a name written straight to the database could have run script in the frame, and the frame is on the site's own origin.
- **The config** is the 2017 project's web config, copied from `index.html`. It isn't a secret: every visitor's browser gets it. With `FIREBASE_CONFIG` set to `null`, or the database unreachable, the board says "Offline for now" and the game plays as normal.

**The rules** are `demos/psycho/database.rules.json`, published in the console's Rules tab on 2026-10-28 (with `firebase.json` beside it, should they ever go out through the Firebase CLI instead):
- anyone can read `psychoPlayers`, and nothing else in the database;
- a row must be a `playerName` of 3 to 15 letters, digits and spaces, and a whole-ish `playerScore` from 0 to 200, and nothing else;
- a row can be created, and afterwards only its score raised, under the same name.

These keep out junk, rude edits to others' names and scores no game could reach (180 seconds gives at most about 180 clicks). They can't stop someone from writing a believable fake score through the database's API, since the game has no sign-in. That was true in 2017 as well; fine for a class game's leaderboard.

**Checked on 2026-10-28:**
- **Refused,** through the database's REST API: reading the root, writing anywhere outside `psychoPlayers`, a name with HTML in it, and a score of 9999. All four were refused with "Permission denied".
- **Allowed:** a new row of `{ "playerName": "Test Player", "playerScore": 3 }`, in the console's Rules playground. It simulates the write without making it, so no test row is on the board.
- **On the page:** `play.html` shows the live board, Jake: 15 first.

**Changing the rules:** edit `database.rules.json`, then paste it into the console's Rules tab and Publish (or `firebase deploy --only database --project psycho-c05a2` from `demos/psycho/`). Rules can't be tested by writing to the live database without leaving a row on the board, and the rules let nobody delete one. A stray row comes out in the console's Data tab.

**Watch for:** Firebase deactivates a Spark Realtime Database that goes unused for a long time, which is what had happened by 2026. If the board says "Offline for now" and the database answers "has been deactivated", enable it again on the console's Realtime Database page; the data comes back with it.

## Card image

`public/images/projects/psycho.webp` is just the game: the start screen with the red "Psycho!" title over the square, once a name is in (its `SHOTS` entry types "Jake" and submits). It's the 4:3 middle of the square canvas, a little low, so the title, the square and "Click the square to start!" all fit.

## Left out on purpose

- **A download:** it's a web page, and it runs here.
- **The old database's scores:** see The leaderboard.
