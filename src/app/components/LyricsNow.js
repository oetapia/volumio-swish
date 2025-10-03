"use client"

import React, { useState, useEffect } from 'react';
import Lyrics from './Lyrics';
import Image from "next/image";


function LyricsNow({  refresh, setRefresh, token, response, volumioSocketCmd, localhost, setPlayingNow, setMessage, g_token, localAPI, setSearchTerm,lyricsPanel,lyricsSize, lyricsState }) {
  const [sizePanel, setSizePanel] = useState(lyricsSize);
  const [openPanel, setOpenPanel] = useState(lyricsPanel);




  useEffect(() => {
    volumioSocketCmd(`getState`);
  }, [])
  
  
  useEffect(() => {
    // Update the document title whenever `data` changes
    if (response && response.title) {
      document.title = `${response.title} - ${response.artist}`;
    }
  }, [response]);

  return (
    <div className={`panel  ${sizePanel} player-panel ${openPanel ? "open-panel" : "closed-panel"}`}>
      <div className="panel-control">


        <button 
          className="button-open"
          onClick={() => setOpenPanel(!openPanel)}
        >
          {openPanel ? (
            <Image src="/icons/icon-graph.svg" alt="Toggle" className="toggle-panel" width={18} height={18} />
          ) : (
            <Image src="/icons/icon-graph.svg" alt="Toggle" className="toggle-panel" width={24} height={24} />
          )}
        </button>
      </div>

      <div className="contained">
        {response && (
          <>
            <Lyrics localAPI={localAPI} g_token={g_token} setMessage={setMessage} meta={response} refresh={refresh} localhost={localhost} setRefresh={setRefresh} token={token} variant="single" setPlayingNow={setPlayingNow} setSearchTerm={setSearchTerm} lyricsState={lyricsState} />
            
           
          </>
        )}

             {sizePanel?
                        <button onClick={() => setSizePanel("")}>
                          <Image src="/icons/icon-collapse.svg" alt="Collapse" className="action" width={24} height={24} />
                        </button>
                      :  
                        <button onClick={() => setSizePanel("large")}>
                          <Image src="/icons/icon-expand.svg" alt="Collapse" className="action" width={24} height={24} />
                        </button>
                        
                      }
      </div>
    </div>
  );
}

export default LyricsNow;
