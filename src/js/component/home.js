import React, { useEffect, useState, useRef } from "react";

export function Home() {
	// https://stackoverflow.com/questions/43577182/react-js-audio-src-is-updating-on-setstate-but-the-audio-playing-doesnt-chang
	const audioRef = useRef();
	const [songs, setSongs] = useState([]);
	const [songUrl, setSongUrl] = useState("");
	const API_BASE_URL = "https://assets.breatheco.de/apis/sound/";

	useEffect(() => {
		init();
	}, []);

	async function init() {
		const arrSongs = await getSongs();
		const songsMap = mapSongs(arrSongs);
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

	function playSong(songUrlToPlay) {
		setSongUrl(songUrlToPlay);
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.load();
			audioRef.current.play();
		}
	}

	function mapSongs(songs) {
		let jsonMap = [];
		if (songs) {
			jsonMap = songs.map(function(song, index) {
				return (
					<li key={index}>
						<button
							onClick={() => playSong(API_BASE_URL + song.url)}>
							{song.name}
						</button>
					</li>
				);
			});
		}
		return jsonMap;
	}

	return (
		<div className="text-letf mt-5">
			<ol className="">{songs}</ol>
			<audio controls ref={audioRef}>
				<source src={songUrl} type="audio/ogg"></source>
			</audio>
		</div>
	);
}
