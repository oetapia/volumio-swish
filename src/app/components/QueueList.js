"use client"

import React, { useState, useEffect } from 'react';
import AlbumArt from './ArtMulti';
import Image from "next/image";
import RemoveFromQueue from './RemoveFromQueue';

function QueueList({ response, refresh, setRefresh, token, volumioSocketCmd, localhost }) {
  const [openPanel, setOpenPanel] = useState(true);
  

  useEffect(() => {
    console.log("Requesting queue with getQueue command"); // Debug log to confirm
    volumioSocketCmd(`getQueue`);
  }, [volumioSocketCmd]); // Depend on the function to ensure it's accessible
  
 

  return (
    <div className={`panel queue-panel ${openPanel ? "open-panel" : "closed-panel"}`}>
      <div className="panel-control">     
        
        <button 
          className="button-open"
          onClick={() => setOpenPanel(!openPanel)}
        >
          {openPanel ? (
            <Image src="/icons/icon-note-multi.svg" alt="Toggle" className="toggle-panel" width={18} height={18} />
          ) : (
            <Image src="/icons/icon-note-multi.svg" alt="Toggle" className="toggle-panel" width={24} height={24} />
          )}
        </button>
      </div>

      <div className="contained">
        {response && (
          <>
          
          <h2>Queue ({response && response.length})</h2>
          <RemoveFromQueue localhost={localhost}/>
          <ul className="queue queue-list scroll-list">
            {response.map((item, index) => (
              <AlbumArt
                meta={item}
                key={index}
                index={index}
                type="small"
                localhost={localhost}
                refresh={refresh}
                setRefresh={setRefresh}
                token={token}
              volumioSocketCmd={volumioSocketCmd}
              />
            ))}
          </ul>
        
          </>
        )}
      </div>
    </div>
  );
}

export default QueueList;
