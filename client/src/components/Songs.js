import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

const makeSongs = (songs) => {
let array = songs.map(e => {
return (
<li key={e.id} className="grid-item">
<p>{e.title}</p>
<iframe width="150" height="150" src={e.youtube_link}>
</iframe>
</li>
)}
)
setList(array)
}



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
