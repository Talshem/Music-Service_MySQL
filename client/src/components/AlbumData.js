/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import axios from 'axios';
import {
  NavLink,
  useParams,
} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";
import { useStateIfMounted } from "use-state-if-mounted";
import ReactPlayer from 'react-player/youtube'

function AlbumData(props) {

const [album, setAlbum] = useStateIfMounted(undefined);
const [loading, setLoading] = useStateIfMounted(true);

let { albumId } = useParams();


   useEffect(() => {
  const fetchData = async () => {
      try{
      const { data } = await axios.get(`/api/albums/${albumId}`)
      makeID(data.album, data.songs)
      } catch(response) {
        setLoading(false)
  return setAlbum(<p style={{top:"430px", fontSize:"120px",textAlign:"right",width:"86%"}} className="listTitle">Unknown album</p>)
  }
    }; fetchData();
   }, [])


const makeID = (e, songs) => {

let url = [];

let list = songs.map(e => {
url.push(`https://www.youtube.com/watch?v=${e.youtube_id}`)
return (
<li key={e.youtube_id} className="test">
<NavLink className="navTo" to={`/songs/${e.youtube_id}?album=${albumId}`} >
<span>	&#119136; &nbsp; {e.title} </span>
<span style={{float:"right"}}>{e.length}</span>
</NavLink>
</li>   
)
})    

let x = () => {
return (
<div  style={{marginLeft:'50px'}}>
<p className="dataTitle">{e.name}</p>

<div style={{width:'100%', marginTop:'-60px', color:"white", display:"flex"}}>

<div style={{fontSize:'20px', width:'36%', marginRight:"2%"}}>
<ReactPlayer playing url={url} controls={true} width="100%" height="450px" /><br/>
<i><strong>{e.is_liked}</strong> people liked this album</i><br/>
<br/><br/>
<i><strong>Artist:</strong>{" "} {e.Artist.name}</i><br/>
<i><strong>Release date:</strong>{" "} {e.created_at.substr(0, 10)}</i>
</div>

<div style={{width:'62%'}}>
<h6 className="songsTitle">Songs</h6>
<div className="dataTest">
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
album ? <div>
  <LoadingOverlay
  active={loading}
  spinner={<ClipLoader css={override} color="white" style={{zIndex:1010}} size={150}/>}
  >
  </LoadingOverlay>
{album}
</div>
: null
  );
  }

export default AlbumData;
