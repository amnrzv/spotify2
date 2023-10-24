import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.js";
import {
  getTopTracks,
  getTopArtists,
  getUserPlaylists,
} from "../utils/GetUserInfoFunctions.js";
import TestCard from "../components/TestCard.js";
import SongRow from "../components/SongRow.js";
import { Artist, Track } from "@spotify/web-api-ts-sdk";

const AccountPage = () => {
  const [userProfile, setUserProfile] = useState<Profile>();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState();
  type Profile = {
    display_name: string;
    id: string;
    country: string;
    images: [];
    followers: number;
  };

  async function getProfileData() {
    const accessToken = localStorage.getItem("access_token");
    //get user data:
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    const userData = await response.json();
    console.log({userData});
    setUserProfile(userData);

    const topArtists = await getTopArtists();
    setArtists(topArtists);

    const topTracks = await getTopTracks();
    setTracks(topTracks);

    const userPlaylists = await getUserPlaylists(accessToken, userProfile.id);
    setPlaylists(userPlaylists);
  }

  useEffect(() => {
    getProfileData();
    console.log({userProfile});
    console.log("playlists", playlists);
  }, []);

  console.log("tracks", tracks);
  console.log("artists", artists);

  return !userProfile ? (
    <h1>Loading...</h1>
  ) : (
    <div className="container-lg border border-primary">
      <div className="row">
        <div className="sidebar col bg-dark w-30">
          {!playlists ? (
            <h3 className="text-light">Loading playlists...</h3>
          ) : (
            <Sidebar playlists={playlists} />
          )}
          {/* <Sidebar playlists={playlists}/> */}
        </div>
        <div className="profile bg-dark col container-lg border border-primary">
          <img
            src={userProfile.images[1]?.url}
            className="rounded-circle shadow-4-strong"
          />
          <h1 className="text-light">{userProfile?.display_name}</h1>
          <div className="tracks-container container text-light border border-secondary">
            <h3>Top tracks</h3>
            <div className="d-flex flex-column">
              {tracks?.map((track) => (
                <div key={track.id}>
                  <SongRow track={track} />
                </div>
              ))}
            </div>
          </div>
          <div className="artists-container text-light border border-secondary container">
            <h3 className="col">Top artists</h3>
            <div className="row">
              {artists?.map((artist) => (
                <div key={artist.id} className="col">
                  <TestCard props={artist} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
