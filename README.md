# Utsav Festival Countdown

Three-tab festival countdown website with a glassmorphism interface and supplied festival artwork.

## Festival order

1. Durga Puja — `assets/durga-puja.jpg`
2. Kali Puja — `assets/kali-puja.jpg`
3. Diwali — `assets/diwali.jpg`

The three images were supplied in that order and are used as the full-page background when the corresponding tab is selected.

## Real-time dates

- Durga Puja first main day / Shashthi: 16 October 2026
- Kali Puja: 8 November 2026
- Diwali: 8 November 2026

Countdown timestamps use India Standard Time (`+05:30`) and refresh every second.

## Spotify

The supplied playlists are already connected:

- Durga Puja: `1zVKSwcN1UDYBXsBWQlp16`
- Kali Puja: `5AcGh4bu9Os1VAySz77de4`
- Diwali: `33GvF5IHA1WAZsF8KANGiG`

The small player is embedded in the website. **Full playlist** opens a glassmorphism overlay where visitors can browse the complete playlist without navigating the main site away.

Spotify controls its own playback/account limitations.

## Vercel

This is a static site. Deploy the folder/repository as-is. No build command or server is required.


## Latest playlist IDs

- Durga Puja: `0z11u9nIBzaddobcW4ujFO`
- Kali Puja: `0sBXfKzF43guyOY9FXRofi`
- Diwali: `0bp35vrrt5SIWqf2NW7Ue4`

## SEO

The site now includes:
- descriptive title and meta description
- Open Graph / Twitter metadata
- canonical URL for `https://utsav-ecru.vercel.app/`
- `robots.txt`
- `sitemap.xml`
- a Web App Manifest
- concise visible semantic copy describing Utsav and the three festivals

SEO can improve discoverability, but no code can guarantee a #1 Google ranking for “Utsav” or “Utsav countdown”; rankings depend on indexing, competition, authority, relevance, links and Google's systems.


## GitHub image setup

The background images are now referenced from the repository root, not an `assets/` folder.

Keep these four files together in the root:
- `index.html`
- `style.css`
- `script.js`
- `durga-puja.jpg`
- `kali-puja.jpg`
- `diwali.jpg`


Mobile layout was tightened to reduce the hero, countdown, tabs and Spotify player height on small screens while leaving desktop sizing intact.


## Spotify Embed update

This version uses Spotify's official iframe Embed pattern:

`https://open.spotify.com/embed/playlist/<PLAYLIST_ID>?utm_source=generator&theme=0`

The supplied playlist ID `0jg7iCdiBFijHM7qo7ZeF2` is stored as `FEATURED_PLAYLIST_ID` in `script.js` for reference. The three festival tabs continue to use their own supplied playlist IDs.

The iframe includes `allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"`.

**Important:** Spotify Embed is not the same as the Web Playback SDK. An embed cannot be modified to guarantee unrestricted full-song playback; playback behavior is controlled by Spotify and the listener's account/browser. The official Web Playback SDK is the appropriate route for an authenticated full-song player and requires Spotify Premium.
