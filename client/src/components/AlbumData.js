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

function AlbumData(props) {
const [songs, setSongs] = useState([])
const [album, setAlbum] = useState(undefined)
const [loading, setLoading] = useState(true);

let { albumId } = useParams();

const playCount = async (e) => {
await axios.patch(`/api/songs/count/${e.youtube_id}`, {
play_count: e.play_count + 1,
});
};


   useEffect(() => {
  const fetchData = async () => {
      try{
      const { data } = await axios.get(`/api/albums/${albumId}`)
      const songs = await axios.get(`/api/songs/?album=${albumId}`);
      setSongs(songs.data)
      makeID(data)
      } catch(response) {
        setLoading(false)
  return setAlbum(<p style={{top:"430px", fontSize:"120px",textAlign:"right",width:"86%"}} className="listTitle">Unknown album</p>)
  }
    }; fetchData();
   }, [songs])



function makeID(e){
let list = songs.map(e => {
return (
<li key={e.youtube_id} className="grid-item2">
<p>
<NavLink className="navTo" to={`/songs/${e.youtube_id}?name=${albumId}`} >{e.title}</NavLink>
</p>
<YouTube className="video" onPlay={() => playCount(e)} videoId={e.youtube_id} id="video" opts={{width:"200",height:"200"}}/>
</li>   
)
})    

let x = () => {
return (
<div  style={{marginLeft:'50px'}}>
<p className="dataTitle">{e.name}</p>

<div style={{width:'100%', marginTop:'-60px', color:"white", display:"flex"}}>

<div style={{fontSize:'20px', width:'36%', marginRight:"2%"}}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="100%" height="75%" src={e.cover_img}></img>
<br/>
<i><strong>{e.is_liked}</strong> people liked this album</i><br/>
<br/><br/>
<i><strong>Artist:</strong>{" "} {e.artist_name}</i><br/>
<i><strong>Release date:</strong>{" "} {e.created_at.substr(0, 10)}</i>
</div>

<div style={{width:'62%'}}>
<h6 className="songsTitle">Songs</h6>
<div className="dataSongs">
{list}
</div>

</div>
</div>
<NavLink className="fa fa-arrow-left back" to="/albums"></NavLink>
</div>
);
}
setAlbum(x)
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
{album}
</div>
  );
  }

export default AlbumData;
