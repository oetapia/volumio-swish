import React from 'react';
import Image from "next/image";

function RemoveFromQueue({ trackId, sourceUrl, type, refresh, setRefresh }) {
	// Set up a queue with an initial resolved promise


	

	let queue = Promise.resolve();

	// This function adds each request to the queue
	function queueTrackOnVolumio() {
		queue = queue.then(async () => {
			console.log('Adding track:', trackId || sourceUrl);

			const url = "http://volumio.local/api/v1/addToQueue";
			const data = {
				"service": "tidal",
				"uri": sourceUrl ? sourceUrl : `tidal://song/${trackId}`
			};

			try {
				// Optional delay between requests to prevent overload
				await new Promise(resolve => setTimeout(resolve, 500));

				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(data)
				});

				if (!response.ok) {
					throw new Error(`Response status: ${response.status}`);
				}

	            const json = await response.json();
                console.log("Response from Volumio:", json);

                // Trigger refresh after successful queue addition
                setRefresh(!refresh);  // Use setRefresh to toggle refresh state
                
				
				// Optional: You can update the UI here if needed

			} catch (error) {
				console.error("Error adding track to Volumio queue:", error.message);
			}
		});
	}

	// Automatically queue track if type is "auto"
	if (type === "auto") {
		queueTrackOnVolumio();
	}

	else {

		return (
			<div>

			<button onClick={() => queueTrackOnVolumio()}>
				<Image
					src="/icons/icon-trash.svg"
					alt="Add to Queue"
					className="action"
					width={16}
					height={16}
				/>
			</button>
			<button className="drag" onClick={() => queueTrackOnVolumio()}>
				<Image
					src="/icons/icon-drag.svg"
					alt="Drag Item"
					className="action"
					width={16}
					height={16}
				/>
			</button>
			</div>
		);
	}
}

export default RemoveFromQueue;
