import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  NavLink,
  HashRouter
} from "react-router-dom";
import YouTube from 'react-youtube';

function ArtistData(props) {
const [songs, setSongs] = useState([])

const playCount = async (e) => {
await axios.put(`/count`, {
song_id: e.youtube_id,
count: e.play_count + 1,
});
};

useEffect(() => {
    const fetchData = async () => {
    if(props.artist){
      const { data } = await axios.get(`/top_songs?artist=${props.artist.name}`);
      setSongs(data[2])
          }
    }; fetchData();
   }, [props.artist])

function data(e){
if(e) {

let list = songs.map(e => {
return (
<li key={e.youtube_id} className="grid-item2">
<p>
<NavLink className="navTo" to="/SongData" onClick={() => props.song(e)}>{e.title}</NavLink>
</p>
<YouTube className="video" onPlay={() => playCount(e)} videoId={e.youtube_id} id="video" opts={{width:"150",height:"150"}}/>
</li>   
)
})    

return (
<div style={{color:"white", display:"flex"}}>
<div>
<img alt={e.name} width="250" height="250" src={e.cover_img}></img>
<br/>
<i><strong>{e.is_liked}</strong> people liked this artist</i><br/>
<br/><br/><br/><br/><br/>
<HashRouter>
<NavLink style={{marginLeft:"0px"}} className="fa fa-arrow-left back" to="/Albums"></NavLink>
</HashRouter>
</div>
<div className="dataSongs">
<h6 className="songsTitle">Songs</h6>
{list}
</div>
</div>
);
}}


  return (
<div style={{position:'absolute', top:"-30px", left:"180px"}}>
<p className="dataTitle">{props.artist.name}</p>
<br/><br/>
{data(props.artist)}
</div>
  );
  }

export default ArtistData;
