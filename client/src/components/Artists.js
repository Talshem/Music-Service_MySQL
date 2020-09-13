/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  NavLink,
} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";
import generator from 'generate-password'

function Artists(props) {
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
      const artists = await (await axios.get(`/top_artists?name=${search}`)).data;
      let list = artists.filter(e => e.name.toUpperCase().includes(search.toUpperCase()))
      if (!favorites) {
      makeArtists(list) 
      } else {
      let favoriteList = list.filter(e => x.includes(`artist: ${e.name}`))
      makeArtists(favoriteList)
      }
      setLoading(false)
    }; fetchData();
   }, [user, favorites, search, toggleDelete, preferences])

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
const adminDelete = admin === 1 || e.user === user ? deleteButton : '';

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

const override =`
  display: block;
    top:200px;
  position:absolute;
  width:200px;
  height:200px;
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
<p className='listTitle'>Artists</p>
<input className="filterList" placeholder="Search..." onChange={(event) => setSearch(event.target.value)} /> 
<NavLink className="fa fa-plus-square-o add" to="/PostArtist"></NavLink>
{props.user ? <i className="filterFavorites" onClick={() => setFavorites(!favorites)}>{filterFavorites}</i> : ''}
<ul className="grid-container">
{list}
</ul>
</div>
  );
}

export default Artists;
