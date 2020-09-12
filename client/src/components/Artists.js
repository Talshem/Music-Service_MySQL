/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  NavLink,
  HashRouter
} from "react-router-dom";

function Artists(props) {
const [list, setList] = useState([])
const [search, setSearch] = useState('')
const [preferences, setPreferences] = useState("[]")
const [admin, setAdmin] = useState(0)
const [toggleDelete, setToggleDelete] = useState(false)
const [favorites, setFavorites] = useState(false)
const [togglePref, setTogglePref] = useState(false)

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
let isAdmin = props.user.is_admin;
setAdmin(isAdmin)
}}, [props.user])

useEffect(() => {
    const fetchData = async () => {
      let x = JSON.parse(preferences)
      const artists = await (await axios.get(`/top_artists`)).data;
      let list = artists.filter(e => e.name.toUpperCase().includes(search.toUpperCase()))
      if (!favorites) {
      makeArtists(list) 
      } else {
      let favoriteList = list.filter(e => x.includes(`artist: ${e.name}`))
      makeArtists(favoriteList)
      }
    }; fetchData();
   }, [favorites, search, toggleDelete, preferences])

const deleteArtist = async (e) => {
const newName = e.name.replace(`'`,`''`);
await axios.delete(`/artist/${newName}`);
setToggleDelete(!toggleDelete)
};

const isLiked = async (e) => {
let x = JSON.parse(preferences)
if (x.includes(`artist: ${e.name}`)){
await axios.put(`/artist/like`, {
toggle: 'unlike',
is_liked: e.is_liked - 1,
preferences: x,
user: props.user.email,
name: e.name,
});
setTogglePref(!togglePref)
} else {
await axios.put(`/artist/like`, {
toggle: 'like',
is_liked: e.is_liked + 1,
user: props.user.email,
name: e.name,
});
setTogglePref(!togglePref)
}
}


const makeArtists = (artists) => {

let x = JSON.parse(preferences);

let array = artists.map(e => {
const heart = x.includes(`artist: ${e.name}`) ? <i className="fas fa-heart"></i> : <i className="far fa-heart"></i>
const like = props.user ? heart :  '';

const deleteButton = <button onClick={() => deleteArtist(e)} className="deleteButton">Delete</button>;
const adminDelete = admin === 1 ? deleteButton : '';

return (
<li key={e.name} className="grid-item">
<p><span style={{cursor:'pointer'}} onClick={() => isLiked(e)}>{like} </span>{e.name}</p>
<img alt={e.name} width="150" height="150" src={e.cover_img}></img>
{adminDelete}
</li>
)}
)
setList(array)
}

const filterFavorites = favorites ?  <i className="fas fa-heart"></i> : <i className="far fa-heart"></i>

  return (
<div> 
<p className='listTitle'>Artists</p>
<input className="filterList" placeholder="Search..." onChange={(event) => setSearch(event.target.value)} /> 
<HashRouter>
{props.user ? <NavLink className="fa fa-plus-square-o add" to="/PostArtist"></NavLink> : ''}
</HashRouter>
<i className="filterFavorites" onClick={() => setFavorites(!favorites)}>{filterFavorites}</i>
<ul className="grid-container">
{list}
</ul>
</div>
  );
}

export default Artists;
