# Utsav — Festival Countdown & Music

Utsav is a crawlable festival countdown site for **Durga Puja, Kali Puja and Mahalaya 2026**. Each festival has its own landing URL, countdown, artwork and music playlist.

## Festival playlists

These playlists are deliberately separate. Selecting a playlist for one festival never changes the playlist assigned to another festival.

- **Durga Puja:** `PLcEXU5KhRttE`
  - https://www.youtube.com/playlist?list=PLcEXU5KhRttE
- **Kali Puja:** `PLHwvw4RcSUnk`
  - https://www.youtube.com/playlist?list=PLHwvw4RcSUnk
- **Mahalaya — Iconic Mahalaya:** `PLZMOb9zpbEKQ`
  - https://www.youtube.com/playlist?list=PLZMOb9zpbEKQ
- **Mahalaya — Mahalaya Collection:** `PLPEyl3dIK7O0`
  - https://www.youtube.com/playlist?list=PLPEyl3dIK7O0

There is **no standalone Diwali countdown or Diwali playlist** in this build. References to Diwali that occur inside the Kali Puja SEO explanation are contextual festival information only.

## Countdown dates

- **Mahalaya:** 10 October 2026
- **Durga Puja countdown start:** 16 October 2026
- **Kali Puja:** 8 November 2026

The countdown is calculated in the browser from the configured ISO timestamp with the `+05:30` India offset.

## Dynamic countdown messages

The message below the countdown changes automatically according to the number of whole days remaining:

| Days remaining | Message behavior |
|---:|---|
| More than 50 | No countdown message is shown. |
| 50 or fewer | “`<Festival>` is getting closer. There’s still a little time — enjoy the playlist and set the mood.” |
| 20 or fewer | “Start getting ready. `<Festival>` is at the doorstep — your preparations can begin.” |
| 10 or fewer | “`<Festival>` is knocking on your door. Start your preparations now.” |
| 2 or fewer | “Just 2 days to go. `<Festival>` is almost here — let the celebration begin.” |
| 1 or fewer | “Tomorrow is the day. One more sleep until `<Festival>`. ✨” |
| 0 | The countdown changes to “See you next year ✨”, shows a celebration message and triggers the arrival animation once per page load. |

The thresholds are evaluated in this order: **1 → 2 → 10 → 20 → 50**. Therefore, for example, the 10-day message is active from 10 days down to more than 2 days, while the 2-day message takes over at 2 days.

## Artwork

Each festival has separate desktop and mobile artwork:

- `/durga-puja.jpg` — desktop
- `/durga-puja-mobile.jpg` — dedicated 9:16-style mobile artwork
- `/kali-puja.jpg` — desktop
- `/kali-puja-mobile.jpg` — dedicated portrait mobile artwork
- `/mahalaya.jpg` — desktop
- `/mahalaya-mobile.jpg` — dedicated portrait mobile artwork

### Mobile background fix

The mobile scene must use **only** `--mobile-bg`. The previous implementation layered the mobile artwork over the desktop artwork:

```css
background-image: var(--mobile-bg), var(--desktop-bg);
```

That could make the artwork appear as a repeated/stacked strip on phones. The current implementation intentionally uses one background image:

```css
.scene {
  background-image: var(--mobile-bg);
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
}
```

Do not add the desktop image as a second mobile background layer.

## Music player

The visible Utsav player uses the official YouTube IFrame Player API. The actual YouTube player is kept as a hidden 1×1 playback surface so the Utsav interface can provide its own compact controls and mood mode.

Available controls:

- Previous
- Play/Pause
- Next
- Shuffle
- Repeat
- Festival-specific playlist selection

### Mahalaya playlist behavior

Only the Mahalaya page exposes the two Mahalaya choices:

1. **Iconic Mahalaya** — `PLZMOb9zpbEKQ`
2. **Mahalaya Collection** — `PLPEyl3dIK7O0`

Durga Puja always uses `PLcEXU5KhRttE`, and Kali Puja always uses `PLHwvw4RcSUnk`.

## Full Playlist song list

The **Full playlist** button opens Utsav's own scrollable song list. The selected festival/playlist is used when requesting the list, so the Mahalaya choices remain distinct.

The frontend calls:

```text
/api/playlist?playlistId=<selected-playlist-id>
```

The serverless function then uses the YouTube Data API v3 to retrieve playlist items, including video ID, title, channel and thumbnails.

### Why “Playlist is not configured” appeared

That message came from the playlist configuration/API path in the deployed build. The current source contains all four allowed playlist IDs in `api/playlist.js` and the frontend derives its validation from the same festival configuration.

If the live deployment still shows the old message after this ZIP is deployed, the deployment is serving an older build or its Vercel environment variable is missing. Redeploy the current source and verify the server-side API key configuration below.

### Vercel configuration

In Vercel → **Settings → Environment Variables**, add:

