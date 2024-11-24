import React, { useEffect, useState } from 'react'
import Image from "next/image";
import SearchSimilar from "./SimilarToTidal";
import GeniusMetadata from './GeniusMetadata';

function ArtSingle({meta,  variant, service, token, g_token, localhost, setPlayingNow, setMessage, localAPI, setSearchTerm}) {

const [albumArt, setalbumArt] = useState("")
const [extraInfo, setExtraInfo] = useState(false)

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
	setExtraInfo(false)
  }, [meta])
  

	return (
		<>

{
		extraInfo?
		<GeniusMetadata
         setMessage={setMessage}
         meta={meta}
         g_token={g_token}
		 localAPI={localAPI}
		 setSearchTerm={setSearchTerm}
         />
		:""
		}
  
	  <div className={"album-art"}>

		
	  {
		extraInfo?
		""
		:albumArt
		}
		
  
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
				<SearchSimilar localhost={localhost} service={meta.service} setMessage={setMessage} type={"radio"} token={token} passedId={extractIdFromURL(meta.uri)}/>
				<SearchSimilar service={meta.service} localhost={localhost} setMessage={setMessage} type={"album"} token={token} passedId={extractIdFromURL(meta.uri)}/>


			  </>
				:''
				}

<button 
				className=' btn btn-basic' 
				onClick={()=>setExtraInfo(!extraInfo)}
				title="Find Samples"
				>{extraInfo?
				<Image
				src="/icons/icon-close.svg"
				alt="Close"
				className="action"
				width={16}
				height={16}
				/>:
				<Image
					src="/icons/icon-author-search.svg"
					alt="Search samples"
					className="action"
					width={16}
					height={16}
				/>
				}</button>
				
		  </div>
  
	  </div>
		</>
  
	)
}


export default ArtSingle