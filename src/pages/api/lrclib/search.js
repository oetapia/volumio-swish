import fetch from 'node-fetch';

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
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Helper function to sanitize the album and track names (remove content inside parentheses)
function sanitizeString(inputString) {
  return inputString.replace(/\s*\(.*?\)\s*/g, ''); // This removes everything in parentheses
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { track_name, artist_name, album_name, duration } = req.query;

    // Sanitize both the track and album names
    const sanitizedTrackName = sanitizeString(track_name);
    const sanitizedAlbumName = sanitizeString(album_name);

    // Create the search query
    const searchOptions = `track_name=${sanitizedTrackName}&artist_name=${artist_name}&album_name=${sanitizedAlbumName}&duration=${duration}`;
    const searchOptionsLess = `track_name=${sanitizedTrackName}&artist_name=${artist_name}`;

    // Check if the lyrics are cached
    const cacheKey = `${sanitizedTrackName}-${artist_name}-${sanitizedAlbumName}`;
    if (lyricsCache[cacheKey]) {
      console.log('Serving from cache');
      return res.status(200).json(lyricsCache[cacheKey]);
    }

    try {
      // First try to search with the more specific options
      let json = await fetchLyrics(searchOptions);

      if (json.trackName) {
        if (json.syncedLyrics) {
          json.parsedLyrics = parseLyrics(json.syncedLyrics);
        }
        // Cache the result before returning it
        lyricsCache[cacheKey] = json;
        return res.status(200).json(json);
      }

      // If no match found, and the response is a 404, try the less specific search (without album and duration)
      if (json.error && json.error === 'TrackNotFound') {
        console.log('Track not found with full query, trying a less specific search');
        json = await fetchLyrics(searchOptionsLess);
        if (json.trackName) {
          if (json.syncedLyrics) {
            json.parsedLyrics = parseLyrics(json.syncedLyrics);
          }
          // Cache the result before returning it
          lyricsCache[cacheKey] = { ...json, message: 'Found match with less specific search' };
          return res.status(200).json({ ...json, message: 'Found match with less specific search' });
        }
      }

      // If no match is found after both attempts, return a 404
      return res.status(404).json({ error: 'No lyrics found' });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
