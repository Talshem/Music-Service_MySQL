/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import {
  NavLink,
} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";

function Home(props) {
const [songs, setSongs] = useState([]);
const [albums, setAlbums] = useState([]);
const [artists, setArtists] = useState([]);
const [playlists, setPlaylists] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchData = async () => {
      const songs = await axios.get(`/top_songs`);
      const albums = await axios.get(`/top_albums`);
      const artists = await axios.get(`/top_artists`);
      const playlists = await axios.get(`/top_playlists`);
      console.log(songs)
      makeLists(songs.data, albums.data, artists.data, playlists.data)
      setLoading(false)
    }; fetchData();
   }, [])

const playCount = async (e) => {
await axios.put(`/count`, {
song_id: e.youtube_id,
count: e.play_count + 1,
});
};


const makeLists = (songs, albums, artists, playlists) => {
let sArray = songs.map(e => {
return (
<li key={e.youtube_id}>
<p>
<NavLink className="navTo" to="/SongData" onClick={() => props.song(e)}>{e.title}</NavLink>
</p>
<YouTube className="video" onPlay={() => playCount(e)}videoId={e.youtube_id} id="video" opts={{width:"150",height:"150"}}/>
<br/><br/>
</li>
)}
)

let alArray = albums.map(e => {
return (
<li key={e.name}>
<p>{e.name}</p>
<img alt={e.name} width="150" height="150" src={e.cover_img}>
</img>
<br/><br/>
</li>
)}
)
let arArray = artists.map(e => {
return (
<li key={e.name}>
<p>{e.name}</p>
<img alt={e.name} width="150" height="150" src={e.cover_img}>
</img>
<br/><br/>
</li>
)}
)
let pArray = playlists.map(e => {
return (
<li key={e.name}>
<p>{e.name}</p>
<img alt={e.name} width="150" height="150" src={e.cover_img}>
</img>
<br/><br/>
</li>
)}
)
setSongs(sArray)
setAlbums(alArray)
setArtists(arArray)
setPlaylists(pArray)
}

const override =`
  display: block;
  position:absolute;
  width:200px;
  height:200px;
  left: 375px;
`;

  return (
    <div>
<LoadingOverlay
  active={loading}
  spinner={<ClipLoader css={override} color="white" style={{zIndex:1010}} size={150}/>}
  >
  {loading ?
  <p style={{left:"0", top:"-15px", zIndex:"1007", background:"rgb(0,0,0,0.5)", position:"fixed", width:"100vw", height:"100vh"}}></p> : ''
  }
  </LoadingOverlay>

<h3>Hello, {props.user ? props.user.name : 'Guest'}</h3>
<div className="lists"> 
<div >
<h4> Top Songs </h4> 
<ul className="songs" >{songs}</ul>
</div>


<div>  
<h4> Top Albums </h4>  
<ul className="albums">{albums}</ul>
</div>


<div >
<h4>Top Artists</h4>
<ul className="artists">{artists}</ul>
</div>

<div>
<h4>Top Playlists</h4>
<ul className="playlists">{playlists}</ul>
</div>
</div>
</div>
  );
}

export default Home;
