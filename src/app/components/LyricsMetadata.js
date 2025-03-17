import React, { useEffect, useState, useRef } from 'react';

function LyricsMetadata({ setMessage, meta }) {
  const [loading, setLoading] = useState(false);
  const [lyricsParsed, setLyricsParsed] = useState([]);
  const [lyricsMeta, setLyricsMeta] = useState('');
  const [currentLyricId, setCurrentLyricId] = useState(null);
  const [localSeek, setLocalSeek] = useState(null);
  const lrcurl = "https://lrclib.net";
  
  // References for efficient updates
  const seekIntervalRef = useRef(null);
  const lastSocketUpdateRef = useRef(0);
  
  async function searchLyrics(track_data) {
    console.log("starting function", track_data);
    setMessage("Searching in lrclib...");
    setLoading(true);
    
    const searchOptions = `track_name=${track_data.title}&artist_name=${track_data.artist}&album_name=${track_data.album}&duration=${track_data.duration}`;
    const searchOptionsLess = `track_name=${track_data.title}&artist_name=${track_data.artist}`;
    console.log("searching: ", searchOptions);

    const url = `${lrcurl}/api/get?${searchOptions}`;
    const urlLess = `${lrcurl}/api/get?${searchOptionsLess}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      
      const json = await response.json();
      console.log('Response from LRCLib:', json);
      
      if (json.trackName) {
        if (json.syncedLyrics) {
          const parsedLyrics = parseLyrics(json.syncedLyrics);
          setLyricsParsed(parsedLyrics);
          setLyricsMeta(
            <ul className='lyrics'>
              {parsedLyrics.map((line) => (
                <li 
                  key={line.time} 
                  id={`lyric-${line.time}`}
                  className={currentLyricId === line.time ? 'active' : ''}
                >
                  {line.text}
                </li>
              ))}
            </ul>
          );
        } else {
          setLyricsMeta(<div className="plain-lyrics">{json.plainLyrics}</div>);
        }
        
        setMessage('');
      } else {
        setMessage('No results found.');
        // Try the less specific search if the first one fails
        tryLessSpecificSearch(searchOptionsLess);
      }
    } catch (error) {
      console.error('Error searching tracks:', error.message);
      setMessage(`Error: ${error.message}`);
      // Try the less specific search on error
      tryLessSpecificSearch(searchOptionsLess);
    } finally {
      setLoading(false);
    }
  }
  
  // Optional: Try a less specific search if the detailed one fails
  async function tryLessSpecificSearch(searchOptionsLess) {
    try {
      const response = await fetch(`${lrcurl}/api/get?${searchOptionsLess}`);
      
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      
      const json = await response.json();
      
      if (json.trackName) {
        if (json.syncedLyrics) {
          const parsedLyrics = parseLyrics(json.syncedLyrics);
          setLyricsParsed(parsedLyrics);
          setLyricsMeta(
            <ul className='lyrics'>
              {parsedLyrics.map((line) => (
                <li 
                  key={line.time} 
                  id={`lyric-${line.time}`}
                  className={currentLyricId === line.time ? 'active' : ''}
                >
                  {line.text}
                </li>
              ))}
            </ul>
          );
        } else {
          setLyricsMeta(<div className="plain-lyrics">{json.plainLyrics}</div>);
        }
        
        setMessage('Found match with less specific search');
      }
    } catch (error) {
      console.error('Error in less specific search:', error.message);
    }
  }

  function parseLyrics(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const parsedLines = [];
    
    lines.forEach(line => {
      // Match all timestamp patterns in the line
      const timestampMatches = line.match(/\[\d+:\d+\.\d+\]/g);
      if (!timestampMatches) return;
      
      // Extract the text content (everything after the last timestamp)
      const lastTimestampIndex = line.lastIndexOf(']') + 1;
      const lyricText = line.substring(lastTimestampIndex).trim();
      
      // Convert each timestamp to milliseconds and create an entry
      timestampMatches.forEach(timestamp => {
        const timeStr = timestamp.substring(1, timestamp.length - 1); // Remove [ and ]
        const [minutes, seconds] = timeStr.split(':');
        const timeMs = (parseInt(minutes) * 60 + parseFloat(seconds)) * 1000;
        
        parsedLines.push({
          time: timeMs,
          text: lyricText
        });
      });
    });
    
    // Sort by timestamp
    return parsedLines.sort((a, b) => a.time - b.time);
  }

  // Find the current and next lyrics based on time
  function findCurrentLyric(parsedLyrics, currentTimeMs) {
    let currentLyric = null;
    let nextLyric = null;
    
    // Find the current lyric (last one before currentTime)
    for (let i = 0; i < parsedLyrics.length; i++) {
      if (parsedLyrics[i].time <= currentTimeMs) {
        currentLyric = parsedLyrics[i];
      } else {
        nextLyric = parsedLyrics[i];
        break;
      }
    }
    
    if (currentLyric && currentLyric.time) {
      // Set the current lyric ID to trigger a re-render with the new active class
      setCurrentLyricId(currentLyric.time);
      
      return {
        current: currentLyric,
        next: nextLyric,
        progress: nextLyric ? 
          (currentTimeMs - currentLyric.time) / (nextLyric.time - currentLyric.time) : 
          0
      };
    }
    
    return null;
  }

  // Search for lyrics when track metadata changes
  useEffect(() => {
    if (meta.title) {
      searchLyrics(meta);
    }
  }, [meta.title, meta.artist, meta.album, meta.duration]);
  
  // Initialize local seek state from incoming meta data
  useEffect(() => {
    if (meta.seek !== undefined) {
      setLocalSeek(meta.seek);
      lastSocketUpdateRef.current = Date.now();
    }
    
    return () => {
      if (seekIntervalRef.current) {
        clearInterval(seekIntervalRef.current);
      }
    };
  }, [meta.title, meta.artist]); // Reset when song changes

  // Set up interval for local seek updates - only when playing
  useEffect(() => {
    // Clear any existing interval first
    if (seekIntervalRef.current) {
      clearInterval(seekIntervalRef.current);
      seekIntervalRef.current = null;
    }

    // Only start the interval if we're playing
    if (meta.status === "play" && lyricsParsed.length > 0) {
      seekIntervalRef.current = setInterval(() => {
        setLocalSeek(prevSeek => {
          if (prevSeek === null) return meta.seek || 0;
          return prevSeek + 1000; // Add 1 second (1000ms)
        });
      }, 1000);
    }
    
    return () => {
      if (seekIntervalRef.current) {
        clearInterval(seekIntervalRef.current);
      }
    };
  }, [meta.status, lyricsParsed.length]);

  // Use meta.seek for initial sync and periodic updates, but otherwise use localSeek
  useEffect(() => {
    // When we get a new seek value from parent (meta.seek), sync our local seek
    if (meta.seek !== undefined) {
      setLocalSeek(meta.seek);
      lastSocketUpdateRef.current = Date.now();
    }
  }, [meta.seek]);

  // Process lyrics based on our current position (either local or from server)
  useEffect(() => {
    // Use localSeek if available, otherwise fall back to meta.seek
    const currentSeek = localSeek !== null ? localSeek : meta.seek;
    
    if (currentSeek !== undefined && lyricsParsed.length > 0) {
      const currentLyricInfo = findCurrentLyric(lyricsParsed, currentSeek);
      
      if (currentLyricInfo) {
        // If you want to scroll to the current lyric
        const element = document.getElementById(`lyric-${currentLyricInfo.current.time}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [localSeek, lyricsParsed]);

  // Re-render the lyrics list when currentLyricId changes
  useEffect(() => {
    if (lyricsParsed.length > 0) {
      setLyricsMeta(
        <ul className='lyrics'>
          {lyricsParsed.map((line) => (
            <li 
              key={line.time} 
              id={`lyric-${line.time}`}
              className={currentLyricId === line.time ? 'active' : ''}
            >
              {line.text}
            </li>
          ))}
        </ul>
      );
    }
  }, [currentLyricId, lyricsParsed]);

  return (
    <div className='scroll-list'>
      <div>
        {loading && <div>Loading...</div>}
        
        {lyricsMeta}
      </div>
    </div>
  );
}

export default LyricsMetadata;