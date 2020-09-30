/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import {
  NavLink,
    Route,
    Switch,
    useRouteMatch,
    useParams,
} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";
import ScrollContainer from 'react-indiana-drag-scroll'
import UserContext from '../UserContext'
function UploadsData(props) {
const [loading, setLoading] = useState(true);
const [toggle, setToggle] = useState(false);
const [name, setName] = useState('Uploads')
const [data, setData] = useState('')

const user = useContext(UserContext)

let { userId } = useParams()

useEffect(() => {
    const fetchData = async () => {
      try {
      const { data } = await axios.get(`/api/users/uploads/${userId}`)
      makeLists(data[0], data.songs, data.albums, data.artists, data.playlists)
      } catch {
    return setLoading(false)
      }
    }; fetchData();
   }, [toggle, user, name])

const playCount = async (e) => {
await axios.patch(`/api/songs/count/${e.youtube_id}`, {
play_count: e.play_count + 1,
});
};

const deleteSong = async (e) => {
const newId = e.youtube_id.replace(`'`,`''`);
await axios.delete(`/api/songs/${newId}`);
setToggle(!toggle)
};
const deleteArtist = async (e) => {
const newName = e.name.replace(`'`,`''`);
await axios.delete(`/api/artists/${newName}`);
setToggle(!toggle)
};
const deleteAlbum = async (e) => {
const newName = e.name.replace(`'`,`''`);
await axios.delete(`/api/albums/${newName}`);
setToggle(!toggle)
};
const deletePlaylist = async (e) => {
await axios.delete(`/api/playlists/${e.id}`);
setToggle(!toggle)
};


const makeLists = (username, songs, albums, artists, playlists) => {

let capitalUserId = userId.charAt(0).toUpperCase() + userId.slice(1)
if (props.user) {
if(props.user.username.toUpperCase() === userId.toUpperCase()){
setName('My Uploads') 
} else {
setName(`${capitalUserId}'s Uploads`)
}
} else {
setName(`${capitalUserId}'s Uploads`)
} 

let z =1000
let sArray = songs.map(e => {
z--;
const deleteButton = props.user && props.user.email === e.user ? <button onClick={() => deleteSong(e)} style={{marginBottom:"15px"}} className="deleteButton">Delete</button> : ''

return (
<li key={e.youtube_id} style={{zIndex: z}} className="hov">
<p>
<NavLink className="navTo" to="/songs" onClick={() => props.song(e)}>
{e.title}  - {e.artist}
</NavLink>
</p>
<YouTube className="video" onPlay={() => playCount(e)}videoId={e.youtube_id} id="video" opts={{width:"250",height:"250"}}/>
<br/>
{deleteButton}
</li>
)

}
)


let alArray = albums.map(e => {
const deleteButton = props.user && props.user.email === e.user ? <button onClick={() => deleteAlbum(e)} className="deleteButton">Delete</button> : ''
z--;
return (
<li style={{zIndex: z}} key={e.name} className="hov">
<p>
<NavLink className="navTo" to="/albums" onClick={() => props.album(e)}>
{e.name} - {e.artist}
</NavLink>
</p>
<NavLink className="navTo" to="/albums" onClick={() => props.album(e)}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="250" height="250" src={e.cover_img}></img>
</NavLink>
<br/>
{deleteButton}
</li>
)}
)

let arArray = artists.map(e => {
const deleteButton = props.user && props.user.email === e.user ? <button onClick={() => deleteArtist(e)} className="deleteButton">Delete</button> : ''
z--;
return (
<li style={{zIndex: z}} key={e.name} className="hov">
<p>
<NavLink className="navTo" to="/artists" onClick={() => props.artist(e)}>
{e.name}
</NavLink>
</p>
<NavLink className="navTo" to="/artists" onClick={() => props.artist(e)}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="250" height="250" src={e.cover_img}></img>
</NavLink>
<br/> 
{deleteButton}
</li>
)}
) 
let pArray = playlists.map(e => {
const deleteButton = props.user && props.user.email === e.user ? <button onClick={() => deletePlaylist(e)} className="deleteButton">Delete</button> : ''
z--
return (
<li style={{zIndex: z}} key={e.name} className="hov">
<p>
<NavLink className="navTo" to="/playlists" onClick={() => props.playlist(e)}>
{e.name}
</NavLink>
</p>
<NavLink className="navTo" to="/playlists" onClick={() => props.playlist(e)}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="250" height="250" src={e.cover_img}></img>
</NavLink>
<br/>
{deleteButton}
</li>
)}
)

let x = () => {
return(
<div>
<p id="listTitle" className='listTitle'>{name}</p>

<div className='uploadsList'>
<h6 className="upTitle">Songs</h6>
<ScrollContainer className="upload" >
{sArray}
</ScrollContainer>

<h6 className="upTitle">Albums</h6>
<ScrollContainer className="upload" >
{alArray}
</ScrollContainer>

<h6 className="upTitle">Artists</h6>
<ScrollContainer className="upload" >
{arArray}
</ScrollContainer>
  <h6 className="upTitle">Playlists</h6>
<ScrollContainer className="upload" >
  {pArray}
  </ScrollContainer>
   <NavLink className="fa fa-arrow-left back"  to="/Uploads"></NavLink>
<br/><br/>
</div>
</div> 
)}
if(username === "user doesn't exist"){
setData(<p style={{top:"440px", fontSize:"120px",textAlign:"right",width:"86%"}} className="listTitle">User doesn't exist</p>)
} else {
setData(x)
}
setLoading(false)
}

const override =`
  position:absolute;
  width:200px;
  height:200px;
  margin-top:200px;
  left: 40%;
`;



  return (
    <div id="uploadsPage">
<LoadingOverlay
  active={loading}
  spinner={<ClipLoader css={override} color="white" style={{zIndex:1010}} size={150}/>}
  >
  </LoadingOverlay>
  <br/>
  {data}
</div>
  );
  }


function UploadsSearch(props){
const [search, setSearch] = useState(undefined)

let match = useRouteMatch();

const user = useContext(UserContext)

return(
<div style={{position:'relative', width:"92%", top:'0px'}}>
<p className='listTitle'>Search user</p>
<input className="filterList" onChange={(event) => setSearch(event.target.value)} /> 
<NavLink to={search ? `${match.url}/${search}` : `${match.url}`}>
<button className="searchButton">Search</button>
</NavLink>
{ user ? 
<NavLink to={`${match.url}/${user.username}`}>
<button style={{position:'relative', textAlign:"right", width:"108%", top:"550px", marginBottom:"0px"}} className="post">To my page</button>
</NavLink> : '' }
</div>
)
}

function Uploads(props){


let match = useRouteMatch();

return(
<div>
      <Switch>
        <Route path={`${match.path}/:userId`}>
          <UploadsData/>
        </Route>
        <Route path={match.path}>
          <UploadsSearch/>
        </Route>
      </Switch>
</div>
)
}


export default Uploads;
