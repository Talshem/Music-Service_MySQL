/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import {
  NavLink,
  useRouteMatch,
  } from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";
import network from '../Network.js';
import UserContext from '../UserContext'
import { useStateIfMounted } from "use-state-if-mounted";

function Album({item, adminDelete, like, include}){

let match = useRouteMatch();

return (
<li className="grid-item">
<span style={{cursor:'pointer'}}>{like} </span>
<p style={{width: like ? '195px': '250px'}}>
<NavLink className="navTo" to={`${match.url}/${item.id}`}>
{item.Artist ? <> {item.name} - {item.Artist.name} </> : <> {item.name}</>}
</NavLink>
</p>
<NavLink className="navTo" to={`${match.url}/${item.id}`}>
<img onError={(item)=>{item.target.onerror = null; item.target.src="/no_image.jpg"}} alt={item.name} width="250" height="250" src={item.cover_img}></img>
</NavLink>
{adminDelete}
</li>
)}

const MemoAlbum = React.memo(Album, (prevProps, nextProps) => {
  if (prevProps.include === nextProps.include) {
    return true;
  }
  return false;
});


function Albums(props) {
const [list, setList] = useStateIfMounted([])
const [search, setSearch] = useStateIfMounted('')
const [toggle, setToggle] = useStateIfMounted(0)
const [favorites, setFavorites] = useStateIfMounted(false)
const [loading, setLoading] = useStateIfMounted(true);

const user = useContext(UserContext)

useEffect(() => {
    const fetchData = async () => {
      try{
      const { data: albums } = await axios.get(`/api/search/albums?name=${search}`);
      const preferences = user ? (await axios.get(`/api/preferences/album/${user.username}`)).data : [];
      let prefArray = preferences.map(e => e.item_id)
      let list = albums.filter(e => e.name.toUpperCase().includes(search.toUpperCase()))
      if (!favorites) {
      makeAlbums(list, prefArray) 
      } else {
      let favoriteList = list.filter(e => prefArray.includes(e.id.toString()))
      makeAlbums(favoriteList, prefArray)
      }} catch(response) {
    setLoading(false)
    return
      }
    }; fetchData();
   }, [toggle, favorites])

const handleSearch = () => {
setToggle(e => e + 1)
setLoading(true)
}

const deleteAlbum = async (e) => {
await network.delete(`/api/albums/${e.id}`);
setToggle(e => e + 1)
};

const handleFavorite = () => {
setFavorites(!favorites)
setLoading(true)
}

const isLiked = async (e) => {
try{
if (document.getElementById(e.id + 'like').className.includes('fas')){
document.getElementById(e.id + 'like').classList.replace('fas', 'far');
await network.patch(`/api/preferences`, {
username: user.username,
type: 'album',
item_id: e.id
}).then((res) => {
if (res.data.deleted)
network.patch(`/api/albums/like/${e.id}`, {
is_liked: e.is_liked - 1,
})})
} else {
document.getElementById(e.id + 'like').classList.replace('far', 'fas');
await network.post(`/api/preferences`, {
username: user.username,
type: 'album',
item_id: e.id
}).then((res) => {
if (res.data.deleted)
network.patch(`/api/albums/like/${e.id}`, {
is_liked: e.is_liked + 1,
})});
}
} catch (response) {
console.log(response)
}
}

const makeAlbums = (albums, preferences) => {
let array = albums.map(e => {
const heart = preferences.includes(e.id.toString()) ? 
<button  onClick={() => isLiked(e, preferences)} id={e.id + 'like'} className="like fas fa-heart"/> :
<button  onClick={() => isLiked(e, preferences)} id={e.id + 'like'} className="like far fa-heart"/>
const deleteButton = <button onClick={() => deleteAlbum(e)} className="deleteButton">Delete</button>;
const like = user ? heart :  null;
const adminDelete = user && user.is_admin ? deleteButton : null;

return (
            <MemoAlbum
            key={e.id}
            item={e}
            adminDelete={adminDelete}
            like={like}
            include={preferences.includes(e.id.toString())}
            />
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
{user ? <i className="filterFavorites" onClick={() => handleFavorite()}>{filterFavorites}</i> : ''}
<ul className="grid-container">
{list}
</ul>
</div>
  );
}


export default Albums;

