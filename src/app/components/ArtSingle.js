import React, { useEffect, useState } from 'react'
import Image from "next/image";
import SearchSimilar from "./SimilarToTidal";


function ArtSingle({meta,  variant, service, token, localhost, setPlayingNow, setMessage}) {

const [albumArt, setalbumArt] = useState("")

console.log(service,meta)


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

  function checkArt(source) {

	//console.log("source",source)
	var structure	

	if (source && source.includes("/albumart?")) {

	structure = <img
	className={`cover ${variant}`}
	src={localhost+source || defaultImageUrl} // Use meta.image or fallback
	onError={(e) => { e.target.src = defaultImageUrl; }} // Fallback if image fails to load
	alt={meta.title || "Default Album Art"}
/>

	}

	else {

		structure = <img
		className={`cover ${variant}`}
		src={source || defaultImageUrl} // Use meta.image or fallback
		onError={(e) => { e.target.src = defaultImageUrl; }} // Fallback if image fails to load
		alt={meta.title || "Default Album Art"}
	/>

	}

	
	return setalbumArt(structure)
  }

  useEffect(() => {
	checkArt(meta.albumart)
	setPlayingNow(meta.position)
  
  }, [meta])
  

	return (
	  <div className={"album-art"}>
  
		{albumArt}
  
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
			  {meta.service ==="tidal"?
			  <>
				<SearchSimilar service={meta.service} setMessage={setMessage} type={"radio"} token={token} passedId={extractIdFromURL(meta.uri)}/>
				<SearchSimilar service={meta.service} setMessage={setMessage} type={"album"} token={token} passedId={extractIdFromURL(meta.uri)}/>
			  </>
				:''
				}
		  </div>
  
	  </div>
  
	)
}


export default ArtSingle