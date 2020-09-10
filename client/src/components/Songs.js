import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';

function Songs(props) {
const [list, setList] = useState([])
const [search, setSearch] = useState('')

useEffect(() => {
    const fetchData = async () => {
      const songs = await (await axios.get(`/top_songs`)).data;
      let list = songs.filter(e => e.title.toUpperCase().includes(search.toUpperCase()))
      makeSongs(list)
    }; fetchData();
   }, [search])

const playCount = async (e) => {
await axios.put(`/count`, {
song_id: e.id,
count: e.play_count + 1,
});
};

const isLiked = async (e) => {

}

const makeSongs = (songs) => {
let array = songs.map(e => {
return (
<li key={e.id} className="grid-item">
<p><span style={{cursor:'pointer'}} onClick={() => isLiked(e)}>{unliked}</span> {e.title}</p>
<YouTube onPlay={() => playCount(e)} videoId={e.youtube_id} id="video" opts={{width:"150",height:"150"}}/>
</li>
)}
)
setList(array)
}

let liked = <span >&#9829;</span>;
let unliked = <span>&#9825;</span>;

  return (
<div> 
<input className="filterList" placeholder="Search..." onChange={(event) => setSearch(event.target.value)} /> 
<button className="Add">+</button>  
<ul className="grid-container">
{list}
</ul>
</div>
  );
}

export default Songs;
