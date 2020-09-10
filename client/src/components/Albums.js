import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Albums(props) {
const [list, setList] = useState([])
const [search, setSearch] = useState('')

useEffect(() => {
    const fetchData = async () => {
      const albums = await (await axios.get(`/top_albums`)).data;
      let list = albums.filter(e => e.name.toUpperCase().includes(search.toUpperCase()))
      makeAlbums(list)
    }; fetchData();
   }, [search])

const makeAlbums = (albums) => {
let array = albums.map(e => {
return (
<li key={e.id} class='grid-item'>
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
<input className="filterList" placeholder="Search..." onChange={(event) => setSearch(event.target.value)} />
<button className="Add">+</button>  
<ul className="grid-container">
{list}
</ul>
</div>
  );
}

export default Albums;
