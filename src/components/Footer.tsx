import React, { useState, useEffect } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { IoPlaySkipForward, IoPlaySkipBack, IoPauseCircle } from 'react-icons/io5'
import useAuthStore from "../context/zustand";


interface SpotifyPlayerProps {
  token: string;
  uris: ["spotify:track:2z772Yunx3jUbh6YLY8HU2", "spotify:track:6ivUoajqXRNVIyEGhRkucw"]; // Array of track URIs to play
}



const Footer: React.FC<SpotifyPlayerProps> = ({ uris }) => {
  const [player, setPlayer] = useState<Spotify.SpotifyPlayer | null>(null);
  const [paused, setPaused] = useState(false)
  const [is_active, setActive] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState({ uris })
  const {currentTrack} = useAuthStore()

  let Spotifyplayer: Spotify.SpotifyPlayer | null = null;

  // const handlePlay = () => {
  //   if (player) {
  //     player.resume().then(() => {
  //       console.log("Resumed playback");
  //     });
  //   }
  // };

  // const handlePause = () => {
  //   if (player) {
  //     player.pause().then(() => {
  //       console.log("Paused playback");
  //     });
  //   }
  // };
  // const handleNext = () => {
  //   if (player) {
  //     player.nextTrack().then(() => {
  //       console.log("Skipped to the next track");
  //     });
  //   }
  // };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    const token = localStorage.getItem('access_token')
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {

      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });
      setPlayer(player);
      console.log({ player })

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);

        // player.togglePlay({
        //   uris: [currentTrack]
        // }).then(() => {
        //   console.log('started playback')
        // })
        //   .catch(e => {
        //     console.error('error starting playback', e)
        //   })
      });
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });
      player.addListener("initialization_error", ({ message }) => {
        console.error("Initialization Error:", message);
      });
      player.addListener("authentication_error", ({ message }) => {
        console.error("Authentication Error:", message);
      });
      player.addListener("account_error", ({ message }) => {
        console.error("Account Error:", message);
      });
      player.addListener("playback_error", ({ message }) => {
        console.error("Playback Error:", message);
      });
      player.addListener('player_state_changed', (state => {
        if (!state) {
          return;
        }
        setCurrentTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then(state => {
          (!state) ? setActive(false) : setActive(true)
        });
      }));

      player.connect().then((success) => {
        if (success) {
          console.log("Connected to spotify player!")
        }
      })

    };
  }, [uris]);



  return (
    <div className="footer d-flex  justify-content-between mb-4">
      {/* <div className="h4 text-light">This is the footer</div> */}
      <div className="footer-left">
        <p>song info</p>
      </div>
      <div className="footer-center">
        <IoPlaySkipBack className="footer-icon m-2" size={50} onClick={()=> player?.previousTrack()}/>
        <AiFillPlayCircle className="footer-icon m-2" size={50} onClick={() => player?.togglePlay({currentTrack})} />
        <IoPlaySkipForward className="footer-icon m-2" size={50} onClick={()=>player?.nextTrack()}/>
      </div>
      <div className="footer-right">
        <p>volume</p>
      </div>
    </div>
  )
}

export default Footer