"use client"

import { useState,useEffect } from 'react'
import Image from "next/image";
import AddToQueue from './AddToQueue';


function SearchTidal({passedId, refresh, setRefresh, token, type}) {
	

const [data, setData] = useState(null)
const [trackId, setTrackId] = useState(null)
const [fetchInitiated, setFetchInitiated] = useState(false); // New state to control fetch
const [queueReady, setQueueReady] = useState(false); // State to trigger queuing process
const [TIDAL_ACCESS_TOKEN,setToken] = useState(token)


var TIDAL_API_BASE_URL = "https://openapi.tidal.com/v2"
var COUNTRY_CODE = "DE"

// Function to fetch similar tracks
async function searchSimilarTracks(trackId) {
	const url = type==="radio"?`${TIDAL_API_BASE_URL}/tracks/${trackId}/relationships/similarTracks`:`${TIDAL_API_BASE_URL}/tracks/${trackId}/relationships/albums`;
	const params = new URLSearchParams({
		countryCode: COUNTRY_CODE,
		include: "similarTracks"
	});

	const headers = {
		"Authorization": `Bearer ${TIDAL_ACCESS_TOKEN}`
	};

	try {
		const response = await fetch(`${url}?${params}`, { headers });

		if (!response.ok) {
			throw new Error(`Failed to fetch similar tracks: ${response.status}`);
		}

		const data = await response.json();
		
		// Extract similar track IDs
		const trackIds = data.data.map(track => track.id);

		// Store fetched track IDs
		setData(trackIds);
		setQueueReady(true); // Ready to queue after fetching
	} catch (error) {
		console.error("Error fetching similar tracks:", error);
	}
}

// Initiate fetch only on button click
const handleSearchClick = () => {
	setFetchInitiated(true);
};

// Effect to handle fetch initiation and reset `fetchInitiated` flag
useEffect(() => {
	if (fetchInitiated) {
		searchSimilarTracks(trackId);
		setFetchInitiated(false); // Reset to prevent repeated calls
	}
}, [fetchInitiated, trackId]);

// Effect to queue tracks once data is ready
useEffect(() => {
	if (queueReady && data) {
		data.forEach(trackId => {
			// Queue each track
			<AddToQueue refresh={refresh} setRefresh={setRefresh} key={trackId} trackId={trackId} type="auto" />;
		});
		setQueueReady(false); // Reset queue readiness
		setData(null); // Clear data to prevent re-queuing
	}
}, [queueReady, data]);

// Update trackId when `passedId` changes, without auto-triggering fetch
useEffect(() => {
	setTrackId(passedId);
}, [passedId]);

return (
	<>
		
			<button 
				className="btn-basic" 
				title={type+" from track"}
				onClick={handleSearchClick} // Use handler to initiate fetch
			>
				{type==="radio"?
				<Image
					src="/icons/icon-radio.svg"
					alt="Track from Radio"
					className="action"
					width={16}
					height={16}
				/>:
				<Image
					src="/icons/icon-album-all.svg"
					alt="Tracks from Album"
					className="action"
					width={16}
					height={16}
				/>
				}
			</button>
		
		
		
			{data && queueReady ? (
				data.map(trackId => (
					<AddToQueue refresh={refresh} setRefresh={setRefresh} key={trackId} trackId={trackId} type="auto" />
				))
			) : (
				"" // Empty state or placeholder if needed
			)}
		
	</>
);
}

export default SearchTidal