import React, { useEffect, useState } from 'react'
import Image from "next/image";
import LyricsMetadata from "./LyricsMetadata";
import GeniusMetadata from './GeniusMetadata';

function Lyrics({meta, service, g_token,  setPlayingNow, setMessage, localAPI, setSearchTerm}) {

const [extraInfo, setExtraInfo] = useState(false)
const [lyricsList, setLyricsList] = useState(false)

console.log(service,meta)



  useEffect(() => {
	setPlayingNow(meta.position)
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