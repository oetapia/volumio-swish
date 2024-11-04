"use client"

import React, { useState, useEffect } from 'react';
import AlbumArt from './AlbumArt';
import WebSockets from './WebSockets';
import Image from "next/image";

function PlayingNow({ request, refresh, setRefresh, token, type }) {
  const [response, setResponse] = useState(null);
  const [openPanel, setOpenPanel] = useState(true);
  const [socketCommand, setSocketCommand] = useState(null);

  // Function to handle different player controls using WebSocket commands
  function volumioSocketCmd(command, value = null) {
    switch(command) {
      case "play":
      case "pause":
      case "unmute":
      case "mute":
      case "stop":
      case "prev":
      case "next":
        setSocketCommand(command);
        break;
      case "seek":
        if (value !== null) setSocketCommand(`seek ${value}`);
        break;
      case "random":
        setSocketCommand({ command: "setRandom", value: { value } });
        break;
      case "repeat":
        setSocketCommand({ command: "setRepeat", value: { value } });
        break;
      case "volume":
        setSocketCommand({ command: "volume", value: value  });
        break;
      default:
        console.error("Unknown command");
    }
  }

  useEffect(() => {
    setSocketCommand(`getState`);
  }, [])
  

  return (
    <div className={`panel player-panel ${openPanel ? "open-panel" : "closed-panel"}`}>
      <div className="panel-control">
        <WebSockets 
          url="http://volumio.local" 
          socketCommand={socketCommand} 
          setStatus={setResponse}
        />

        <button 
          className="button-open"
          onClick={() => setOpenPanel(!openPanel)}
        >
          {openPanel ? (
            <Image src="/icons/icon-album.svg" alt="Toggle" className="toggle-panel" width={18} height={18} />
          ) : (
            <Image src="/icons/icon-album.svg" alt="Toggle" className="toggle-panel" width={24} height={24} />
          )}
        </button>
      </div>

      <div className="contained">
        {response && (
          <>
            <AlbumArt meta={response} refresh={refresh} setRefresh={setRefresh} token={token} variant="single" />
            <div className="volume-buttons">
            {response.mute?
            <button onClick={() => volumioSocketCmd("unmute")}>
                <Image src="/icons/icon-unmute.svg" alt="Unmute" className="action" width={16} height={16} />
              </button>:
            <button onClick={() => volumioSocketCmd("mute")}>
                <Image src="/icons/icon-mute.svg" alt="Mute" className="action" width={16} height={16} />
              </button>}
              <button onClick={() => volumioSocketCmd("volume", "-")}>
                <Image src="/icons/icon-volume-down.svg" alt="Vol -" className="action" width={16} height={16} />
              </button>
              {response.volume && <button className="volume-level">{response.volume}</button>}
              <button onClick={() => volumioSocketCmd("volume", "+")}>
                <Image src="/icons/icon-volume-up.svg" alt="Vol +" className="action" width={16} height={16} />
              </button>

              <button onClick={() => volumioSocketCmd("prev")}>
                <Image src="/icons/icon-prev.svg" alt="Prev" className="action" width={24} height={32} />
              </button>
              {response.status==="play"?
              <button onClick={() => volumioSocketCmd("pause")}>
                <Image src="/icons/icon-pause-circle.svg" alt="Pause" className="action" width={32} height={32} />
              </button>:<button onClick={() => volumioSocketCmd("play")}>
                <Image src="/icons/icon-play-circle.svg" alt="Play" className="action" width={32} height={32} />
              </button>
              }
              
              <button onClick={() => volumioSocketCmd("next")}>
                <Image src="/icons/icon-next.svg" alt="Next" className="action" width={24} height={32} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PlayingNow;
