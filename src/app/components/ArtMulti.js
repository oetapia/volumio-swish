import React from 'react'
import Image from "next/image";
import PlayFromQueue from './PlayFromQueue';

function ArtMulti({meta,  index, variant, volumioSocketCmd, localhost}) {



const defaultImageUrl = '/default-cover.png'; // Replace with the path to your default image



  function formatDuration(duration) {
	const minutes = Math.floor(duration / 60);
	const seconds = duration % 60;
	return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Ensures two digits for seconds
  }

 
  



	return (
	  <div className={"album-list"} key={meta.uri} >
  
		  <div className="album-container">
		 	 <img
					className={`cover ${variant}`}
					src={meta.albumart || defaultImageUrl} // Use meta.image or fallback
					onError={(e) => { e.target.src = defaultImageUrl; }} // Fallback if image fails to load
					alt={meta.title || "Default Album Art"}
				/>
				<PlayFromQueue index={index} localhost={localhost}></PlayFromQueue>
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
		  <div className="buttons">

		  <button onClick={() => volumioSocketCmd("removeFromQueue",{value: index})}>
				<Image
					src="/icons/icon-trash.svg"
					alt="Add to Queue"
					className="action"
					width={16}
					height={16}
				/>
			</button>

		  </div>

		
	  </div>
  
	)


  
}

export default ArtMulti