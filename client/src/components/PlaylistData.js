/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  NavLink,
  useParams,
} from "react-router-dom";
import YouTube from 'react-youtube';
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";
import ReactPlayer from 'react-player/youtube'

function PlaylistData(props) {
const [songs, setSongs] = useState([])
const [loading, setLoading] = useState(true);
const [playlist, setPlaylist] = useState(undefined)
const [playlistSongs, setPlaylistSongs] = useState(undefined)

let { playlistId } = useParams();

const playCount = async (e) => {
await axios.patch(`/api/songs/count/${e.youtube_id}`, {
play_count: e.play_count + 1,
});
};

useEffect(() => {
  const fetchData = async () => {
      try{
      const { data } = await axios.get(`/api/playlists/${playlistId}`);
      const name = await axios.get(`/api/users/email/${data.UserEmail}`);
      setPlaylistSongs(data.songs)
      makeID(data, name.data.username)
  } catch(response) {
        setLoading(false)
    return setPlaylist(<p style={{top:"430px", fontSize:"120px",textAlign:"right",width:"86%"}} className="listTitle">Unknown playlist</p>)
  }
    }; fetchData();
   }, [songs])



useEffect(() => {
    const fetchData = async () => {
    try{
    let list = JSON.parse(playlistSongs);
      const { data } = await axios.get(`/api/songs`, {
      });
      let songList = data[0].filter(e => list.includes(e.youtube_id))
      setSongs(songList)
      } catch {
    return 
    }
    }; fetchData();
   }, [playlistSongs])

  

function makeID(e, name){

let url = []

let list = songs.map(e => {
url.push(`https://www.youtube.com/watch?v=${e.youtube_id}`)
return (
<li key={e.youtube_id} className="grid-item2">
<p>
<NavLink className="navTo" to={`/songs/${e.youtube_id}?name=${playlistId}`}>{e.title}</NavLink>
</p>
<YouTube className="video" onPlay={() => playCount(e)} videoId={e.youtube_id} id="video" opts={{width:"200",height:"200"}}/>
</li>   
)
})    

let x = () => {
return (
<div style={{marginLeft:'50px'}}>
<p className="dataTitle">{e.name}</p>
<br/><br/>
<div style={{width:'100%',marginTop:'-105px', color:"white", display:"flex"}}>
<div style={{fontSize:'20px', width:'36%', marginRight:"2%"}}>
<ReactPlayer url={url} controls={true} width="100%" height="450px" />
<i><strong>{e.is_liked}</strong> people liked this playlist</i>
<br/><br/>
<i><strong>Created by:</strong>{" "} {name}</i><br/><br/><br/>
</div>
<div style={{width:'62%'}}>
<h6 className="songsTitle">Songs</h6>
<div className="dataSongs">
{list}
</div>
</div>
</div>
<NavLink className="fa fa-arrow-left back" to="/playlists"></NavLink>
</div>
)}
setPlaylist(x)
setTimeout(() => {
setLoading(false) 
}, 1500);
}

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
{playlist}
</div>
  );
  }

export default PlaylistData;
