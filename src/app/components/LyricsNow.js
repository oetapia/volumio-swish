"use client"

import React, { useState, useEffect } from 'react';
import Lyrics from './Lyrics';
import Image from "next/image";


function LyricsNow({  refresh, setRefresh, token, response, volumioSocketCmd, localhost, setPlayingNow, setMessage, g_token, localAPI, setSearchTerm }) {
  
  const [openPanel, setOpenPanel] = useState(true);



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
    <div className={`panel player-panel ${openPanel ? "open-panel" : "closed-panel"}`}>
      <div className="panel-control">


        <button 
          className="button-open"
          onClick={() => setOpenPanel(!openPanel)}
        >
          {openPanel ? (
            <Image src="/icons/icon-author-search.svg" alt="Toggle" className="toggle-panel" width={18} height={18} />
          ) : (
            <Image src="/icons/icon-author-search.svg" alt="Toggle" className="toggle-panel" width={24} height={24} />
          )}
        </button>
      </div>

      <div className="contained">
        {response && (
          <>
            <Lyrics localAPI={localAPI} g_token={g_token} setMessage={setMessage} meta={response} refresh={refresh} localhost={localhost} setRefresh={setRefresh} token={token} variant="single" setPlayingNow={setPlayingNow} setSearchTerm={setSearchTerm} />
            
           
          </>
        )}
      </div>
    </div>
  );
}

export default LyricsNow;
