/*
  UTSAV + SPOTIFY WEB PLAYBACK CONFIG
  ------------------------------------
  Create a Spotify Developer app and put its Client ID below.

  IMPORTANT:
  - Never put a Spotify Client Secret in this file.
  - Add the exact Utsav site URL as a Redirect URI in your Spotify app.
  - Example redirect URI:
      https://utsav-ecru.vercel.app/
  - The Web Playback SDK requires a Spotify Premium account.
*/
window.UTSAV_SPOTIFY = {
  clientId: "PASTE_YOUR_SPOTIFY_CLIENT_ID_HERE",
  redirectUri: window.location.origin + window.location.pathname
};
