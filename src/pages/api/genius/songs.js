// pages/api/genius/songs.js
export default async function handler(req, res) {
	if (req.method === 'GET') {
	  const { q: songId } = req.query;
	  const GENIUS_ACCESS_TOKEN = process.env.NEXT_PUBLIC_CLIENT_GENIUS_ACCESS_TOKEN;
  
	  try {
		const response = await fetch(`https://api.genius.com/songs/${encodeURIComponent(songId)}`, {
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
	  res.status(405).json({ error: 'Method Not Allowed' }); // Handle other HTTP methods
	}
  }
  