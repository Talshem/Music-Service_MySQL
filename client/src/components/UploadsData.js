/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect} from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import {
NavLink,
useParams,
} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";
import ScrollContainer from 'react-indiana-drag-scroll'
import UserContext from '../UserContext'
import network from '../Network.js';
import { useStateIfMounted } from "use-state-if-mounted";
import { useConfirm } from "material-ui-confirm";

export default function UploadsData(props) {
const [loading, setLoading] = useStateIfMounted(true);
const [toggle, setToggle] = useStateIfMounted(false);
const [name, setName] = useStateIfMounted('Uploads')
const [uploads, setUploads] = useStateIfMounted('')
const confirm = useConfirm();

const user = useContext(UserContext)

let { userId } = useParams()

useEffect(() => {
    const fetchData = async () => {
      try {
      const { data } = await axios.get(`/api/users/uploads/${userId}`)
      makeLists(data.user, data.songs, data.albums, data.artists, data.playlists)
      } catch {
    setLoading(false)
    return setUploads(<p style={{top:"430px", fontSize:"120px",textAlign:"right",width:"86%"}} className="listTitle">User doesn't exist</p>)
      }
    }; fetchData();
   }, [toggle, user, name])

const playCount = async (e) => {
await axios.patch(`/api/songs/count/${e.youtube_id}`, {
play_count: e.play_count + 1,
});
};

const deleteSong = async (e) => {
confirm({ description: `This will permanently delete ${e.title}.` })
.then( async () => { await network.delete(`/api/songs/${e.youtube_id}`); setToggle(!toggle)})
.catch(() => {return});
};
const deleteArtist = async (e) => {
confirm({ description: `This will permanently delete ${e.name}.` })
.then( async () => { await network.delete(`/api/artists/${e.id}`); setToggle(!toggle)})
.catch(() => {return});
};
const deleteAlbum = async (e) => {
confirm({ description: `This will permanently delete ${e.name}.` })
.then( async () => { await network.delete(`/api/albums/${e.id}`); setToggle(!toggle)})
.catch(() => {return});
};

const deletePlaylist = async (e) => {
confirm({ description: `This will permanently delete ${e.name}.` })
.then( async () => { await network.delete(`/api/playlists/${e.id}`); setToggle(!toggle)})
.catch(() => {return});
};


const makeLists = (username, songs, albums, artists, playlists) => {

let capitalUserId = userId.charAt(0).toUpperCase() + userId.slice(1)
if (user) {
if(user.username.toUpperCase() === userId.toUpperCase()){
setName('My Uploads') 
} else {
setName(`${capitalUserId}'s Uploads`)
}
}

let sArray = songs.map(e => {
const deleteButton = user && user.username.toUpperCase() === e.username.toUpperCase() ? <button onClick={() => deleteSong(e)} style={{marginBottom:"15px", marginTop:'30px'}} className="fa fa-remove"></button> : null
return (
<li key={e.youtube_id} className="hov">
<YouTube className="video" onPlay={() => playCount(e)}videoId={e.youtube_id} id="video" opts={{width:"250",height:"250"}}/>
<span  style={{cursor:'pointer'}} >
{deleteButton}
</span>
<p style={{width: deleteButton ? '220px' : null}}>
<NavLink className="navTo" to={`/songs/${e.youtube_id}`}>
{e.title}
</NavLink>
</p>
<br/>
</li>
)

}
)


let alArray = albums.map(e => {
const deleteButton = user && user.username.toUpperCase() === e.username.toUpperCase() ? <button onClick={() => deleteAlbum(e)} className="fa fa-remove"></button> : null
return (
<li key={e.name} className="hov">
<NavLink className="navTo" to={`/albums/${e.id}`}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="250" height="250" src={e.cover_img}></img>
</NavLink>
<span style={{cursor:'pointer'}} >
{deleteButton}
</span>
<p style={{width: deleteButton ? '220px' : null}}>
<NavLink className="navTo" to={`/albums/${e.id}`}>
{e.name}
</NavLink>
</p>
<br/>
</li>
)}
)

let arArray = artists.map(e => {
const deleteButton = user && user.username.toUpperCase() === e.username.toUpperCase() ? <button onClick={() => deleteArtist(e)} className="fa fa-remove"></button> : null
return (
<li key={e.name} className="hov">
<NavLink className="navTo"  to={`/artists/${e.id}`}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="250" height="250" src={e.cover_img}></img>
</NavLink>
<span style={{cursor:'pointer'}} >
{deleteButton}
</span>
<p style={{width: deleteButton ? '220px' : null}}>
<NavLink className="navTo" to={`/artists/${e.id}`}>
{e.name}
</NavLink>
</p>
<br/> 
</li>
)}
) 
let pArray = playlists.map(e => {
const deleteButton = user && user.username.toUpperCase() === e.username.toUpperCase() ? <button onClick={() => deletePlaylist(e)} className="fa fa-remove"></button> : null
return (
<li key={e.name} className="hov">
<NavLink className="navTo" to={`/playlists/${e.id}`}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="250" height="250" src={e.cover_img}></img>
</NavLink>
<span style={{cursor:'pointer'}} >
{deleteButton}
</span>
<p style={{width: deleteButton ? '220px' : null}}>
<NavLink className="navTo"  to={`/playlists/${e.id}`}>
{e.name}
</NavLink>
</p>
<br/>
</li>
)}
)

let x = () => {
return(
<div>
<p id="listTitle" className='listTitle'>{name}</p>
<br/><br/>
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
setUploads(<p style={{top:"440px", fontSize:"120px",textAlign:"right",width:"86%"}} className="listTitle">User doesn't exist</p>)
} else {
setUploads(x)
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
  {uploads}
</div>
  );
  }
