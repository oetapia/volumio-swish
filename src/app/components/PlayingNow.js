"use client"

import React, { useState, useEffect } from 'react';
import ArtSingle from './ArtSingle';
import Image from "next/image";


function PlayingNow({  refresh, setRefresh, token, response, volumioSocketCmd, localhost, setPlayingNow, setMessage, g_token, localAPI, setSearchTerm }) {
  
  const [openPanel, setOpenPanel] = useState(true);



  useEffect(() => {
    volumioSocketCmd(`getState`);
  }, [])
  
  
  return (
    <div className={`panel player-panel ${openPanel ? "open-panel" : "closed-panel"}`}>
      <div className="panel-control">


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
            <ArtSingle localAPI={localAPI} g_token={g_token} setMessage={setMessage} meta={response} refresh={refresh} localhost={localhost} setRefresh={setRefresh} token={token} variant="single" setPlayingNow={setPlayingNow} setSearchTerm={setSearchTerm} />
            
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
           
              {response.volume && (
                <div className='volume-level'>
                {response.volume}
                <div className="progress-container overlay">
                <div
                className="progress-fill"
                title={response.volume}
                style={{ width: `${Math.min(Math.max(response.volume, 0), 100)}%` }}
                >
                </div>
                </div>
                </div>
              
              
              )}


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
              <button onClick={() => volumioSocketCmd("addToFavourites", response)}>
                <Image src="/icons/icon-heart.svg" alt="Vol -" className="action" width={16} height={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PlayingNow;
