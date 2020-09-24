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
    const songs = await axios.get(`/api/songs`);
    const artists = await axios.get(`/api/artists`)
    const newArtists = artists.data.map(e => {return { id: e.id, name: e.name }})
    let selectSong = songs.data.map(e => { return { value: e.youtube_id, label: `${e.title} - ${e.ArtistId}`}} )
    let list = []
    for ( let song of selectSong){
      for (let artist of newArtists){
        if (Number(song.label.substr(song.label.indexOf(' - ') + 3, song.label.length)) === artist.id){
      
          let x = song.label.replace(artist.id, artist.name);
        list.push({value: song.value, label: x})
        }
      }
    }

setSongs(list)

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
    await axios.post(`/api/playlists`, {
    name: newName, 
    songs: newSongs, 
    cover_img: image,
    UserEmail: props.user.email,
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
