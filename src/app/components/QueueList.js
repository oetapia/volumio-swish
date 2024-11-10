"use client"

import React, { useState, useEffect, use } from 'react';
import AlbumArt from './ArtMulti';
import Image from "next/image";
import RemoveFromQueue from './RemoveFromQueue';
import DraggableList from "./DraggableList";

function QueueList({ response, token, volumioSocketCmd, localhost, onMove }) {
  const [openPanel, setOpenPanel] = useState(true);
  const [items, setItems] = useState(response);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    console.log("Requesting queue with getQueue command"); // Debug log to confirm
    volumioSocketCmd(`getQueue`);
  }, [volumioSocketCmd]); // Depend on the function to ensure it's accessible
  
 useEffect(() => {
   setItems(response)
 }, [response])
 

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
          <button 
          className="editable"
          onClick={() => setEditable(!editable)}
        >
      {/*     {editable ? (
            <Image src="/icons/icon-edit.svg" alt="Toggle" className="toggle-panel" width={18} height={18} />
          ) : (
            <Image src="/icons/icon-edit.svg" alt="Toggle" className="toggle-panel" width={18} height={18} />
          )} */}
        </button>
          <div className={`queue queue-list scroll-list `}>
          <DraggableList onMove={onMove} items={items} editable={editable} setItems={setItems} localhost={localhost} volumioSocketCmd={volumioSocketCmd} token={token}/>
           
          </div>
        
          </>
        )}
      </div>
    </div>
  );
}

export default QueueList;
