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
      setSongs(await (await axios.get(`/top_songs`)).data);
    }; fetchData();
   }, []); 

  const addPlaylist = async (name, songs, image) => {
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
 <form id="playlistForm" className="playlistForm" onSubmit={() => addPlaylist(name, song, image)}>
   <div>
    <label> Name of the Playlist: </label><br/>
    <input required type="text" defaultValue={name} onChange={insertName}/> <br/><br/>
    <label> Songs: </label><br/>
    <Select
    required
    maxMenuHeight={160}
    isMulti
    defaultValue={song}
    onChange={insertSongs}
    options={selectSong}>
    </Select><br/>
    <label> Cover image URL </label><br/>
    <input required type="text" defaultValue={image} onChange={insertImage}/><br/><br/>
    <input type='submit' style={{left:'400px'}} className="post" value="Post Playlist"/>
    </div>
    </form>

)}

  return (
<div> 
{form()}
<NavLink className="fa fa-arrow-left back" style={{left:"83px"}} to="/Playlists"></NavLink>
<p id="playlistError" style={{marginTop:"-2px", marginLeft:"120px", fontSize:'20px', color:"red"}}></p>
</div>
  );
  }

export default PostPlaylist;
