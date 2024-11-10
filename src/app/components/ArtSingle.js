import React from 'react'
import Image from "next/image";
import SearchSimilar from "./SimilarToTidal";


function ArtSingle({meta,  variant, token}) {



const defaultImageUrl = '/default-cover.png'; // Replace with the path to your default image

	

  function extractIdFromURL(uri) {

	//console.log('processing',uri) 
  
	var processed = uri.replace("tidal://song/",'')
  
	return processed
  
	}

  function formatDuration(duration) {
	const minutes = Math.floor(duration / 60);
	const seconds = duration % 60;
	return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Ensures two digits for seconds
  }



	return (
	  <div className={"album-art"}>
  
 			 <img
					className={`cover ${variant}`}
					src={meta.albumart || defaultImageUrl} // Use meta.image or fallback
					onError={(e) => { e.target.src = defaultImageUrl; }} // Fallback if image fails to load
					alt={meta.title || "Default Album Art"}
				/>
  
		  <div className="meta">
			  <p className="primary">
				  <span className="title">
				  {meta.title}
				  </span>
			  </p>
			  <p className="secondary">
			  <span className="artist">
				  {meta.artist}
			  </span>
			  &nbsp; - &nbsp;
			  <span className="album">
				  {meta.album}
			  </span> 
			  </p>
			  <p className="extra">
			  {meta.trackType?
				  <span className="item">
					  {meta.trackType}
				  </span>
				  :""}
				  {meta.samplerate? 
				  <span className="item">
					  {meta.samplerate}
				  </span> : 
				  ""}
				  
				  <span className="item">
				  	{formatDuration(meta.duration)}
				  </span>
			
			  </p>
			  {meta.uri?
			  <>
				<SearchSimilar  type={"radio"} token={token} passedId={extractIdFromURL(meta.uri)}/>
				<SearchSimilar  type={"album"} token={token} passedId={extractIdFromURL(meta.uri)}/>
			  </>
				:''
				}
		  </div>
  
	  </div>
  
	)
}


export default ArtSingle