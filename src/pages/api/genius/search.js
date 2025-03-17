// src/pages/api/genius/search.js

// In-memory cache (this will reset when the server restarts)
const resultCache = {};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { q: searchTerm } = req.query;
    const GENIUS_ACCESS_TOKEN = process.env.NEXT_PUBLIC_CLIENT_GENIUS_ACCESS_TOKEN;


    // Check if the song data is already in the cache
    if (resultCache[searchTerm]) {
      console.log('Serving from cache');
      return res.status(200).json(resultCache[searchTerm]);
    }

    try {
      const response = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(searchTerm)}`, {
        headers: {
          Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
        },
      });

      const data = await response.json();
      res.status(200).json(data);  // Forward the response to your frontend
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
