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

function validateDate(date) {
 if (/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(date))
  {
    return (true)
  }
    return (false)
}

  const addPlaylist = async (name, songs, image, created_at) => {
  let newSongs = []
  for (let song of songs){
  newSongs.push(song.value)
  }
  console.log(newSongs)
  const newCreated_at =  created_at.slice(0,10)
    if (!props.user) {
    return document.getElementById('playlistError').innerHTML = 'Only registered users can post new playlists to the website!';
    }
    if (!validateDate(newCreated_at)) {
    return document.getElementById('playlistError').innerHTML = "Release date form is invalid";
    }
    if(songs === null) {
    return document.getElementById('playlistError').innerHTML = "Select songs";
    }
  const newName = name.replace(`'`,`''`);
    try{
    await axios.post(`/playlist`, {
    name: newName, 
    songs: newSongs, 
    cover_img: image,
    created_at: newCreated_at,
    })
  document.getElementById("playlistForm").reset();
} catch (response){
   document.getElementById('playlistError').innerHTML = "Undetected error";
  }; 
};


function form(){
let name;
let image;
let created_at;
let song;

      function insertName(event) {
        name = event.target.value;
      }
      function insertImage(event) {
        image = event.target.value;
      }

      function insertRelease(event) {
        created_at = event.target.value;
      }

      function insertSongs(event) {
        song = event;
      }

let selectSong = songs.map(e => ({ value: e.youtube_id, label: `${e.title} - ${e.artist}` }))

return (
 <form id="playlistForm" className="playlistForm" onSubmit={() => addPlaylist(name, song, image, created_at)}>
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
    <label> Release date: </label><i className='tooltip fas fa-info'> <span className="tooltiptext">Y Y Y Y - M M - D D</span></i><br/>
    <input required type="text" defaultValue={created_at} onChange={insertRelease}/><br/><br/>
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
