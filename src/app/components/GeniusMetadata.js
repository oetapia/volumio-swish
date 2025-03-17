import React, { useEffect, useState } from 'react';
import AlbumArt from './AlbumArtGenius';

function GeniusMetadata({ setMessage, meta, g_token, localAPI, setSearchTerm }) {
  const [loading, setLoading] = useState(false);
  const [extraMeta, setExtraMeta] = useState('');
  const [otherMeta, setOtherMeta] = useState('');
  const [searchResults, setSearchResults] = useState("");
  const [GENIUS_TOKEN, setToken] = useState(g_token);

  
	const headers = {
		Authorization: `Bearer ${GENIUS_TOKEN}`,
	};

  async function searchTitle(track_data) {

	setMessage("Searching in Genius...")

	setLoading(true)
	var searchOptions = `${track_data.title} ${track_data.artist}`
	console.log("searching: ",searchOptions)

	  const url = `${localAPI}/api/genius/search?q=${encodeURIComponent(searchOptions)}`; // Updated to search dynamically

	  try {
		const response = await fetch(url, 
			//{ headers }
		);
  
		if (!response.ok) {
		  throw new Error(`Response status: ${response.status}`);
		}
  
		const json = await response.json();
		console.log('Response from Genius API:', json);
  
		if (json.response) {
			if (json.response.hits && json.response.hits.length) {

			  	const structure = searchTracks(json.response.hits[0].result.id)
				setSearchResults(structure);
				console.log("genius",json.response)

			}
		  	setMessage('Found match');
		} else {
		  setMessage('No results found.');
		}
	  } catch (error) {
		console.error('Error searching tracks:', error.message);
		setMessage(`Error: ${error.message}`);
	  } finally {
		setLoading(false); // Ensure loading is false in all cases
	  }

  }

  async function searchTracks(searchTerm) {

    const message = `Searching for: ${searchTerm}`;
    setMessage(message);
    setLoading(true);
    console.log(message);

	setMessage("Searching matching tracks")

    const url = `${localAPI}/api/genius/songs?q=${encodeURIComponent(searchTerm)}`; // Updated to search dynamically

    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log('Response from Genius API:', json);

      if (json.response) {

		if (json.response.song && json.response.song.song_relationships) {


			const structure = json.response.song.song_relationships
			.filter(item => item.type === "samples" || item.type === "sampled_in" || item.type === "covered_by" || item.type === "cover_of") // Filter relevant relationships
			.map(item => (
			  <div key={item.type}>
				{item.type === "samples" ? <h4>Samples</h4> : "" }
				{item.type === "sampled_in" ? <h4>Sampled in</h4> : "" }
				{item.type === "cover_of" ? <h4>Covers of</h4> : "" }
				{item.type === "covered_by" ? <h4>Covered by</h4> : "" }
				{item.songs.map(child => (
				  <AlbumArt setSearchTerm={setSearchTerm} key={child.id} meta={child} variant={"search"} />
				))}
			  </div>
			));

			const extra = json.response.song.release_date_for_display
		  
			setOtherMeta(extra)
			setExtraMeta(structure);
			console.log("genius",json.response)
		}
        setMessage('');
      } else {
        setMessage('No results found.');
      }
    } catch (error) {
      console.error('Error searching tracks:', error.message);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Ensure loading is false in all cases
    }
  }

  useEffect(() => {
	searchTitle(meta)
  
	
  }, [meta])
  

  return (
    <div className='scroll-list'>
	  {searchResults}
	  <div className=''>
      {loading ? <div>Loading...</div>:""}
      	{otherMeta}
		{extraMeta}
		
	  </div>


    </div>
  );
}

export default GeniusMetadata;
