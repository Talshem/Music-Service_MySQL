/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Albums(props) {
const [list, setList] = useState([])
const [search, setSearch] = useState('')
const [preferences, setPreferences] = useState([])
const [admin, setAdmin] = useState(0)
const [toggleDelete, setToggleDelete] = useState(false)
const [favorites, setFavorites] = useState(false)

useEffect(() => {
if(props.user){
let pref = props.user.preferences;
let admin = props.user.is_admin;
setPreferences(JSON.parse(pref))
setAdmin(admin)
}}, [props.user])

useEffect(() => {
    const fetchData = async () => {
      const albums = await (await axios.get(`/top_albums`)).data;
      let list = albums.filter(e => e.name.toUpperCase().includes(search.toUpperCase()))
      if (!favorites) {
      makeAlbums(list) 
      } else {
      let favoriteList = list.filter(e => preferences.includes(`album: ${e.youtube_id}`))
      makeAlbums(favoriteList)
      }
    }; fetchData();
   }, [favorites, search, toggleDelete, preferences])

const deleteAlbum = async (e) => {
const newName = e.name.replace(`'`,`''`);
await axios.delete(`/album/${newName}`);
setToggleDelete(!toggleDelete)
};

const isLiked = async (e) => {
if (preferences.includes(`album: ${e.name}`)){
const { data } = await axios.put(`/album/like`, {
toggle: 'unlike',
is_liked: e.is_liked - 1,
preferences: preferences,
user: props.user.email,
name: e.name,
});
console.log(data)
let x = JSON.parse(data[0].preferences)
setPreferences(x)
} else {
const { data } = await axios.put(`/album/like`, {
toggle: 'like',
is_liked: e.is_liked + 1,
user: props.user.email,
name: e.name,
});
console.log(data)
let x = JSON.parse(data[0].preferences)
setPreferences(x)
}
}


const makeAlbums = (albums) => {
let array = albums.map(e => {
const heart = preferences.includes(`album: ${e.name}`) ? <i className="fas fa-heart"></i> : <i className="far fa-heart"></i>
const like = props.user ? heart :  '';

const deleteButton = <button onClick={() => deleteAlbum(e)} className="deleteButton">Delete</button>;
const adminDelete = admin === 1 ? deleteButton : '';

return (
<li key={e.name} className="grid-item">
<p><span style={{cursor:'pointer'}} onClick={() => isLiked(e)}>{like}</span>{e.name}</p>
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
<p className='listTitle'>Albums</p>
<input className="filterList" placeholder="Search..." onChange={(event) => setSearch(event.target.value)} /> 
{props.user ? <i className="fa fa-plus-square-o add" to="/PostSong"></i> : ''}
<i className="filterFavorites" onClick={() => setFavorites(!favorites)}>{filterFavorites}</i>
<ul className="grid-container">
{list}
</ul>
</div>
  );
}

export default Albums;
