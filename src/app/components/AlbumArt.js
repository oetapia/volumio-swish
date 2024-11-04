import React from 'react'
import Image from "next/image";
import AddToQueue from './AddToQueue';
import SearchSimilar from "./SimilarToTidal";
import RemoveFromQueue from './RemoveFromQueue';

function AlbumArt({meta, type, index, refresh, setRefresh, variant, token}) {



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

  async function playItem(id) {

	console.log('play',id)

	var url = "http://volumio.local/api/v1/commands/?cmd=play&N="+id

	try {
		const response = await fetch(url);
		if (!response.ok) {
		  throw new Error(`Response status: ${response.status}`);
		}
	
		const json = await response.json();
  
		console.log(json)
		
		setRefresh(!refresh)
  
	  } catch (error) {
		console.error(error.message);
	  }
  }

  if (type==="search"){

	  return (
		<li className={"album-list"} key={meta.uri} >
	
			<div className="album-container">

				<img
					className={`cover ${variant}`}
					src={meta.albumart || defaultImageUrl} // Use meta.image or fallback
					onError={(e) => { e.target.src = defaultImageUrl; }} // Fallback if image fails to load
					alt={meta.title || "Default Album Art"}
				/>
		
			</div>
	
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
				</p>
				<p className="secondary">
				<span className="album">
					{meta.album}
				</span> 
				</p>
				<p className="extra">
				{
					meta.trackType ?
					<span className="item">
					  {meta.trackType}
				  </span>:''
				}
				  
				  {meta.samplerate?
				  <span className="item">
					  {meta.samplerate}
				  </span>:''
				  }

				{
				meta.duration?
				<span className="item">
					  {formatDuration(meta.duration)}
				  </span>:''
				}
				  
			  </p>

				
			</div>
			  <AddToQueue sourceUrl={meta.uri} refresh={refresh} variant={variant} setRefresh={setRefresh} ></AddToQueue>
	
		</li>
	
	  )
  }

  if (type==="small"){

	return (
	  <li className={"album-list"} key={meta.uri} >
  
		  <div className="album-container">
			  <img src={meta.albumart} className="cover" />
			  <button className="overlay btn" onClick={()=>playItem(index)}>
				  <Image
				  src="/icons/icon-play-circle.svg"
				  alt="Play"
				  className="action"
				  width={32}
				  height={32}
				  />
			  </button>
		  </div>
  
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
				</p>
				<p className="secondary">
				<span className="album">
					{meta.album}
				</span> 
				</p>
			  <p className="extra">
				<span className="item">
					{meta.trackType}
				</span>
				{meta.samplerate?
				<span className="item">
					{meta.samplerate}
				</span>:''
				}
				<span className="item">
					{formatDuration(meta.duration)}
				</span>
				
			</p>

		
		  </div>
			<RemoveFromQueue sourceUrl={meta.uri} refresh={refresh} setRefresh={setRefresh} ></RemoveFromQueue>
		
	  </li>
  
	)
}

  else {

	return (
	  <div className={"album-art"}>
  
		  <img src={meta.albumart} className="cover" />
  
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
				  <span className="item">
					  {meta.trackType}
				  </span>
				  <span className="item">
					  {meta.samplerate}
				  </span>
				  
				  <span className="item">
				  	{formatDuration(meta.duration)}
				  </span>
			
			  </p>
			  {meta.uri?
			  <>
				<SearchSimilar refresh={refresh} setRefresh={setRefresh} type={"radio"} token={token} passedId={extractIdFromURL(meta.uri)}/>
				<SearchSimilar refresh={refresh} setRefresh={setRefresh} type={"album"} token={token} passedId={extractIdFromURL(meta.uri)}/>
			  </>
				:''
				}
		  </div>
  
	  </div>
  
	)
}
}

export default AlbumArt