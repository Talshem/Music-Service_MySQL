import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  NavLink,
  useParams,
} from "react-router-dom";
import YouTube from 'react-youtube';
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";

function PlaylistData(props) {
const [songs, setSongs] = useState([])
const [loading, setLoading] = useState(true);
const [playlist, setPlaylist] = useState(undefined)
const [playlistSongs, setPlaylistSongs] = useState(undefined)

let { playlistId } = useParams();

const playCount = async (e) => {
await axios.put(`/count`, {
song_id: e.youtube_id,
count: e.play_count + 1,
});
};

useEffect(() => {
  const fetchData = async () => {
      try{
      const { data } = await axios.get(`/playlist/${playlistId}`)
      setPlaylistSongs(data[0].songs)
      if (data[0].length !== 0){
      makeID(data[0])
      }
  } catch(response) {
        setLoading(false)
    return setPlaylist(<p style={{top:"400px", fontSize:"120px",textAlign:"right",width:"1230px"}} className="listTitle">Unknown playlist</p>)
  }
    }; fetchData();
   }, [songs])



useEffect(() => {
    const fetchData = async () => {
    try{
    let list = JSON.parse(playlistSongs);
      const { data } = await axios.get(`/top_songs`, {
      });
      let songList = data[0].filter(e => list.includes(e.youtube_id))
      setSongs(songList)
      } catch {
    return 
    }
    }; fetchData();
   }, [playlistSongs])

  

function makeID(e){

let list = songs.map(e => {
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
<div style={{marginTop:'-105px', color:"white", display:"flex"}}>
<div style={{fontSize:'20px'}}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="450" height="450" src={e.cover_img}></img>
<br/>
<i><strong>{e.is_liked}</strong> people liked this playlist</i><br/>
<br/><br/><br/><br/>
<i><strong>Created by:</strong>{" "} 000</i>
<br/><br/>
<NavLink style={{marginLeft:"0px"}} className="fa fa-arrow-left back" to="/playlists"></NavLink>
</div>
<div className="dataSongs">
<h6 className="songsTitle">Songs</h6>
{list}
</div>
</div>
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
