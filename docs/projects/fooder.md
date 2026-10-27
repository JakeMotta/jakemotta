# Fooder

A team Android app from SJSU CS 161, spring 2017 (proposal 23 February, final presentation 16 May): "Tinder, but it's food". It finds restaurants near you and deals them as swipe cards: left to pass, right to save to your bucket list, the pin to open the place in Google Maps. The team, QWERTY, was four students: Alex, Brendan, Jason and Jake. The folder is `public/projects/fooder/`; the card id is `fooder`.

## What the app did

Java in Android Studio, `com.example.jason.fooder1`, minSdk 16.
- **Sign-in:** `LoginPage` signs in with Google through Firebase Authentication.
- **Settings:** `Settings` sets a distance (0–20 miles), a star rating and price levels ($ to $$$$).
- **Swiping:** `MainActivity` asks Yelp's Fusion v3 search (Retrofit and OkHttp, `YelpV3APIProvider`) for restaurants around the phone's last known location, or San José State's campus when there isn't one. It deals them as `TinderCard`s with PlaceHolderView's swipe view and Glide for the photos.
- **Bucket list:** ♥ appends the name to the user's favorites in Firebase Realtime Database, and `BucketList` lists them.
- **Map:** the pin opens the address in Google Maps.

The first demo (March 2017) dealt cards from a short list in `assets/profiles.json`, before the Yelp search was hooked up.

## Jake's part

The OCD, SSAD and prototype report list him as co-lead programmer and graphics designer. The page credits him with three things:
- **The logo and app icon:** the second demo's slides list "App Logo and Icon" as new, and the logo is also among his own portfolio images (`Z:\Old Projects\files\images\Fooder.png`).
- **The concept art:** inferred from his designer role and the prototype report's version 1.0 entry, which is his ("JM"). Check with Jake if the credit matters.
- **The sign-in page:** `LoginPage.java` is marked "Modified by Jake 4/24/2017", and the second demo added Google sign-in.

## Preview

An Android app can't run in a browser, so `index.html` is a hand-written case study, and says so at the top.
- **Screens:** the screenshot of the first working build and the three concept screens. Each is a plain link to its file, and clicking one opens it full size in a `<dialog>`, as on the Sketchbook page.
- **Text:** the idea, how it worked, Jake's part, what it was built with, and the features that were planned but cut (from the proposal and slides).
- **Display tweaks:**
  - The concept art is drawn on white. It's shown with `mix-blend-mode: multiply` so the white takes the page's cream.
  - The real screenshot has no phone around it, so the page draws a CSS bezel the same height as the concept phones.
- **Sound:** there's none, so nothing pauses the site's music.

Which original became which:

| Copy | Original |
| --- | --- |
| `logo.png` | `app/src/main/res/drawable/my_logo.png` in `Fooder.zip` |
| `icon.png` | `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` in `Fooder.zip` (192 px) |
| `screens/concept-how-about.png` | `word/media/image5.png` in `Prototype Report.docx` (also in `Fooder.pptx`) |
| `screens/concept-settings.png` | `word/media/image3.png` in `Prototype Report.docx` |
| `screens/concept-bucket-list.png` | `word/media/image6.png` in `Prototype Report.docx` |
| `screens/first-demo.jpg` | The 1080×1920 screenshot on the "First Demo" slide of `161 Presentation 2.pdf`, decoded from the PDF and saved as JPEG (quality 85, full size) |

`Fooder.zip` is `Z:\Google Drive\Stuff\Fooder.zip`, a download of the team's `CS161` repository as of 18 May 2017. The documents and slides are in `Z:\Google Drive\School\College\CS 161\`. The copies in `C:\Users\Jake\Dropbox\` weren't needed.

## Left out on purpose

- **All the source code.** `MainActivity.java` and `Utils.java` hardcode the team's Yelp client ID and secret, and the March build snapshot (`app.zip`) holds `google-services.json` with the Firebase project's API key. Nothing from either was copied; the page describes the code instead.
- **The reports and slide decks** (OCD, SSAD, prototype report, test plan, four presentations). They name the classmates in full and the professor; the page uses first names.
- **The planning diagrams** (system context, use cases, class diagrams, benefits chain). They're templates from the course, and the page explains the app in words.
- **The team photo and the GitHub contributors slide**, which shows the team's usernames.
- **`app.zip`'s build output and APK slices.** An APK can't run here.
- **`Fooder(1).pptx`'s copies of the concept art.** They're the same pictures, less compressed (465–650 KB each).
- **`ic_launcher-web.png`.** It's the same icon at 512 px, upscaled and blurry.

## Card image

`public/images/projects/fooder.webp`, the top of the page: the logo and the four phones.
