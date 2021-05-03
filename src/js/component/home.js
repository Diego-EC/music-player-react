import React, { useEffect, useState, useRef } from "react";

export function Home() {
	// https://stackoverflow.com/questions/43577182/react-js-audio-src-is-updating-on-setstate-but-the-audio-playing-doesnt-chang
	const audioRef = useRef();
	const [songs, setSongs] = useState([]);
	const [songUrl, setSongUrl] = useState(
		"https://assets.breatheco.de/apis/sound/files/mario/songs/castle.mp3"
	);
	const API_BASE_URL = "https://assets.breatheco.de/apis/sound/";
	const [isPlaying, setIsPlaying] = useState(false);
	const [playPauseButton, setPlayPauseButton] = useState(
		<i className="fas fa-play"></i>
	);
	const [currentSong, setCurrentSong] = useState(0);
	const [jsonSongs, setJsonSongs] = useState({});

	useEffect(() => {
		init();
	}, []);

	async function init() {
		const arrSongs = await getSongs();
		setJsonSongs(arrSongs);
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

	function playSong(index, songUrlToPlay) {
		setSongUrl(songUrlToPlay);
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.load();
			audioRef.current.play();
			setIsPlaying(true);
			setCurrentSong(index);
		}
	}
	function skipForward() {
		if (currentSong < jsonSongs.length - 1) {
			setSongUrl(API_BASE_URL + jsonSongs[currentSong + 1].url);
			audioRef.current.pause();
			audioRef.current.load();
			audioRef.current.play();
			setCurrentSong(currentSong + 1);
		} else {
			setSongUrl(API_BASE_URL + jsonSongs[0].url);
			audioRef.current.pause();
			audioRef.current.load();
			audioRef.current.play();
			setCurrentSong(0);
		}
	}
	function skipBackward() {
		if (currentSong > 0) {
			setSongUrl(API_BASE_URL + jsonSongs[currentSong - 1].url);
			audioRef.current.pause();
			audioRef.current.load();
			audioRef.current.play();
			setCurrentSong(currentSong - 1);
		} else {
			setCurrentSong(jsonSongs.length - 1);
			setSongUrl(API_BASE_URL + jsonSongs[songs.length - 1].url);
			audioRef.current.pause();
			audioRef.current.load();
			audioRef.current.play();
			setCurrentSong(songs.length - 1);
		}
	}
	function mapSongs(songs) {
		let jsonMap = [];
		if (songs) {
			jsonMap = songs.map(function(song, index) {
				return (
					<li
						key={index}
						onClick={() =>
							playSong(index, API_BASE_URL + song.url)
						}>
						<button>{song.name}</button>
					</li>
				);
			});
		}
		return jsonMap;
	}

	function playPause() {
		if (isPlaying == true) {
			audioRef.current.pause();
			setPlayPauseButton(<i className="fas fa-pause-circle"></i>);
			setIsPlaying(false);
		} else {
			audioRef.current.play();
			setPlayPauseButton(<i className="fas fa-play"></i>);
			setIsPlaying(true);
		}
	}

	return (
		<div className="text-letf mt-5">
			<ol className="">{songs}</ol>
			<section className="">
				<div className="">
					<a onClick={() => skipBackward()}>
						<i className="fas fa-caret-square-left"></i>
					</a>
					<a onClick={() => playPause()}>{playPauseButton}</a>
					<a onClick={() => skipForward()}>
						<i className="fas fa-caret-square-right"></i>
					</a>
				</div>
			</section>
			<audio controls ref={audioRef}>
				<source src={songUrl} type="audio/ogg"></source>
			</audio>
		</div>
	);
}
