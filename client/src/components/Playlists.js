/* eslint-disable react-hooks/exhaustive-deps */
  
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  NavLink,
} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";
import generator from 'generate-password'

function Playlists(props) {
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
setUser(user)
let isAdmin = props.user.is_admin;
setAdmin(isAdmin)
}}, [props.user])


useEffect(() => {
    const fetchData = async () => {
      let x = JSON.parse(preferences)
      const playlists = await (await axios.get(`/top_playlists?name=${search}`)).data;
      let list = playlists.filter(e => e.name.toUpperCase().includes(search.toUpperCase()))
      if (!favorites) {
      makePlaylists(list) 
      } else {
      let favoriteList = list.filter(e => x.includes(`playlist: ${e.id}`))
      makePlaylists(favoriteList)
      }
      setLoading(false)
    }; fetchData();
   }, [user, favorites, search, toggleDelete, preferences])

const deletePlaylist = async (e) => {
await axios.delete(`/playlist/${e.id}`);
setToggleDelete(!toggleDelete)
};

const isLiked = async (e) => {
let x = JSON.parse(preferences)
if (preferences.includes(`playlist: ${e.id}`)){
await axios.put(`/playlist/like`, {
toggle: 'unlike',
is_liked: e.is_liked - 1,
preferences: x,
user: props.user.email,
id: e.id,
});
setTogglePref(!togglePref)
} else {
await axios.put(`/playlist/like`, {
toggle: 'like',
is_liked: e.is_liked + 1,
user: props.user.email,
id: e.id,
});
setTogglePref(!togglePref)
}
}


const makePlaylists = (playlists) => {

let x = JSON.parse(preferences)

let array = playlists.map(e => {
const heart = x.includes(`playlist: ${e.id}`) ? <i className="fas fa-heart"></i> : <i className="far fa-heart"></i>
const like = props.user ? heart :  '';

const deleteButton = <button onClick={() => deletePlaylist(e)} className="deleteButton">Delete</button>;
const adminDelete = admin === 1 || e.user === user ? deleteButton : '';

return (
<li key={e.name} className="grid-item">
<p><span style={{cursor:'pointer'}} onClick={() => isLiked(e)}>{like} </span>
<NavLink className="navTo" to="/PlaylistData" onClick={() => props.playlist(e)}>
{e.name}
</NavLink>
</p>
<NavLink className="navTo" to="/PlaylistData" onClick={() => props.playlist(e)}>
<img alt={e.name} width="150" height="150" src={e.cover_img}></img>
</NavLink>
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
  top:200px;
  left: 375px;
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
<p className='listTitle'>Playlists</p>
<input className="filterList" placeholder="Search..." onChange={(event) => setSearch(event.target.value)} /> 
<NavLink className="fa fa-plus-square-o add" to="/PostPlaylist"></NavLink>
{props.user ? <i className="filterFavorites" onClick={() => setFavorites(!favorites)}>{filterFavorites}</i> : ''}
<ul className="grid-container">
{list}
</ul>
</div>
  );
}


export default Playlists;