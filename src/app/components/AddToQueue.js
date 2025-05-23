import React from 'react';
import Image from "next/image";

function AddToQueue({ trackId, sourceUrl, type, variant, service, setMessage, title, localhost }) {
	// Set up a queue with an initial resolved promise


	let queue = Promise.resolve();

	// This function adds each request to the queue
	function queueTrackOnVolumio() {

		
		queue = queue.then(async () => {
			var message = "Adding to queue: " + title;
			console.log('Adding track:', trackId || sourceUrl);
			setMessage(message)
			const url = localhost+"/api/v1/addToQueue";
			const data = {
				"service": service? service:"mpd",
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
                //console.log("Response from Volumio:", json);
				setMessage(null)
           
                
				
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
			<button onClick={() => queueTrackOnVolumio()}>
				{ variant=== "tracks" ?
				<Image
					src="/icons/icon-plus-single.svg"
					alt="Add to Queue"
					className="action"
					width={16}
					height={16}
				/>:
				<Image
				src="/icons/icon-plus-multi.svg"
				alt="Add to Queue"
				className="action"
				width={16}
				height={16}
			/>
				}
			</button>
		);
	}
}

export default AddToQueue;
