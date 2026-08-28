# Utsav — Spotify Web Playback Edition

This version replaces the Spotify preview-style embed with Spotify's official **Web Playback SDK** architecture.

## What it does

- Full-song playback through Spotify's authorized Web Playback SDK.
- Real-time "Now Playing" title, artist, artwork, duration and progress.
- Play / pause / next / previous controls.
- Shuffle and repeat controls.
- Festival playlist browser.
- The three Utsav festival tabs:
  - Durga Puja — playlist `0z11u9nIBzaddobcW4ujFO`
  - Kali Puja — playlist `0sBXfKzF43guyOY9FXRofi`
  - Diwali — playlist `0bp35vrrt5SIWqf2NW7Ue4`
- Existing glassmorphism design and compact mobile layout.
- Images are copied to both the project root and `assets/` so the site can work with either GitHub layout.

## Important Spotify requirements

Spotify's Web Playback SDK requires a **Spotify Premium** account for playback. It also requires a Spotify Developer app and OAuth authorization. Spotify's current Development Mode is intended for personal/non-commercial projects and has limits on authorized users. See Spotify's current documentation before deploying publicly.

Spotify's SDK documentation:
https://developer.spotify.com/documentation/web-playback-sdk

## One-time setup

1. Create a Spotify Developer app.
2. Copy its **Client ID**.
3. Open `spotify-config.js`.
4. Replace:

   `PASTE_YOUR_SPOTIFY_CLIENT_ID_HERE`

   with your Client ID.
5. In the Spotify Developer app settings, add the exact Utsav URL as a Redirect URI.

For your current deployment, that is:

`https://utsav-ecru.vercel.app/`

The redirect URI must match exactly.

**Never put the Spotify Client Secret in this static project.** This implementation uses OAuth Authorization Code with PKCE, which is designed for browser apps where a client secret cannot be safely stored.

## Vercel

Because this is a static frontend, it can remain on your existing Vercel project. After adding the Client ID and committing the files to the connected GitHub repository, Vercel can deploy the update.

## Important policy limitation

Spotify's current developer documentation states that streaming applications may not be commercial without the required Spotify approval. If Utsav is going to be used commercially, obtain the appropriate permission before using Spotify Web Playback.
