/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect} from 'react';
import axios from 'axios';
import {
  NavLink,
} from "react-router-dom";
import Select from 'react-select';
import UserContext from '../UserContext'
import network from '../Network.js';
import { useStateIfMounted } from "use-state-if-mounted";

function PostPlaylist(props) {
const [songs, setSongs] = useStateIfMounted([])

const user = useContext(UserContext)

  useEffect(() => {
    const fetchData = async () => {
    const songs = await axios.get(`/api/songs`);
    let selectSong = songs.data.map(e => { return { value: e.youtube_id, label: `${e.title} - ${e.Artist.name}`}} )
setSongs(selectSong)

    }; fetchData();
   }, []); 

  const addPlaylist = async (event, name, songs, image) => {
  event.preventDefault();
  const date = new Date();
  let regex = /'/gi
  let newSongs = []
  for (let song of songs){
  newSongs.push(song.value)
  }

    if(!songs) {
    return document.getElementById('playlistError').innerHTML = "Select songs";
    }
  const newName = name.replace(regex,`''`);
    try{
    await network.post(`/api/playlists`, {
    name: newName, 
    username: user.username,
    songs: JSON.stringify(newSongs), 
    cover_img: image,
    created_at: date.toISOString().substring(0, 10)
    })
  document.getElementById("playlistForm").reset();
} catch (response){
document.getElementById('playlistError').innerHTML = 'Only registered users can post new playlists to the website!';
  }; 
};


function form(){
let name;
let image;
let song;

      function insertName(event) {
        name = event.target.value;
      }
      function insertImage(event) {
        image = event.target.value;
      }

      function insertSongs(event) {
        song = event;
        console.log(song)
      }

let selectSong = songs


return (
 <form style={{marginTop:"150px"}} id="playlistForm" onSubmit={(event) => addPlaylist(event, name, song, image)}>
   <div>
    <label> Name of the Playlist: </label><br/>
    <input id="playlist_name" required type="text" defaultValue={name} onChange={insertName}/> <br/><br/>
    <br/>
    <label> Songs: </label><br/>
    <Select
    required
    maxMenuHeight={160}
    isMulti
    defaultValue={song}
    onChange={insertSongs}
    options={selectSong}>
    </Select><br/>
    <br/>
    <label> Cover image URL </label><br/>
    <input id="artist_img" required type="text" defaultValue={image} onChange={insertImage}/><br/><br/>
  <br/>
    <input type='submit' className="post" value="Post Playlist"/>
   <NavLink  style={{marginTop:'-50px'}} className="fa fa-arrow-left back"  to="/Playlists"></NavLink>
    </div>
    </form>

)}

  return (
<div className="playlistForm"> 
{form()}<p id="playlistError" style={{marginLeft:"120px", fontSize:'20px', color:"red"}}></p>
</div>
  );
  }

export default PostPlaylist;
