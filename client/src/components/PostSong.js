import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Songs from './Songs.js';

function PostSong(props) {

  
function validateDate(date) {
 if (/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(date))
  {
    return (true)
  }
    return (false)
}

function validateTrack(track) {
   if (/^[1-9]\d{0,1}(?:\,\d{1,3})?$/.test(track))
  {
    return (true)
  }
    return (false)
}

    const addSong = async (title, length, youtube_id, artist, album, track_number, lyrics, created_at) => {
  const newCreated_at = created_at.slice(0,10)
  const newLyrics = lyrics.replace(`'`,`''`);
    if (validateDate(newCreated_at)) {
    if(validateTrack(track_number)) {
    try{
    await axios.post(`/song`, {
    title: title, 
    length: length, 
    youtube_id: youtube_id, 
    artist: artist, 
    album: album, 
    track_number: track_number, 
    lyrics: newLyrics, 
    created_at: newCreated_at,
    })
  document.getElementById("songForm").reset();
} catch (response){
   document.getElementById('songError').innerHTML = "Artist unrecognized / song already exists ";
  }; 
   } else {
  document.getElementById('songError').innerHTML = "Track number field must be a number";
  }
} else {
   document.getElementById('songError').innerHTML = "Release date form is invalid";
  }

};


function form(){
let title;
let youtube_id;
let length;
let artist;
let album;
let track_number;
let lyrics;
let created_at


      function insertTitle(event) {
        title = event.target.value;
      }
      function insertLength(event) {
        length = event.target.value;
      }
      function insertYoutube(event) {
        youtube_id = event.target.value;
      }

      function insertArtist(event) {
        artist = event.target.value;
      }
      function insertAlbum(event) {
        album = event.target.value;
      }
      function insertTrack(event) {
        track_number = event.target.value;
      }

      function insertLyrics(event) {
        lyrics = event.target.value;
      }
      function insertRelease(event) {
        created_at = event.target.value;
      }

return (
 <form id="songForm" className="songSubmit" onSubmit={() => addSong(title, length, youtube_id, artist, album, track_number, lyrics, created_at)}>
   <div>
    <label> Name of the song: </label><br/>
    <input required type="text" id="title" defaultValue={title} onChange={insertTitle}/> <br/><br/>
<label>Youtube ID: </label><i class='tooltip fas fa-info'> <span class="tooltiptext">youtube.com/watch?v= (Youtube_ID)</span></i><br/>
    <input required type="text" id="youtube_id" defaultValue={youtube_id} onChange={insertYoutube}/><br/><br/>
    <label> Length: </label><br/>
    <input required type="text" id="length" defaultValue={length} onChange={insertLength}/> <br/><br/>
    <label>Artist: </label><br/>
    <input required type="text" id="artist" defaultValue={artist} onChange={insertArtist}/><br/><br/>
    <label> Album: </label><br/>
    <input required type="text" id="album" defaultValue={album} onChange={insertAlbum}/> <br/><br/>
    <label> Track number: </label><br/>
    <input required type="text" id="track_number" defaultValue={track_number} onChange={insertTrack}/><br/><br/>
     </div>
     <div>
        <label> Lyrics: </label><br/>
    <textarea rows="11" required type="text" id="lyrics" defaultValue={lyrics} onChange={insertLyrics}/> <br/><br/>
    <label> Release date: </label><i class='tooltip fas fa-info'> <span class="tooltiptext">Y Y Y Y - M M - D D</span></i><br/>
    <input required type="text" id="created_at" defaultValue={created_at} onChange={insertRelease}/><br/><br/>
    <input type='submit' id="postSong"/>
    </div>
    </form>

)}

  return (
<div> 
{form()}
<HashRouter>
<NavLink className="fa fa-arrow-left back" to="/Songs"></NavLink>
<Route path="/Songs" component={() => <Songs/>}/>
</HashRouter>
<p id="songError" style={{marginTop:"0px", marginLeft:"40px", fontSize:'20px', color:"red"}}></p>
</div>
  );
  }

export default PostSong;
