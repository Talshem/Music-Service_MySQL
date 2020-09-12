/* eslint-disable react-hooks/exhaustive-deps */
  
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Playlists(props) {
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
      const playlists = await (await axios.get(`/top_playlists`)).data;
      let list = playlists.filter(e => e.name.toUpperCase().includes(search.toUpperCase()))
      if (!favorites) {
      makePlaylists(list) 
      } else {
      let favoriteList = list.filter(e => x.includes(`playlist: ${e.id}`))
      makePlaylists(favoriteList)
      }
    }; fetchData();
   }, [favorites, search, toggleDelete, preferences])

const deletePlaylist = async (e) => {
const newName = e.name.replace(`'`,`''`);
await axios.delete(`/playlist/${newName}`);
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
<p className='listTitle'>Playlists</p>
<input className="filterList" placeholder="Search..." onChange={(event) => setSearch(event.target.value)} /> 
{props.user ? <i className="fa fa-plus-square-o add"></i> : ''}
<i className="filterFavorites" onClick={() => setFavorites(!favorites)}>{filterFavorites}</i>
<ul className="grid-container">
{list}
</ul>
</div>
  );
}


export default Playlists;