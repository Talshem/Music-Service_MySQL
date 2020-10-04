/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import axios from 'axios';
import {
  NavLink,
  useParams,
} from "react-router-dom";
import YouTube from 'react-youtube';
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";
import { useStateIfMounted } from "use-state-if-mounted";

function ArtistData(props) {
const [loading, setLoading] = useStateIfMounted(true);
const [artist, setArtist] = useStateIfMounted(undefined)

let { artistId } = useParams();

const playCount = async (e) => {
await axios.patch(`/api/songs/count/${e.youtube_id}`, {
play_count: e.play_count + 1,
});
};


useEffect(() => {
  const fetchData = async () => {
      try{
      const { data } = await axios.get(`/api/artists/${artistId}`)
      makeID(data.artist, data.albums, data.songs)
  } catch(response) {
        setLoading(false)
    return setArtist(<p style={{top:"430px", fontSize:"120px",textAlign:"right",width:"86%"}} className="listTitle">Unknown artist</p>)
  }
    }; fetchData();
   }, [])


function makeID(e, albums, songs){
let z = 100;

let songList = songs.map(e => {
z--;

return (
<div style={{zIndex:z}} key={e.youtube_id} className="hov grid-item3">
<YouTube className="video" onPlay={() => playCount(e)} videoId={e.youtube_id} opts={{width:'200', height:'200'}} id="video"/>
<p style={{marginTop:"10px"}}>
<NavLink className="navTo" to={`/songs/${e.youtube_id}?artist=${artistId}`}>{e.title}</NavLink>
</p>
</div>   
)})

let albumList = albums.map(e => {
return (
<div style={{zIndex:z}} key={e.name} className="hov grid-item3">
<NavLink className="navTo" to={`/albums/${e.id}?artist=${artistId}`}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="200" height="200" src={e.cover_img}></img>
</NavLink>
<p>
<NavLink className="navTo" to={`/albums/${e.id}?artist=${artistId}`}>{e.name}</NavLink>
</p>
</div>   
)
})    

let x = () => {
return (
<div style={{marginLeft:'50px', width:"96.5%"}}>
<p className="dataTitle">{e.name}</p>
<br/><br/>


<div style={{width:'100%', marginTop:'-105px', color:"white", display:"flex"}}>

<div style={{fontSize:'20px', width:'36%', marginRight:"2%"}}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="100%" height="450px" src={e.cover_img}></img>
<br/>
<i><strong>{e.is_liked}</strong> people liked this artist</i><br/>

</div>


<div style={{width:'62%', marginLeft:'40px'}}>
<h6 style={{textAlign:"left", left:"2%"}} className="songsTitle">Songs</h6>
<div className="artistData">
{songList}
</div><br/><br/><br/><br/><br/>
<h6 style={{textAlign:"left", left:"2%"}} className="songsTitle">Albums</h6>
<div className="artistData">
{albumList}
</div>
</div>

</div>
<NavLink className="fa fa-arrow-left back" to="/artists"></NavLink>
</div>
)}
setArtist(x)
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
{artist}
</div>
  );
  }

export default ArtistData;
