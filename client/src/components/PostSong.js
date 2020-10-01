import React, { useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {
  NavLink,
} from "react-router-dom";
import Select from 'react-select';
import UserContext from '../UserContext'
import network from '../Network.js';

function PostSong(props) {
const [albums, setAlbums] = useState([]);
const [artists, setArtists] = useState([]);

const [selectAlbum, setSelectAlbum] = useState(undefined)
const [title, setTitle] = useState(undefined)
const [length, setLength] = useState(undefined)
const [youtube_id, setYoutube_id] = useState(undefined)
const [artist, setArtist] = useState(undefined)
const [album, setAlbum] = useState(undefined)
const [lyrics, setLyrics] = useState(undefined)
const [track_number, setTrack_number] = useState(undefined)
const [created_at, setCreated_at] = useState(undefined)

const user = useContext(UserContext)

  useEffect(() => {
    const fetchData = async () => {
      setAlbums(await (await axios.get(`/api/albums`)).data);
      setArtists(await (await axios.get(`/api/artists`)).data);
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

const addSong = async (event, title, length, youtube_id, artist, album, track_number, lyrics, created_at) => {
event.preventDefault();

    const date = new Date();
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
  const newArtist = artist.label.substr(0, artist.label.indexOf(' - ') -1).replace(regex,`''`);
  const newAlbum = album.label.replace(regex,`''`);
  
    if (!validateLength(length)) {
    return document.getElementById('songError').innerHTML = 'Length form is invalid';
    }
    if(!validateTrack(track_number)) {
    return document.getElementById('songError').innerHTML = "Track number field must be a 2-digit number";
    }

    let occupied = await axios.get(`api/songs/${youtube_id}`)  
    if(occupied.data){
    return document.getElementById('songError').innerHTML = 'This song was already posted';
    }

    try{
    await network.post(`/api/songs`, {
    title: newTitle, 
    length: length, 
    youtube_id: youtube_id, 
    ArtistId: artist.value, 
    AlbumId: album.value, 
    artist_name: newArtist, 
    album_name: newAlbum, 
    track_number: track_number, 
    lyrics: newLyrics, 
    created_at: newCreated_at,
    Username: user.username,
    upload_at: date.toISOString().substring(0, 10)
    }
    )
  window.location.reload(false);
} catch (response){
 document.getElementById('songError').innerHTML = 'Only registered users can post new songs to the website';
  }; 
};

function form(){

      function insertTitle(event) {
        setTitle(event.target.value);
      }
      function insertLength(event) {
        setLength(event.target.value);
      }
      function insertYoutube(event) {
        setYoutube_id(event.target.value);
      }
      function insertTrack(event) {
        setTrack_number(event.target.value);
      }

      function insertLyrics(event) {
        setLyrics(event.target.value);
      }
      function insertRelease(event) {
        setCreated_at(event.target.value);
      }
      function insertArtist(event) {
       let x = event.label
       setArtist(event);
       setSelectAlbum(albumList.filter(e => e.label.includes(x)));
      }
       function insertAlbum(event) {
        setAlbum(event);
      }
console.log(albums)
let selectArtist = artists.map(e => ({ value: e.id, label: e.name }))
let albumList = albums.map(e => ({value: e.id, label: `${e.name} - ${e.Artist.name}` }))

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
 <form id="songForm" className="songForm" onSubmit={(event) => addSong(event, title, length, youtube_id, artist, album, track_number, lyrics, created_at)}>
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
    <NavLink style={{marginTop:"0px"}} className="fa fa-arrow-left back" to="/Songs"> </NavLink>
     </div>
     <div>
    <label> Lyrics: </label><br/>
    <textarea rows="12" required type="text" defaultValue={lyrics} onChange={insertLyrics}/> <br/><br/>
    <label> Release date: </label><br/>
    <input max={today} style={{height:"32px"}} id="song_date" required type="date" defaultValue={created_at} onChange={insertRelease}/><br/><br/>
    <input style={{width:"550px"}} type='submit' className="post" value="Post Song"/>
    </div>
    </form>

)}

  return (
<div> 
{form()}
<p id="songError" style={{marginTop:"10px", marginLeft:"20px", fontSize:'20px', color:"red"}}></p>
</div>
  );
  }

export default PostSong;
