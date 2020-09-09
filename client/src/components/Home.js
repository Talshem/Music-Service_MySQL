import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home(props) {
const [songs, setSongs] = useState([]);
const [albums, setAlbums] = useState([]);
const [artists, setArtists] = useState([]);
const [playlists, setPlaylists] = useState([]);


useEffect(() => {
    const fetchData = async () => {
      const songs = await (await axios.get(`/top_songs`)).data.splice(0, 20);
      const albums = await (await axios.get(`/top_albums`)).data.splice(0, 20);
      const artists = await (await axios.get(`/top_artists`)).data.splice(0, 20);
      const playlists = await (await axios.get(`/top_playlists`)).data.splice(0, 20);
      makeLists(songs, albums, artists, playlists)
    }; fetchData();
   }, [])

const makeLists = (songs, albums, artists, playlists) => {
let sArray = songs.map(e => {
return (
<li key={e.id}>
<p>{e.title}</p>
<iframe width="150" height="150" src={e.youtube_link}>
</iframe>
</li>
)}
)
let alArray = albums.map(e => {
return (
<li key={e.id}>
<p>{e.name}</p>
<img width="150" height="150" src={e.cover_img}>
</img>
</li>
)}
)
let arArray = artists.map(e => {
return (
<li key={e.id}>
<p>{e.name}</p>
<img width="150" height="150" src={e.cover_img}>
</img>
</li>
)}
)
let pArray = playlists.map(e => {
return (
<li key={e.id}>
<p>{e.name}</p>
<img width="150" height="150" src={e.cover_img}>
</img>
</li>
)}
)
setSongs(sArray)
setAlbums(alArray)
setArtists(arArray)
setPlaylists(pArray)
}



  return (
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
  );
}

export default Home;
