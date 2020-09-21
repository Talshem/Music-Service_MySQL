import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  NavLink,
} from "react-router-dom";
import Select from 'react-select';

function PostPlaylist(props) {
const [songs, setSongs] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setSongs(await (await axios.get(`/top_songs`)).data[0]);
    }; fetchData();
   }, []); 

  const addPlaylist = async (event, name, songs, image) => {
  event.preventDefault();
  let regex = /'/gi
  let newSongs = []
  for (let song of songs){
  newSongs.push(song.value)
  }
    if (!props.user) {
    return document.getElementById('playlistError').innerHTML = 'Only registered users can post new playlists to the website!';
    }
    if(!songs) {
    return document.getElementById('playlistError').innerHTML = "Select songs";
    }
  const newName = name.replace(regex,`''`);
    try{
    await axios.post(`/playlist`, {
    name: newName, 
    songs: newSongs, 
    cover_img: image,
    user: props.user.email,
    user_name: props.user.username
    })
  document.getElementById("playlistForm").reset();
} catch (response){
   document.getElementById('playlistError').innerHTML = "Undetected error";
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
      }

let selectSong = songs.map(e => ({ value: e.youtube_id, label: `${e.title} - ${e.artist}` }))

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
