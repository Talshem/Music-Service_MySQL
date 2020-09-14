import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  NavLink,
} from "react-router-dom";
import Select from 'react-select';

function PostSong(props) {
const [albums, setAlbums] = useState([]);
const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setAlbums(await (await axios.get(`/top_albums`)).data);
      setArtists(await (await axios.get(`/top_artists`)).data);
    }; fetchData();
   }, []);


function validateTrack(track) {
   if (/^[1-9]\d{0,1}(?:,\d{1,3})?$/.test(track))
  {
    return (true)
  }
    return (false)
}

function validateLength(length) {
if (/^([0-5]?[0-9]|2[0-3]):[0-5][0-9]$/.test(length)) {
    return (true)
  }
    return (false)
}

  const addSong = async (title, length, youtube_id, artist, album, track_number, lyrics, created_at) => {
    let regex = /'/gi
    let enter = /\n/gi

    if(!artist) {
    return document.getElementById('songError').innerHTML = "Select an artist";
    }
    if(!album) {
    return document.getElementById('songError').innerHTML = "Select an album";
    }
  const newCreated_at = created_at.slice(0,10)
  const newLyrics = lyrics.replace(regex,`''`).replace(enter,`&&`);
  const newTitle = title.replace(regex,`''`);
  const newArtist = artist.value.replace(regex,`''`);
  const newAlbum = album.value.replace(regex,`''`);

    if (!props.user) {
    return document.getElementById('songError').innerHTML = 'Only registered users can post new songs to the website';
    }
    if (!validateLength(length)) {
    return document.getElementById('songError').innerHTML = 'Length form is invalid';
    }
    if(!validateTrack(track_number)) {
    return document.getElementById('songError').innerHTML = "Track number field must be a 2-digit number";
    }
    if(!album.label.includes(artist.value)) {
    return document.getElementById('songError').innerHTML = "Album and song must be of the same artist";
    }


    try{
    await axios.post(`/song`, {
    title: newTitle, 
    length: length, 
    youtube_id: youtube_id, 
    artist: newArtist, 
    album: newAlbum, 
    track_number: track_number, 
    lyrics: newLyrics, 
    created_at: newCreated_at,
    user: props.user.email,
    })
  document.getElementById("songForm").reset();
  document.getElementById('songError').innerHTML = "";
} catch (response){
   document.getElementById('songError').innerHTML = "Song already exists";
  }; 
};


function form(){
let title;
let youtube_id;
let length;
let track_number;
let lyrics;
let created_at;
let artist;
let album;

      function insertTitle(event) {
        title = event.target.value;
      }
      function insertLength(event) {
        length = event.target.value;
      }
      function insertYoutube(event) {
        youtube_id = event.target.value;
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
      function insertArtist(event) {
        artist = event;
      }
       function insertAlbum(event) {
        album = event;
      }

let selectArtist = artists.map(e => ({ value: e.name, label: e.name }))

let selectAlbum = albums.map(e => ({value: e.name, label: `${e.name} - ${e.artist}` }))

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
 if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
today = yyyy+'-'+mm+'-'+dd;

return (
 <form id="songForm" className="songForm" onSubmit={() => addSong(title, length, youtube_id, artist, album, track_number, lyrics, created_at)}>
   <div>
    <label> Name of the song: </label><br/>
    <input id="song_img" required type="text" defaultValue={title} onChange={insertTitle}/> <br/><br/>
<label>Youtube ID: </label><i className='tooltip fas fa-info'> <span className="tooltiptext">youtube.com/watch?v= (Youtube_ID)</span></i><br/>
    <input id="song_id" required type="text" defaultValue={youtube_id} onChange={insertYoutube}/><br/><br/>
    <label> Length: </label><i className='tooltip fas fa-info'> <span className="tooltiptext">M M : S S</span></i><br/>
    <input id="song_length" required type="text" defaultValue={length} onChange={insertLength}/> <br/><br/>
    <label>Artist: </label><i className='tooltip fas fa-info'> <span className="tooltiptext">You can only post albums of uploaded artists</span></i><br/>
    <Select required maxMenuHeight={160}
    defaultValue={artist}
    onChange={insertArtist}
    options={selectArtist}>
    </Select><br/>
    <label> Album: </label><i className='tooltip fas fa-info'> <span className="tooltiptext">You can only post songs of uploaded albums</span></i><br/>
    <Select required maxMenuHeight={160}
    defaultValue={album}
    onChange={insertAlbum}
    options={selectAlbum}>
    </Select><br/>
    <label> Track number: </label><br/>
    <input id="song_track" required type="text" defaultValue={track_number} onChange={insertTrack}/><br/><br/>
     </div>
     <div>
    <label> Lyrics: </label><br/>
    <textarea rows="12" required type="text" defaultValue={lyrics} onChange={insertLyrics}/> <br/><br/>
    <label> Release date: </label><br/>
    <input max={today} style={{height:"32px"}} id="song_date" required type="date" defaultValue={created_at} onChange={insertRelease}/><br/><br/>
    <input type='submit' className="post" value="Post Song"/>
    </div>
    </form>

)}

  return (
<div> 
{form()}
<NavLink className="fa fa-arrow-left back" to="/Songs"></NavLink>
<p id="songError" style={{marginTop:"10px", marginLeft:"20px", fontSize:'20px', color:"red"}}></p>
</div>
  );
  }

export default PostSong;
