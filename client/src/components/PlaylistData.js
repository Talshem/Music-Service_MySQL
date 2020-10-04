/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import axios from 'axios';
import {
  NavLink,
  useParams,
} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";
import ReactPlayer from 'react-player/youtube'
import { useStateIfMounted } from "use-state-if-mounted";

function PlaylistData(props) {
const [loading, setLoading] = useStateIfMounted(true);
const [playlist, setPlaylist] = useStateIfMounted(undefined)
let { playlistId } = useParams();

useEffect(() => {
  const fetchData = async () => {
      try{
      const { data } = await axios.get(`/api/playlists/${playlistId}`);
      const songs = await axios.get(`/api/songinplaylist/${playlistId}`)
      makeID(data, songs.data)
  } catch(response) {
        setLoading(false)
    return setPlaylist(<p style={{top:"430px", fontSize:"120px",textAlign:"right",width:"86%"}} className="listTitle">Unknown playlist</p>)
  }
    }; fetchData();
   }, [])

  

function makeID(e, songs){

let url = [];

let list = songs.map(e => {
url.push(`https://www.youtube.com/watch?v=${e.Song.youtube_id}`)
return (
<li key={e.Song.youtube_id} className="item">
<NavLink className="navTo" to={`/songs/${e.Song.youtube_id}?playlist=${playlistId}`}>
<span>	&#119136; &nbsp; {e.Song.title} - {e.artist} </span>
<span style={{float:"right"}}>{e.Song.length}</span>
</NavLink>
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
<ReactPlayer playing url={url} controls={true} width="100%" height="450px" />
<i><strong>{e.is_liked}</strong> people liked this playlist</i>
<br/><br/>
<i><strong>Created by:</strong>{" "} {e.username}</i><br/><br/><br/>
</div>
<div style={{width:'62%'}}>
<h6 className="songsTitle">Songs</h6>
<div className="dataItem">
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
