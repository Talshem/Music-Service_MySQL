/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Switch,
  Route,
  NavLink,
  useRouteMatch,
  } from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";
import AlbumData from './AlbumData.js';


function AlbumsList(props) {
const [list, setList] = useState([])
const [search, setSearch] = useState('')
const [preferences, setPreferences] = useState("[]")
const [admin, setAdmin] = useState(0)
const [toggle, setToggle] = useState(false)
const [favorites, setFavorites] = useState(false)
const [loading, setLoading] = useState(true);
const [disabled, setDisabled] = useState(false)

let match = useRouteMatch();

useEffect(() => {
const getPreferences = async () => {
try {
const { data } = await axios.get(`/api/users/preferences/${props.user.email}`)
setPreferences(data[0].preferences)
} catch {
return
}
}; getPreferences();
}, [toggle])

useEffect(() => {
if(props.user){
let isAdmin = props.user.is_admin;
setAdmin(isAdmin)
}}, [props.user])

useEffect(() => {
    const fetchData = async () => {
      let x = JSON.parse(preferences)
      try{
      const albums = await (await axios.get(`/api/albums?name=${search}`)).data;
      let list = albums.filter(e => e.name.toUpperCase().includes(search.toUpperCase()))
      if (!favorites) {
      makeAlbums(list) 
      } else {
      let favoriteList = list.filter(e => x.includes(`album: ${e.id}`))
      makeAlbums(favoriteList)
      }} catch(response) {
    setLoading(false)
    return alert(response)
      }
    }; fetchData();
   }, [disabled, toggle, favorites, preferences])

const handleSearch = () => {
setToggle(!toggle)
setLoading(true)
}

const deleteAlbum = async (e) => {
const newName = e.name.replace(`'`,`''`);
await axios.delete(`/api/albums/${newName}`);
setToggle(!toggle)
};
const isLiked= (e) => {
const promise = new Promise((resolve, reject) => {
    resolve(setDisabled(true));
})
const promise2 = new Promise((resolve, reject) => {
    resolve(handleLike(e));
})
promise.then(() => promise2)
promise2.then(() => {
  setTimeout(() => {
    setDisabled(false)
  }, 1500);
})

}

const handleLike = async (e) => {
let x = JSON.parse(preferences)
if (x.includes(`album: ${e.id}`)){
await axios.put(`/api/albums/like`, {
toggle: 'unlike',
is_liked: e.is_liked,
preferences: x,
user: props.user.email,
id: e.id,
});
setToggle(!toggle)
} else {
await axios.put(`/api/albums/like`, {
toggle: 'like',
is_liked: e.is_liked,
user: props.user.email,
id: e.id,
});
setToggle(!toggle)
}
}


const makeAlbums = (albums) => {

let x = JSON.parse(preferences);

let array = albums.map(e => {
const heart = x.includes(`album: ${e.id}`) ?
<button  onClick={() => isLiked(e)} disabled={disabled} className="like fas fa-heart"/> :
<button  onClick={() => isLiked(e)} disabled={disabled} className="like far fa-heart"/>
const like = props.user ? heart :  '';

const deleteButton = <button onClick={() => deleteAlbum(e)} className="deleteButton">Delete</button>;
const adminDelete = admin === 1 ? deleteButton : '';

return (
<li key={e.name} className="grid-item">
<span style={{cursor:'pointer'}}>{like} {" "} </span>
<p>
<NavLink className="navTo" to={`${match.url}/${e.id}`}>
{e.name} - {e.artist_name}
</NavLink>
</p>
<NavLink className="navTo" to={`${match.url}/${e.id}`}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="250" height="250" src={e.cover_img}></img>
</NavLink>
{adminDelete}
</li>
)}
)
setList(array)
setLoading(false)
}


const filterFavorites = favorites ?  <i className="fas fa-heart"></i> : <i className="far fa-heart"></i>

const override =`
  position:absolute;
  width:200px;
  height:200px;
  margin-top:200px;
  left: 40%;
`;

  return (
<div> 
<LoadingOverlay
  active={loading}
  spinner={<ClipLoader css={override} color="white" style={{zIndex:1010}} size={150}/>}
  >
  </LoadingOverlay>
<p className='listTitle'>
<NavLink className="fa fa-plus-square-o add" to="/PostAlbum"></NavLink>  
{" "} Albums</p>
<input className="filterList" onChange={(event) => setSearch(event.target.value)} /> 
<button onClick={() => handleSearch()} className="searchButton">Search</button>
{props.user ? <i className="filterFavorites" onClick={() => setFavorites(!favorites)}>{filterFavorites}</i> : ''}
<ul className="grid-container">
{list}
</ul>
</div>
  );
}

function Albums(props){

let match = useRouteMatch(); 

return(
      <Switch>
        <Route path={`${match.path}/:albumId`}>
          <AlbumData user={props.user}/>
        </Route>
        <Route path={match.path}>
          <AlbumsList user={props.user}/>
        </Route>
      </Switch>
)
}


export default Albums;

