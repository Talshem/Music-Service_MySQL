/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
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

function SongsList(props) {
const [list, setList] = useState([])
const [search, setSearch] = useState('')
const [preferences, setPreferences] = useState("[]")
const [admin, setAdmin] = useState(0)
const [favorites, setFavorites] = useState(false)
const [toggle, setToggle] = useState(false)
const [loading, setLoading] = useState(true);
const [disabled, setDisabled] = useState(false)

let match = useRouteMatch();

useEffect(() => {
const getPreferences = async () => {
try {
const { data } = await axios.get(`/api/users/preferences/${props.user.email}`)
setPreferences(data)
} catch(error) {
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
      try {
      const songs = await (await axios.get(`/api/songs?name=${search}`)).data;
      let list = songs.filter(e => e.title.toUpperCase().includes(search.toUpperCase()))
      if (!favorites) {
      makeSongs(list) 
      } else {
      let favoriteList = list.filter(e => JSON.parse(preferences).includes(`song: ${e.youtube_id}`))
      makeSongs(favoriteList)
      }
    } catch(response) {
    setLoading(false)  
    return alert(response)
    }
    }; fetchData();
   }, [disabled, toggle, favorites, preferences])


const handleSearch = () => {
setToggle(!toggle)
setLoading(true)
}

const deleteSong = async (e) => {
const newId = e.youtube_id.replace(`'`,`''`);
await network.delete(`/api/songs/${newId}`);
setToggle(!toggle)
};

const playCount = async (e) => {
await axios.patch(`/api/songs/count/${e.youtube_id}`, {
play_count: e.play_count + 1,
});
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
let newPreferences = JSON.parse(preferences)
if (newPreferences.includes(`song: ${e.youtube_id}`)){
let x = newPreferences.filter(element => element !== `song: ${e.youtube_id}`)

await axios.patch(`/api/songs/like/${e.youtube_id}`, {
is_liked: e.is_liked - 1,
})
await axios.patch(`/api/users/${props.user.email}`, {
preferences: JSON.stringify(x),
password: props.user.password
})
} else {
newPreferences.push(`song: ${e.youtube_id}`)
await axios.patch(`/api/songs/like/${e.youtube_id}`, {
is_liked: e.is_liked + 1,
});
await axios.patch(`/api/users/${props.user.email}`, {
preferences: JSON.stringify(newPreferences),
password: props.user.password
});
}
setToggle(!toggle)
}

const makeSongs = (songs) => {
let x = JSON.parse(preferences);

let array = songs.map(e => {
const heart = x.includes(`song: ${e.youtube_id}`) ? 
<button  onClick={() => isLiked(e)} disabled={disabled} className="like fas fa-heart"/> :
<button  onClick={() => isLiked(e)} disabled={disabled} className="like far fa-heart"/>
const like = props.user ? heart :  '';

const deleteButton = <button style={{marginTop:"20px"}} onClick={() => deleteSong(e)} className="deleteButton">Delete</button>;
const adminDelete = admin === 1 ? deleteButton : '';

return (
<li key={e.youtube_id} className="grid-item">
<span style={{cursor:'pointer'}} >{like}</span>
<p>
<NavLink className="navTo" to={`${match.url}/${e.youtube_id}`}>{e.title} - {e.Artist.name}</NavLink>
</p>
<YouTube className="video" onPlay={() => playCount(e)} videoId={e.youtube_id} id="video" opts={{width:"250",height:"250"}}/>
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
<NavLink className="fa fa-plus-square-o add" to="/PostSong"></NavLink>  
{" "} Songs</p>
<input className="filterList" onChange={(event) => setSearch(event.target.value)} /> 
<button onClick={() => handleSearch()} className="searchButton">Search</button>
{props.user ? <i className="filterFavorites" onClick={() => setFavorites(!favorites)}>{filterFavorites}</i> : ''}
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
          <SongData user={props.user}/>
        </Route>
        <Route path={match.path}>
          <SongsList user={props.user}/>
        </Route>
      </Switch>
)
}

export default Songs;