- **Name:** `YOUTUBE_DATA_API_KEY`
- **Value:** your YouTube Data API v3 key
- **Environment:** Production (and Preview if required)

Then redeploy the project.

The real API key must **not** be committed to GitHub or placed in `youtube-config.js` or frontend JavaScript.

The API function only accepts these four playlist IDs:

```text
PLcEXU5KhRttE   Durga Puja
PLHwvw4RcSUnk   Kali Puja
PLZMOb9zpbEKQ   Iconic Mahalaya
PLPEyl3dIK7O0   Mahalaya Collection
```

If the YouTube Data API cannot be reached, the Full Playlist dialog now explains the server-side requirement and provides a direct link to the selected YouTube playlist as a fallback.

## Mood mode

The **Mood** button hides the normal interface and leaves the countdown visible over the festival artwork. It also attempts to start the selected YouTube playlist through the hidden player. Browser autoplay rules can still require a user interaction.

While Mood mode is active, the button changes to **× Exit**. Pressing it exits Mood mode. Pressing Escape also exits Mood mode on supported devices/keyboards.

## Creator and support controls

The top-right controls provide:

- **About** — identifies Swarnavha Chattopadhyay as a student, developer of Aukiyo and founder of Aukiyo, and explains why Utsav was created.
- **☕ Buy Me a Chai** — displays the UPI QR code and a copyable UPI ID.
- **Aukiyo** — provides the project/Aukiyo context.

The UPI ID displayed by the support dialog is:

```text
swarnavha1@fam
```

## SEO structure

Dedicated crawlable landing pages are retained for:

- `/durga-puja-countdown/`
- `/kali-puja-countdown/`
- `/mahalaya-countdown/`

Each page has unique title/description/keywords, canonical URL, Open Graph metadata, Twitter metadata, JSON-LD structured data, internal festival links and sitemap coverage.

The SEO content is kept in the HTML rather than generated only by JavaScript. It is presented in a compact native disclosure element so it does not dominate the visual countdown experience.

## Important deployment checklist

Before considering a deployment complete:

1. Commit `api/playlist.js`.
2. Commit `script.js`, `style.css` and the three dedicated mobile artwork files.
3. Confirm `YOUTUBE_DATA_API_KEY` exists in Vercel Production environment variables.
4. Redeploy after changing the environment variable.
5. Open each URL directly, not only through client-side navigation.
6. Test all four playlists independently:
   - Durga Puja
   - Kali Puja
   - Iconic Mahalaya
   - Mahalaya Collection
7. On a phone, confirm there is only one continuous mobile artwork and no duplicated artwork strip at the top.
8. Confirm the Full Playlist dialog lists songs for the currently selected playlist.
9. Confirm the canonical URLs and sitemap remain unchanged for the three festival landing pages.

## Files of interest

```text
index.html
script.js
style.css
api/playlist.js
youtube-config.js
README.md
sitemap.xml
vercel.json

durga-puja.jpg
durga-puja-mobile.jpg
kali-puja.jpg
kali-puja-mobile.jpg
mahalaya.jpg
mahalaya-mobile.jpg
buy-me-a-chai-qr.png

durga-puja-countdown/index.html
kali-puja-countdown/index.html
mahalaya-countdown/index.html
```


## V6 — Vercel Web Analytics

V6 adds Vercel Web Analytics to all four static HTML pages:
- `/index.html`
- `/durga-puja-countdown/index.html`
- `/kali-puja-countdown/index.html`
- `/mahalaya-countdown/index.html`

Each page includes the Vercel static HTML analytics bootstrap in `<head>`:

```html
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

Vercel Web Analytics is installed using the static HTML script-tag method; no npm analytics dependency is required.

### Activation
Enable **Web Analytics** for the Utsav project in the Vercel dashboard and deploy V6. The analytics script is intended for the static HTML setup. Vercel's HTML Starter also demonstrates the script-tag approach for HTML sites.

### V6 preserves
- Durga Puja, Kali Puja and Mahalaya as separate festivals
- Separate playlists for each festival
- Two separate Mahalaya playlists
- Mobile and desktop artwork
- SEO pages, sitemap and structured data
- SEO fold behavior and playlist modal fixes
- Mood mode and exit control
- Creator / Buy Me a Chai / copyable UPI section


## V6 deployment fix

This static site uses the Vercel Web Analytics script-tag installation. No source file imports `@vercel/analytics`, so npm package metadata is not required.

`package.json` and `package-lock.json` were removed from this deployment to prevent Vercel from attempting `npm install` for an unused analytics package. The analytics script remains in the `<head>` of all four website pages.


## V6.1 — AMP alternative pages

Added lightweight AMP representations at `/durga-puja-countdown/amp/`, `/kali-puja-countdown/amp/`, and `/mahalaya-countdown/`. Each AMP document points to its regular canonical page, while each regular page advertises its AMP alternative with `rel="amphtml"`. AMP pages use AMP components instead of the main site JavaScript.
