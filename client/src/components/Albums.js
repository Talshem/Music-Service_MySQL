/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
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
import network from '../Network.js';
import UserContext from '../UserContext'


function Album({item, adminDelete, like, include}){
  
let match = useRouteMatch();

return (
<li key={item.name} className="grid-item">
<span style={{cursor:'pointer'}}>{like} {" "} </span>
<p>
<NavLink className="navTo" to={`${match.url}/${item.id}`}>
{item.name} - {item.Artist.name}
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


function AlbumsList(props) {
const [list, setList] = useState([])
const [search, setSearch] = useState('')
const [toggle, setToggle] = useState(0)
const [favorites, setFavorites] = useState(false)
const [loading, setLoading] = useState(true);

const user = useContext(UserContext)



useEffect(() => {
    const fetchData = async () => {
      try{
      const albums = await (await axios.get(`/api/albums?name=${search}`)).data;
      const preferences = await (await axios.get(`/api/preferences/album/${user.username}`)).data;
      let prefArray = preferences.map(e => e.item_id)
      let list = albums.filter(e => e.name.toUpperCase().includes(search.toUpperCase()))
      if (!favorites) {
      makeAlbums(list, prefArray) 
      } else {
      let favoriteList = list.filter(e => prefArray.includes(e.id))
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
const newName = e.name.replace(`'`,`''`);
await network.delete(`/api/albums/${newName}`);
setToggle(e => e + 1)
};

const isLiked = async (e, preferences) => {
document.getElementById(e.id + 'like').setAttribute('disabled', false);
try{
document.getElementById(e.id + 'like').classList.replace('fas', 'far');
if (preferences.includes(e.id.toString())){
await network.patch(`/api/albums/like/${e.id}`, {
is_liked: e.is_liked - 1,
});
await network.patch(`/api/preferences`, {
username: user.username,
type: 'album',
item_id: e.id
});
} else {
document.getElementById(e.id + 'like').classList.replace('far', 'fas');
await network.patch(`/api/albums/like/${e.id}`, {
is_liked: e.is_liked + 1,
});
await network.post(`/api/preferences`, {
username: user.username,
type: 'album',
item_id: e.id
});
}
} catch (response) {
console.log(response)
}
setToggle(e => e + 1)
}

const makeAlbums = (albums, preferences) => {
let array = albums.map(e => {
const heart = preferences.includes(e.id.toString()) ? 
<button  onClick={() => isLiked(e, preferences)} id={e.id + 'like'} className="like fas fa-heart"/> :
<button  onClick={() => isLiked(e, preferences)} id={e.id + 'like'} className="like far fa-heart"/>
const deleteButton = <button onClick={() => deleteAlbum(e)} className="deleteButton">Delete</button>;
const like = user ? heart :  '';
const adminDelete = user && user.admin === 1 ? deleteButton : '';

return (
            <MemoAlbum
            item={e}
            adminDelete={adminDelete}
            like={like}
            include={preferences.includes(e.id.toString())}
            />
)}
)
setList(array)
setLoading(false)
albums.forEach(e =>{
document.getElementById(e.id + 'like').removeAttribute('disabled');
})
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
{user ? <i className="filterFavorites" onClick={() => setFavorites(!favorites)}>{filterFavorites}</i> : ''}
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
          <AlbumData/>
        </Route>
        <Route path={match.path}>
          <AlbumsList/>
        </Route>
      </Switch>
)
}


export default Albums;

