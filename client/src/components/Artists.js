import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Artists(props) {
const [list, setList] = useState([])
const [search, setSearch] = useState('')

useEffect(() => {
    const fetchData = async () => {
      const artists = await (await axios.get(`/top_artists`)).data;
      let list = artists.filter(e => e.name.toUpperCase().includes(search.toUpperCase()))
      makeArtists(list)
    }; fetchData();
   }, [search])

const makeArtists = (artists) => {
let array = artists.map(e => {
return (
<li key={e.name} className='grid-item'>
<p>{e.name}</p>
<img alt={e.name} width="150" height="150" src={e.cover_img}>
</img>
</li>
)}
)
setList(array)
}



  return (
<div> 
  <p className='listTitle'>Artists</p>
<input className="filterList" placeholder="Search..." onChange={(event) => setSearch(event.target.value)} />
<i className="fa fa-plus-square-o add"></i>
<ul className="grid-container">
{list}
</ul>
</div>
  );
}

export default Artists;
