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

function SongData(props) {
const [song, setSong] = useState(undefined)
const [loading, setLoading] = useState(true);

let { songId } = useParams();

const playCount = async (e) => {
await axios.put(`/count`, {
song_id: e.youtube_id,
count: e.play_count + 1,
});
};

useEffect(() => {
  const fetchData = async () => {
      try{
      const { data } = await axios.get(`/song/${songId}`)
      if (data[0].length !== 0){
      makeID(data[0])
      }
  } catch(response) {
        setLoading(false)
    return setSong(<p style={{top:"420px", fontSize:"120px",textAlign:"right",width:"86%"}} className="listTitle">Unknown song</p>)
  }
    }; fetchData();
   }, [])


       
function makeID(e){

let lyrics = '' 
lyrics = e.lyrics.split("&&").map(function(item, idx) {
        return (
            <span key={idx}>
                {item}
                <br/>
            </span>
         )}) 

let x = () => {
return(
<div  style={{marginLeft:'50px'}}>
<p className="dataTitle">{e.title}</p>
<br/>
<div className="songDataPage">
<div>
<YouTube className="video" onPlay={() => playCount(e)} videoId={e.youtube_id} id="video" opts={{width:"600",height:"600"}}/>
<br/>
<i><strong>{e.is_liked}</strong>  people liked this song</i><br/>
<br/><br/><br/><br/><br/><br/><br/>
<i><strong>Views:</strong>{" "} {e.play_count}</i><br/>
<i><strong>Album:</strong>{" "}{e.album}</i><br/>
<i><strong>Artist:</strong>{" "} {e.artist}</i><br/>
<i><strong>Release date:</strong>{" "} {e.created_at.substr(0, 10)}</i><br/><br/>
</div>
<div className="dataLyrics">
<strong style={{fontSize:"30px"}}>Lyrics:</strong><br/>
<br/>
{lyrics}
</div>
</div>
</div>
)}
setSong(x)
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
<div>
  <LoadingOverlay
  active={loading}
  spinner={<ClipLoader css={override} color="white" style={{zIndex:1010}} size={150}/>}
  >
  </LoadingOverlay>
{song}
{song ? <NavLink style={{marginTop:'-35px', marginLeft:'50px'}}  className="fa fa-arrow-left back" to="/songs"></NavLink> : ''}
</div>
  );
  }

export default SongData;
