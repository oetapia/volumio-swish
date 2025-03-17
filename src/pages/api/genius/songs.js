// pages/api/genius/songs.js
const songCache = {}; // In-memory cache (reset upon server restart)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { q: songId } = req.query;
    const GENIUS_ACCESS_TOKEN = process.env.NEXT_PUBLIC_CLIENT_GENIUS_ACCESS_TOKEN;

    // Check if the song data is already in the cache
    if (songCache[songId]) {
      console.log('Serving from cache');
      return res.status(200).json(songCache[songId]);
    }

    try {
      const response = await fetch(`https://api.genius.com/songs/${encodeURIComponent(songId)}`, {
        headers: {
          Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
        },
      });

      const data = await response.json();

      // Cache the song data
      songCache[songId] = data;

      // Return the data from the Genius API response
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' }); // Handle other HTTP methods
  }
}
