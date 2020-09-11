/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import PostSong from './PostSong.js';

function Songs(props) {
const [list, setList] = useState([])
const [search, setSearch] = useState('')
const [preferences, setPreferences] = useState([])
const [admin, setAdmin] = useState(0)
const [toggleDelete, setToggleDelete] = useState(false)

useEffect(() => {
if(props.user){
let pref = props.user.preferences;
let admin = props.user.is_admin;
setPreferences(JSON.parse(pref))
setAdmin(admin)
}}, [props.user])

useEffect(() => {
    const fetchData = async () => {
      const songs = await (await axios.get(`/top_songs`)).data;
      let list = songs.filter(e => e.title.toUpperCase().includes(search.toUpperCase()))
      makeSongs(list) 
    }; fetchData();
   }, [search, preferences, toggleDelete])

const deleteSong = async (e) => {
const newId = e.youtube_id.replace(`'`,`''`);
await axios.delete(`/song/${newId}`);
setToggleDelete(!toggleDelete)
};

const playCount = async (e) => {
await axios.put(`/count`, {
song_id: e.youtube_id,
count: e.play_count + 1,
});
};

const isLiked = async (e) => {
if (preferences.includes(e.youtube_id)){
const { data } = await axios.put(`/unlike`, {
preferences: preferences,
user: props.user.email,
song_id: e.youtube_id,
});
let x = JSON.parse(data[0].preferences)
setPreferences(x)
} else {
const { data } = await axios.put(`/like`, {
user: props.user.email,
song_id: e.youtube_id,
});
let x = JSON.parse(data[0].preferences)
setPreferences(x)
}}


const makeSongs = (songs) => {
let array = songs.map(e => {
const heart = preferences.includes(e.youtube_id) ? <i id={`${e.youtube_id}like`} className="fas fa-heart"></i> : <i id={`${e.youtube_id}like`} className="far fa-heart"></i>
const like = props.user ? heart :  '';

const deleteButton = <button onClick={() => deleteSong(e)} className="deleteButton">Delete</button>;

const adminDelete = admin === 1 ? deleteButton : '';

return (
<li key={e.youtube_id} className="grid-item">
<p><span style={{cursor:'pointer'}} onClick={() => isLiked(e)}>{like}</span> {e.title}</p>
<YouTube className="video" onPlay={() => playCount(e)} videoId={e.youtube_id} id="video" opts={{width:"150",height:"150"}}/>
{adminDelete}
</li>
)}
)
setList(array)
}


  return (
<div> 
<p className='listTitle'>Songs</p>
<input className="filterList" placeholder="Search..." onChange={(event) => setSearch(event.target.value)} /> 
<HashRouter>
{props.user ? <NavLink className="fa fa-plus-square-o add" to="/PostSong"></NavLink> : ''}
<Route path="/PostSong" component={() => <PostSong/>}/>
</HashRouter>
<ul className="grid-container">
{list}
</ul>


</div>
  );
}

export default Songs;
