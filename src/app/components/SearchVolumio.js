"use client";

import { useState } from 'react';
import Image from "next/image";
import AlbumArt from './AlbumArt';

function SearchVolumio({ refresh, setRefresh, localhost, setMessage }) {

    const [inputData, setInputData] = useState("");
    const [openPanel, setOpenPanel] = useState(false);
    const [toggleLocalSearch, setToggleLocalSearch] = useState(false);
    const [albumArt, setAlbumArt] = useState({});
    const [loading, setLoading] = useState(false);

    // Helper function to process lists based on title keyword and variant
    const processList = (json, titleKeyword, variant, limit) => {
        const list = json.navigation.lists.find(
            list => list.title && list.title.includes(titleKeyword)
        );
        
        if (list && list.items) {
            // Map through items to create AlbumArt components
            return list.items.slice(0, limit).map((item, index) => (
                <AlbumArt 
                    meta={item} 
                    index={index} 
                    refresh={refresh} 
                    setRefresh={setRefresh} 
                    type="search" 
                    variant={variant} 
                    key={index} 
                    localhost={localhost}
                    setMessage={setMessage}
                />
            ));
        }
        return null;
    };

    // Main function to handle search results
    async function searchTracks(searchTerm) {	

        var message = 'Searching for:' + searchTerm;
        setMessage(message)
        setLoading(true)
        console.log(message);

        const url = `http://volumio.local/api/v1/search?query=${encodeURIComponent(searchTerm)}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            console.log("Response from Volumio:", json);

            if (json && json.navigation && json.navigation.lists) {
                const newAlbumArt = {};

                // Process "TIDAL Tracks" and "TIDAL Playlist" lists
                   newAlbumArt.local_tracks = processList(json, "Tracks '", "tracks", 9);
                // Process "TIDAL Tracks" and "TIDAL Playlist" lists
                   newAlbumArt.local_albums = processList(json, "Albums '", "albums", 6);
                // Process "TIDAL Tracks" and "TIDAL Playlist" lists
                   newAlbumArt.youtube = processList(json, "Youtube '", "tracks", 9);
                // Process "TIDAL Tracks" and "TIDAL Playlist" lists
                newAlbumArt.tracks = processList(json, "TIDAL Tracks", "tracks", 9);
                newAlbumArt.playlists = processList(json, "TIDAL Playlist", "playlist", 3);
                newAlbumArt.artists = processList(json, "TIDAL Artists", "artists", 3);
                newAlbumArt.albums = processList(json, "TIDAL Albums", "albums", 6);

                // Update albumArt state with grouped components
                setAlbumArt(newAlbumArt);
                setLoading(false)
                setMessage(null)
            } else {
                console.log("No results found in the response.");
                setAlbumArt("");
                setLoading(false)
                setMessage("No results found in the response.")
            }
        } catch (error) {
            console.error("Error searching tracks:", error.message);
        }
    }

    return (
        <div className={`panel search-panel  ${openPanel ? " open-panel ":" closed-panel "}`}>
            
     

            <div className="panel-control">

            <button 
                className="button-open"
                onClick={()=>setOpenPanel(!openPanel)}>
          

                {openPanel? 
                
                <Image
                src="/icons/icon-search.svg"
                alt="Toggle"
                className="toggle-panel"
                width={18}
                height={18}
            />
               :
     
               <Image
                src="/icons/icon-search.svg"
                alt="Toggle"
                className="toggle-panel"
                width={24}
                height={24}
            />
            
             
                }
            </button>
            </div>
            


            <div className="contained">

            <div className="search-box">
                <input 
                    type="text" 
                    className={`main-search ${inputData ? 'filled' : ''}`} 
                    value={inputData} 
                    placeholder="Search" 
                    onChange={(e) => setInputData(e.target.value)} 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            searchTracks(inputData);
                        }
                    }} 
                />
               
                <button 
                    className="toggle" 
                    onClick={() => {
                        setToggleLocalSearch(!toggleLocalSearch);
                    }}
                >
                    
                   {toggleLocalSearch? <>
                    <span className="badge">Local</span>
                    <Image
                        src="/icons/icon-toggle-on.svg"
                        alt="Toggle"
                        className="toggle-icon"
                        width={24}
                        height={24}
                    />
                   </>:
                   <>
                   <span className="badge">Stream</span>
                    <Image
                        src="/icons/icon-toggle-off.svg"
                        alt="Toggle"
                        className="toggle-icon"
                        width={24}
                        height={24}
                    />
                   </>
                    }
                </button>
                <button 
                    className="btn-basic" 
                    disabled={!inputData} 
                    onClick={() => searchTracks(inputData)}
                >
                    <Image
                        src="/icons/icon-search.svg"
                        alt="Search"
                        className="action"
                        width={16}
                        height={16}
                    />
                </button>
                <button 
                    className="btn-basic" 
                    onClick={() => {
                        setAlbumArt({});
                        setInputData("");
                    }}
                >
                    <Image
                        src="/icons/icon-trash.svg"
                        alt="Clear"
                        className="action"
                        width={16}
                        height={16}
                    />
                </button>
      
            </div>
            
            <div className="search-results scroll-list">
            <div className="search">

            {
                loading?
                <p>
                    Loading...
                </p>    
                :''
            }

               {toggleLocalSearch? 
              

    (<>
        {albumArt.local_tracks && (
         <div className="tracks">
             <h3>Local Tracks</h3>
             <ul className="queue-list">
                 {albumArt.local_tracks}
             </ul>
         </div>
     )}
 {albumArt.local_albums && (
         <div className="albums">
             <h3>Local Albums</h3>
             <ul className="queue-list">
                 {albumArt.local_albums}
             </ul>
         </div>
     )}
    </>

    )

    :

    (
        <>
         {albumArt.tracks && (
          <div className="tracks">
              <h3>Tidal Tracks</h3>
              <ul className="queue-list">
                  {albumArt.tracks}
              </ul>
          </div>
      )}
      {albumArt.artists && (
          <div className="artists">
              <h3>Tidal Artists</h3>
              <ul className="queue-list">
                  {albumArt.artists}
              </ul>
          </div>
      )}
      {albumArt.albums && (
          <div className="albums">
              <h3>Tidal Albums</h3>
              <ul className="queue-list">
                  {albumArt.albums}
              </ul>
          </div>
      )}
    
      {albumArt.playlists && (
          <div className="playlist">
              <h3>Tidal Playlists</h3>
              <ul className="queue-list">
                  {albumArt.playlists}
              </ul>
          </div>
      )}
       {albumArt.youtube && (
          <div className="playlist">
              <h3>Youtube</h3>
              <ul className="queue-list">
                  {albumArt.youtube}
              </ul>
          </div>
      )}
        
        </>
       )
      
      
      

               
               }
              
         
                </div>
            </div>
            </div>


        </div>
    );
}

export default SearchVolumio;
