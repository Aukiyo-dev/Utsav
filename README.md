# Utsav — YouTube Music Playlist Edition

This build uses the official YouTube IFrame Player API with the supplied YouTube Music playlist IDs.

Playlists:
- Durga Puja: `PLcEXU5KhRttE`
- Kali Puja: `PLHwvw4RcSUnk`
- Diwali: `PLVJ3mfjGvnXU`

Features:
- Real-time festival countdown
- Three glassmorphism festival tabs
- Festival background switching
- Embedded YouTube playlist player
- Previous / Play / Next
- Shuffle
- Repeat/loop
- Current video title display
- Full playlist modal
- Compact edge-to-edge mobile music section
- No Spotify Client ID or Premium authentication required

Important:
YouTube controls what can be played inside an embedded player. Some videos can have embedding disabled, and browser autoplay policies can require a tap before playback. The site does not bypass those restrictions.


### Full Playlist modal
The Full Playlist button now opens a larger official YouTube playlist player and also provides a direct **Open full playlist on YouTube** fallback. YouTube controls the playlist UI exposed inside the embedded player; the website does not scrape or recreate YouTube's private playlist data.


## Named full playlist list

The Full Playlist modal now shows every video's:
- number
- thumbnail
- title
- channel
- click-to-play control

To retrieve those names and thumbnails, this version uses the public YouTube Data API v3. Add a browser-restricted API key to `youtube-config.js`. Do not put a Google account password or any private credential there.

The YouTube player itself does not expose the complete playlist's item metadata to ordinary page JavaScript, so the Data API is required for a reliable in-site song list.


## Protected YouTube Data API key

The YouTube Data API key is **not stored in the browser code**.

The frontend requests `/api/playlist`, and the Vercel serverless function reads `YOUTUBE_DATA_API_KEY` from Vercel's Environment Variables. The function only accepts the three configured Utsav playlist IDs.

### Vercel setup

In Vercel:
1. Open the Utsav project.
2. Go to **Settings → Environment Variables**.
3. Add:
   - Name: `YOUTUBE_DATA_API_KEY`
   - Value: your YouTube Data API key
   - Environments: Production (and Preview if you want it)
4. Save and redeploy.

Do not put the real key in `youtube-config.js`, `script.js`, HTML, or GitHub.

Because the API key was pasted into a chat, rotate/restrict that key in Google Cloud before putting the replacement into Vercel. Restrict the key to the YouTube Data API v3.
