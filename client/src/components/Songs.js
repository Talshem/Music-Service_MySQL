/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import {
  Switch,
  Route,
  NavLink,
  useRouteMatch,
} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";
import SongData from './SongData.js';
import network from '../Network.js';
import UserContext from '../UserContext'

function Song({item, adminDelete, like, include}){

let match = useRouteMatch();

const playCount = async (e) => {
await axios.patch(`/api/songs/count/${e.youtube_id}`, {
play_count: e.play_count + 1,
});
};

return (
<li key={item.youtube_id} className="grid-item">
<span style={{cursor:'pointer'}} >
{like}
</span>
<p>
<NavLink className="navTo" to={`${match.url}/${item.youtube_id}`}>{item.title} - {item.Artist.name}</NavLink>
</p>
<YouTube className="video" onPlay={() => playCount(item)} videoId={item.youtube_id} id="video" opts={{width:"250",height:"250"}}/>
{adminDelete}
</li>
)}

const MemoSong = React.memo(Song, (prevProps, nextProps) => {
  if (prevProps.include === nextProps.include) {
    return true;
  }
  return false;
});

function SongsList(props) {
const [list, setList] = useState([])
const [search, setSearch] = useState('')
const [favorites, setFavorites] = useState(false)
const [toggle, setToggle] = useState(0)
const [loading, setLoading] = useState(true);

const user = useContext(UserContext)

useEffect(() => {
    const fetchData = async () => {
      try {
      const songs = await (await axios.get(`/api/songs?name=${search}`)).data;
      const preferences = await (await axios.get(`/api/preferences/song/${user.username}`)).data;
      let prefArray = preferences.map(e => e.item_id)
      let list = songs.filter(e => e.title.toUpperCase().includes(search.toUpperCase()))
      if (!favorites) {
      makeSongs(list, prefArray) 
      } else {
      let favoriteList = list.filter(e => prefArray.includes(e.youtube_id))
      makeSongs(favoriteList, prefArray)
      }
    } catch(response) {
    setLoading(false)  
    return
    }
    }; fetchData();
   }, [toggle, favorites])


const handleSearch = () => {
setToggle(e => e + 1)
setLoading(true)
}

const deleteSong = async (e) => {
const newId = e.youtube_id.replace(`'`,`''`);
await network.delete(`/api/songs/${newId}`);
setToggle(e => e + 1)
};

const isLiked = async (e, preferences) => {
document.getElementById(e.youtube_id + 'like').setAttribute('disabled', false);
try{
if (preferences.includes(e.youtube_id)){
document.getElementById(e.youtube_id + 'like').classList.replace('fas', 'far');
await network.patch(`/api/songs/like/${e.youtube_id}`, {
is_liked: e.is_liked - 1,
});
await network.patch(`/api/preferences`, {
username: user.username,
type: 'song',
item_id: e.youtube_id
});
} else {
document.getElementById(e.youtube_id + 'like').classList.replace('far', 'fas');
await network.patch(`/api/songs/like/${e.youtube_id}`, {
is_liked: e.is_liked + 1,
});
await network.post(`/api/preferences`, {
username: user.username,
type: 'song',
item_id: e.youtube_id
});
}
} catch (response) {
console.log(response)
}
setToggle(e => e + 1)
}


const makeSongs = (songs, preferences) => {
let array = songs.map(e => {
const heart = 
<button onClick={() => isLiked(e, preferences)} id={e.youtube_id + 'like'} className={preferences.includes(e.youtube_id) ? "like fas fa-heart" : "like far fa-heart"}/>
const deleteButton = <button style={{marginTop:"20px"}} onClick={() => deleteSong(e)} className="deleteButton">Delete</button>;
const like = user ? heart :  '';
const adminDelete = user && user.admin === 1 ? deleteButton : '';
return (

            <MemoSong
            item={e}
            adminDelete={adminDelete}
            like={like}
            include={preferences.includes(e.youtube_id)}
            />
)})
setList(array)
songs.forEach(e =>{
document.getElementById(e.youtube_id + 'like').removeAttribute('disabled');
})
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
<NavLink className="fa fa-plus-square-o add" to="/PostSong"></NavLink>  
{" "} Songs</p>
<input className="filterList" onChange={(event) => setSearch(event.target.value)} /> 
<button onClick={() => handleSearch()} className="searchButton">Search</button>
{user ? <i className="filterFavorites" onClick={() => setFavorites(!favorites)}>{filterFavorites}</i> : ''}
<ul className="grid-container"><br/>
{list}
</ul>
</div>
  );
}

function Songs(props){

let match = useRouteMatch();

return(
      <Switch>
        <Route path={`${match.path}/:songId`}>
          <SongData/>
        </Route>
        <Route path={match.path}>
          <SongsList/>
        </Route>
      </Switch>
)
}

export default Songs;
