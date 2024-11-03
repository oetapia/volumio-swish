"use client"

import React, { useState, useEffect } from 'react';
import AlbumArt from './AlbumArt';
import Image from "next/image";

function ApiRequest({ request, refresh, setRefresh, token, type }) {
  const [response, setResponse] = useState(null);

  const localhost = "http://volumio.local";


  async function volumioCmd(command) {
    const url = `${localhost}/api/v1/commands/?cmd=${command}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json);
      getData(); // Refresh data after command execution
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getData() {
    
    if (!token) return;  // Ensure the token is available

    const url = localhost+request;
    
    try {


      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();



      setResponse(json);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    if (token) {
      getData(); // Fetch data when token is available
    }
  }, [refresh, token]);
  

  if (type === "multi" && response && response.queue) {


    return (
      <div className="panel">
        <div className="">
          <h2>Queue ({response.queue.length})</h2>
          <button className="btn-basic" onClick={() => volumioCmd("clearQueue")}>
            <Image src="/icons/icon-trash.svg" alt="Clear" className="action" width={16} height={16} />
          </button>
          <ul className="queue queue-list">
            {response.queue.map((item, index) => (
              <AlbumArt
                meta={item}
                key={index}
                index={index}
                type="small"
                refresh={refresh}
                setRefresh={setRefresh}
                token={token}
              />
            ))}
          </ul>
        </div>
      </div>
    );
  } else if (type === "single" && response) {
    return (
      <div className="panel">
        <AlbumArt meta={response} refresh={refresh} setRefresh={setRefresh} token={token} variant="single" />
        <div className="action-buttons">
          <button onClick={() => volumioCmd("volume&volume=minus")}>
            <Image src="/icons/icon-volume-down.svg" alt="Vol -" className="action" width={16} height={16} />
          </button>
          {response.volume && <button className="volume-level">{response.volume}</button>}
          <button onClick={() => volumioCmd("volume&volume=plus")}>
            <Image src="/icons/icon-volume-up.svg" alt="Vol +" className="action" width={16} height={16} />
          </button>
          <button onClick={() => volumioCmd("prev")}>
            <Image src="/icons/icon-prev.svg" alt="Prev" className="action" width={24} height={24} />
          </button>
          <button onClick={() => volumioCmd("toggle")}>
            <Image src="/icons/icon-play-pause.svg" alt="Play/Pause" className="action" width={32} height={32} />
          </button>
          <button onClick={() => volumioCmd("next")}>
            <Image src="/icons/icon-next.svg" alt="Next" className="action" width={24} height={24} />
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="panel">
        <p>Loading...</p>
      </div>
    );
  }
}

export default ApiRequest;
