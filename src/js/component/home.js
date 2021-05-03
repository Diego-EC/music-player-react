import React, { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
export function Home() {
	const [songs, setSongs] = useState([]);

	useEffect(() => {
		init();
	}, []);

	useEffect(() => {
		console.log(songs);
	}, [songs]);

	async function init() {
		const arrSongs = await getSongs();
		console.log(arrSongs);
		const songsMap = mapSongs(arrSongs);
		console.log(songsMap);
		setSongs(songsMap);
	}

	async function getSongs() {
		return await fetch("https://assets.breatheco.de/apis/sound/songs")
			.then(function(response) {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				// Read the response as json.
				return response.json();
			})
			.then(function(responseAsJson) {
				// Do stuff with the JSON
				console.log(responseAsJson);
				return responseAsJson;
			})
			.catch(function(error) {
				console.log("Looks like there was a problem: \n", error);
			});
	}

	function mapSongs(songs) {
		console.log("mapSongs");
		let jsonMap = [];
		if (songs) {
			jsonMap = songs.map(function(song, index) {
				console.log(song);
				return <div key={index}> {song.name} </div>;
			});
		}
		console.log(jsonMap);
		return jsonMap;
	}

	return (
		<div className="text-center mt-5">
			<div className="tracks">{songs}</div>
			<audio controls></audio>
		</div>
	);
}
