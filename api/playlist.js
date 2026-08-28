const ALLOWED_PLAYLISTS = new Set([
  "PLcEXU5KhRttE", // Durga Puja
  "PLHwvw4RcSUnk", // Kali Puja
  "PLVJ3mfjGvnXU"  // Diwali
]);

export default async function handler(req, res) {
  try {
    const playlistId = String(req.query.playlistId || "");

    if (!ALLOWED_PLAYLISTS.has(playlistId)) {
      return res.status(400).json({ error: "Playlist is not configured." });
    }

    const apiKey = process.env.YOUTUBE_DATA_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "YouTube API is not configured on the server."
      });
    }

    const items = [];
    let pageToken = "";

    do {
      const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
      url.searchParams.set("part", "snippet,contentDetails");
      url.searchParams.set("maxResults", "50");
      url.searchParams.set("playlistId", playlistId);
      url.searchParams.set("key", apiKey);
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        console.error("YouTube API error:", data);
        return res.status(502).json({
          error: "YouTube playlist service is temporarily unavailable."
        });
      }

      for (const item of data.items || []) {
        const videoId =
          item.contentDetails?.videoId ||
          item.snippet?.resourceId?.videoId;

        if (!videoId) continue;

        items.push({
          videoId,
          title: item.snippet?.title || "Untitled",
          channel: item.snippet?.videoOwnerChannelTitle || "YouTube",
          thumbnails: item.snippet?.thumbnails || {}
        });
      }

      pageToken = data.nextPageToken || "";
    } while (pageToken);

    // Cache playlist metadata briefly at Vercel's edge.
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Unable to load the playlist."
    });
  }
        }
