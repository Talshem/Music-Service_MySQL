/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import {
  NavLink,
  HashRouter
} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";
import generator from 'generate-password'

function Songs(props) {
const [list, setList] = useState([])
const [search, setSearch] = useState('')
const [preferences, setPreferences] = useState("[]")
const [admin, setAdmin] = useState(0)
const [user, setUser] = useState(generator.generate({
    length: 20,
    numbers: true
}))
const [toggleDelete, setToggleDelete] = useState(false)
const [favorites, setFavorites] = useState(false)
const [togglePref, setTogglePref] = useState(false)
const [loading, setLoading] = useState(true);

useEffect(() => {
const getPreferences = async () => {
try {
const { data } = await axios.get(`/preferences/${props.user.email}`)
setPreferences(data[0].preferences)
} catch {
return
}
}; getPreferences();
}, [togglePref])

useEffect(() => {
if(props.user){
let user = props.user.email;
let isAdmin = props.user.is_admin;
setUser(user)
setAdmin(isAdmin)
}}, [props.user])

useEffect(() => {
    const fetchData = async () => {
      let x = JSON.parse(preferences)
      const songs = await (await axios.get(`/top_songs?name=${search}`)).data;
      let list = songs.filter(e => e.title.toUpperCase().includes(search.toUpperCase()))
      if (!favorites) {
      makeSongs(list) 
      } else {
      let favoriteList = list.filter(e => x.includes(`song: ${e.youtube_id}`))
      makeSongs(favoriteList)
      }
      setLoading(false)
    }; fetchData();
   }, [user, favorites, search, toggleDelete, preferences])

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
let x = JSON.parse(preferences)
if (x.includes(`song: ${e.youtube_id}`)){
await axios.put(`/song/like`, {
toggle: 'unlike',
is_liked: e.is_liked - 1,
preferences: x,
user: props.user.email,
youtube_id: e.youtube_id,
});
setTogglePref(!togglePref)
} else {
await axios.put(`/song/like`, {
toggle: 'like',
is_liked: e.is_liked + 1,
user: props.user.email,
youtube_id: e.youtube_id,
});
setTogglePref(!togglePref)
}
}


const makeSongs = (songs) => {

let x = JSON.parse(preferences);

let array = songs.map(e => {
const heart = x.includes(`song: ${e.youtube_id}`) ? <i className="fas fa-heart"></i> : <i className="far fa-heart"></i>
const like = props.user ? heart :  '';

const deleteButton = <button style={{marginTop:"20px"}} onClick={() => deleteSong(e)} className="deleteButton">Delete</button>;
const adminDelete = admin === 1 || e.user === user ? deleteButton : '';

return (
<li key={e.youtube_id} className="grid-item">
<p><span style={{cursor:'pointer'}} onClick={() => isLiked(e)}>{like} {" "} </span>
<NavLink className="navTo" to="/SongData" onClick={() => props.song(e)}>{e.title}</NavLink>
</p>
<YouTube className="video" onPlay={() => playCount(e)} videoId={e.youtube_id} id="video" opts={{width:"150",height:"150"}}/>
{adminDelete}
</li>
)}
)
setList(array)
}

const filterFavorites = favorites ?  <i className="fas fa-heart"></i> : <i className="far fa-heart"></i>

const override =`
  display: block;
  position:absolute;
  width:200px;
  height:200px;
  left: 375px;
    top:200px;
`;

  return (
<div> 
<LoadingOverlay
  active={loading}
  spinner={<ClipLoader css={override} color="white" style={{zIndex:1010}} size={150}/>}
  >
  {loading ?
  <p style={{left:"0", top:"-15px", zIndex:"1007", background:"rgb(0,0,0,0.5)", position:"fixed", width:"100vw", height:"100vh"}}></p> : ''
  }
  </LoadingOverlay>
<p className='listTitle'>Songs</p>
<input className="filterList" placeholder="Search..." onChange={(event) => setSearch(event.target.value)} /> 
<HashRouter>
<NavLink className="fa fa-plus-square-o add" to="/PostSong"></NavLink>
</HashRouter>
{props.user ? <i className="filterFavorites" onClick={() => setFavorites(!favorites)}>{filterFavorites}</i> : ''}
<ul className="grid-container">
{list}
</ul>
</div>
  );
}

export default Songs;
