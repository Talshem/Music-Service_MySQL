/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import {
  NavLink,
  useRouteMatch,
} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";
import network from '../Network.js';
import UserContext from '../UserContext'
import { useStateIfMounted } from "use-state-if-mounted";
import { Mixpanel } from '../AnalyticsManager';

function Song({item, adminDelete, like, include}){

const user = useContext(UserContext)

let match = useRouteMatch();

const playCount = async (e) => {
await axios.patch(`/api/songs/count/${e.youtube_id}`, {
play_count: e.play_count + 1,
});
if (user) Mixpanel.identify(user.username)
Mixpanel.track('play song', { song: e.title });
};

return (
<li className="grid-item">
<span style={{cursor:'pointer'}} >
{like}
</span>
<p style={{width: like ? '200px': '250px'}}>
<NavLink className="navTo" to={`${match.url}/${item.youtube_id}`}>{item.Artist ? <> {item.title} - {item.Artist.name} </> : <> {item.title}</>}</NavLink>
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

function Songs(props) {
const [list, setList] = useStateIfMounted([])
const [search, setSearch] = useStateIfMounted('')
const [favorites, setFavorites] = useStateIfMounted(false)
const [toggle, setToggle] = useStateIfMounted(0)
const [loading, setLoading] = useStateIfMounted(true);

const user = useContext(UserContext)

useEffect(() => {
    const fetchData = async () => {
      try {
      const { data: songs } = await axios.get(`/api/search/songs?name=${search}`);
      const preferences = user ? (await axios.get(`/api/preferences/song/${user.username}`)).data : [];
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

const handleFavorite = () => {
setFavorites(!favorites)
setLoading(true)
}

const deleteSong = async (e) => {
await network.delete(`/api/songs/${e.youtube_id}`);
setToggle(e => e + 1)
};

const isLiked = async (e) => {
try{
if (document.getElementById(e.youtube_id + 'like').className.includes('fas')){
document.getElementById(e.youtube_id + 'like').classList.replace('fas', 'far');
await network.patch(`/api/preferences`, {
username: user.username,
type: 'song',
item_id: e.youtube_id
}).then((res) => {
if (res.data.deleted)
network.patch(`/api/songs/like/${e.youtube_id}`, {
is_liked: e.is_liked - 1,
})})
if (user) Mixpanel.identify(user.username)
Mixpanel.track('toggle song likes', { song: e.title, method: 'unlike'});
} else {
document.getElementById(e.youtube_id + 'like').classList.replace('far', 'fas');
await network.post(`/api/preferences`, {
username: user.username,
type: 'song',
item_id: e.youtube_id
}).then((res) => {
if (res.data.created)
network.patch(`/api/songs/like/${e.youtube_id}`, {
is_liked: e.is_liked + 1,
})})
if (user) Mixpanel.identify(user.username)
Mixpanel.track('toggle song likes', { song: e.title, method: 'like'});
}
} catch (response) {
return response
}
}


const makeSongs = (songs, preferences) => {
let array = songs.map(e => {
const heart = <button onClick={() => isLiked(e, preferences)} id={e.youtube_id + 'like'} className={preferences.includes(e.youtube_id) ? "like fas fa-heart" : "like far fa-heart"}/>
const deleteButton = <button onClick={() => deleteSong(e)} style={{marginTop:'30px'}} className="deleteButton">Delete</button>;
const like = user ? heart :  null;
const adminDelete = user && user.is_admin ? deleteButton : null;
return (

            <MemoSong
            key={e.youtube_id} 
            item={e}
            adminDelete={adminDelete}
            like={like}
            include={preferences.includes(e.youtube_id)}
            />
)})
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
<NavLink className="fa fa-plus-square-o add" to="/PostSong"></NavLink>  
{" "} Songs</p>
<input className="filterList" onChange={(event) => setSearch(event.target.value)} /> 
<button onClick={() => handleSearch()} className="searchButton">Search</button>
{user ? <i className="filterFavorites" onClick={() => handleFavorite()}>{filterFavorites}</i> : ''}
<ul className="grid-container"><br/>
{list}
</ul>
</div>
  );
}

export default Songs;
