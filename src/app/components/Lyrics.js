import React, { useEffect, useState } from 'react'
import Image from "next/image";
import LyricsMetadata from "./LyricsMetadata";
import GeniusMetadata from './GeniusMetadata';

function Lyrics({meta,  variant, service, token, g_token, localhost, setPlayingNow, setMessage, localAPI, setSearchTerm}) {

const [albumArt, setalbumArt] = useState("")
const [extraInfo, setExtraInfo] = useState(false)
const [lyricsList, setLyricsList] = useState(false)

console.log(service,meta)


const defaultImageUrl = '/default-cover.png'; // Replace with the path to your default image

	

  function extractIdFromURL(uri) {

	//console.log('processing',uri) 
  
	var processed = uri.replace("tidal://song/",'')
  
	return processed
  
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


{
		lyricsList?
		<LyricsMetadata
         setMessage={setMessage}
         meta={meta}
         g_token={g_token}
		 localAPI={localAPI}
		 setSearchTerm={setSearchTerm}
         />
		:""
		}
  
	  <div>
  
		  <div >
			  
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


<button 
				className=' btn btn-basic' 
				onClick={()=>setLyricsList(!lyricsList)}
				title="Find Samples"
				>{lyricsList?
				<Image
				src="/icons/icon-close.svg"
				alt="Close"
				className="action"
				width={16}
				height={16}
				/>:
				<Image
					src="/icons/icon-lyrics.svg"
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


export default Lyrics