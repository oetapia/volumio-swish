// In-memory cache (this will reset when the server restarts)
const lyricsCache = {};

// Helper function to parse the lyrics into timestamps and text
function parseLyrics(text) {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const parsedLines = [];

  lines.forEach(line => {
    const timestampMatches = line.match(/\[\d+:\d+\.\d+\]/g);
    if (!timestampMatches) return;

    const lastTimestampIndex = line.lastIndexOf(']') + 1;
    const lyricText = line.substring(lastTimestampIndex).trim();

    timestampMatches.forEach(timestamp => {
      const timeStr = timestamp.substring(1, timestamp.length - 1); 
      const [minutes, seconds] = timeStr.split(':');
      const timeMs = (parseInt(minutes) * 60 + parseFloat(seconds)) * 1000;

      parsedLines.push({
        time: timeMs,
        text: lyricText
      });
    });
  });

  return parsedLines.sort((a, b) => a.time - b.time);
}

// Function to fetch lyrics from the external API
async function fetchLyrics(searchQuery) {
  const lrcurl = "https://lrclib.net";
  const url = `${lrcurl}/api/get?${searchQuery}`;
  
  console.log(`Fetching from: ${url}`);
  
  try {
    const response = await fetch(url);
    
    // Better error handling - check status and try to parse response
    if (response.status === 404) {
      return { error: 'TrackNotFound' };
    }
    
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    throw new Error(error.message);
  }
}

// Improved sanitization function - less aggressive
function sanitizeString(inputString) {
  if (!inputString) return '';
  
  // Only remove content in parentheses, keep everything else
  return inputString.replace(/\s*\(.*?\)\s*/g, ' ').trim();
}
// Function to attempt multiple search strategies, checking for syncedLyrics availability
async function searchWithFallbacks(track, artist, album, duration) {
  const attempts = [
    // 1. Try with everything
    {
      query: `track_name=${encodeURIComponent(track)}&artist_name=${encodeURIComponent(artist)}&album_name=${encodeURIComponent(album)}&duration=${duration || ''}`,
      message: 'Found with full search'
    },
    // 2. Try with sanitized track and album
    {
      query: `track_name=${encodeURIComponent(sanitizeString(track))}&artist_name=${encodeURIComponent(artist)}&album_name=${encodeURIComponent(sanitizeString(album))}&duration=${duration || ''}`,
      message: 'Found with sanitized track and album names'
    },
    // 3. Try with just track and artist
    {
      query: `track_name=${encodeURIComponent(track)}&artist_name=${encodeURIComponent(artist)}`,
      message: 'Found with track and artist only'
    },
    // 4. Try with sanitized track and artist
    {
      query: `track_name=${encodeURIComponent(sanitizeString(track))}&artist_name=${encodeURIComponent(artist)}`,
      message: 'Found with sanitized track name and artist'
    }
  ];

  for (const attempt of attempts) {
    console.log(`Trying search: ${attempt.query}`);
    const result = await fetchLyrics(attempt.query);
    console.log('Result from API:', result);

    // Ensure result has a trackName and check if syncedLyrics are available
    if (result && result.trackName) {
      console.log(`Success with: ${attempt.message}`);

      // If syncedLyrics are null, continue to the next attempt
      if (!result.syncedLyrics) {
        console.log('No synced lyrics found, trying next search...');
        continue;
      }

      // If syncedLyrics are found, return the result
      return { ...result, message: attempt.message };
    }

    if (!result || result.error !== 'TrackNotFound') {
      // If we get any other error besides TrackNotFound, stop trying
      console.error('Failed search attempt:', result);
      return result;
    }
  }

  return { error: 'TrackNotFound' };
}


export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { track_name, artist_name, album_name, duration } = req.query;
    
    if (!track_name || !artist_name) {
      return res.status(400).json({ error: 'Track name and artist name are required' });
    }

    // Create a cache key from the original parameters
    const cacheKey = `${track_name}-${artist_name}-${album_name || ''}`;
    
    // Check if the lyrics are cached
    if (lyricsCache[cacheKey]) {
      console.log('Serving from cache for:', cacheKey);
      return res.status(200).json(lyricsCache[cacheKey]);
    }

    try {
      // Try multiple search strategies
      const json = await searchWithFallbacks(track_name, artist_name, album_name, duration);

      if (json && json.trackName) {
        // Process and cache successful result
        const result = { ...json };
        
        if (json.syncedLyrics) {
          result.parsedLyrics = parseLyrics(json.syncedLyrics);
        } else {
          console.error('No synced lyrics found.');
          result.parsedLyrics = []; // Default to an empty array if no lyrics are found
        }
        
        // Cache the result
        lyricsCache[cacheKey] = result;
        return res.status(200).json(result);
      }

      // If all attempts failed
      return res.status(404).json({ error: 'No lyrics found' });

    } catch (error) {
      console.error('Error in lyrics handler:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
