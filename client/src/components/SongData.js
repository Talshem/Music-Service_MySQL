import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  NavLink,
  HashRouter
} from "react-router-dom";
import YouTube from 'react-youtube';

function SongData(props) {

let lyrics = ''    

if(props.song){
lyrics = props.song.lyrics.split("&&").map(function(item, idx) {
        return (
            <span key={idx}>
                {item}
                <br/>
            </span>
         )})
        }

const playCount = async (e) => {
await axios.put(`/count`, {
song_id: e.youtube_id,
count: e.play_count + 1,
});
};

function data(e){
if(e) {

return (
<div style={{color:"white", display:"flex"}}>
<div>
<YouTube className="video" onPlay={() => playCount(e)} videoId={e.youtube_id} id="video" opts={{width:"250",height:"250"}}/>
<br/>
<i>{e.is_liked} people liked this song</i><br/>
<br/>
<i><strong>Views:</strong>{" "} {e.play_count}</i><br/>
<i><strong>Album:</strong>{" "}{e.album}</i><br/>
<i><strong>Artist:</strong>{" "} {e.artist}</i><br/>
<i><strong>Release date:</strong>{" "} {e.created_at.substr(0, 10)}</i><br/><br/>
<HashRouter>
<NavLink style={{marginLeft:"0px"}} className="fa fa-arrow-left back" to="/Songs"></NavLink>
</HashRouter>
</div>
<div className="dataLyrics">
{lyrics}
</div>
</div>);
}}


  return (
<div style={{position:'absolute', top:"-30px", left:"180px"}}>
<p className="dataTitle">{props.song.title}</p>
{data(props.song)}
</div>
  );
  }

export default SongData;
