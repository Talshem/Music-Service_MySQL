import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  NavLink,
} from "react-router-dom";
import Select from 'react-select';

function PostAlbum(props) {
const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setArtists(await (await axios.get(`/top_artists`)).data);
    }; fetchData();
   }, []);
  
function validateDate(date) {
 if (/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(date))
  {
    return (true)
  }
    return (false)
}

  const addAlbum = async (name, image, artist, created_at) => {
   let regex = /'/gi
  const newCreated_at = created_at.slice(0,10)
    if (!validateDate(newCreated_at)) {
    return document.getElementById('albumError').innerHTML = "Release date form is invalid";
    }
    if (!props.user) {
    return document.getElementById('albumError').innerHTML = 'Only registered users can post new albums to the website!';
    }
    if(!artist) {
    return document.getElementById('albumError').innerHTML = "Select an artist";
    }
  const newName = name.replace(regex,`''`);
  const newArtist = artist.value.replace(regex,`''`);
    try{
    await axios.post(`/album`, {
    name: newName, 
    artist: newArtist, 
    cover_img: image,
    created_at: newCreated_at,
    })
  document.getElementById("albumForm").reset();
} catch (response){
   document.getElementById('albumError').innerHTML = "Album already exists";
  }; 
};


function form(){
let name;
let image;
let created_at;
let artist;

      function insertName(event) {
        name = event.target.value;
      }
      function insertImage(event) {
        image = event.target.value;
      }

      function insertRelease(event) {
        created_at = event.target.value;
      }

      function insertArtist(event) {
        artist = event;
      }

let selectArtist = artists.map(e => ({ value: e.name, label: e.name }))

return (
 <form id="albumForm" className="albumForm" onSubmit={() => addAlbum(name, image, artist, created_at)}>
   <div>
    <label> Name of the Album: </label><br/>
    <input required type="text" id="title" defaultValue={name} onChange={insertName}/> <br/><br/>
    <label>Artist: </label><i class='tooltip fas fa-info'> <span class="tooltiptext">You can only post albums of uploaded artists</span></i><br/>
    <Select style={{}} required maxMenuHeight={160}
    defaultValue={artist}
    onChange={insertArtist}
    options={selectArtist}>
    </Select><br/>
    <label> Cover image URL </label><br/>
    <input required type="text" defaultValue={image} onChange={insertImage}/><br/><br/>
    <label> Release date: </label><i class='tooltip fas fa-info'> <span class="tooltiptext">Y Y Y Y - M M - D D</span></i><br/>
    <input required type="text" defaultValue={created_at} onChange={insertRelease}/><br/><br/>
    <input type='submit' style={{left:'410px'}} className="post" value="Post Album"/>
    </div>
    </form>

)}

  return (
<div> 
{form()}
<NavLink className="fa fa-arrow-left back" style={{left:"84px"}} to="/Albums"></NavLink>
<p id="albumError" style={{marginTop:"0px", marginLeft:"130px", fontSize:'20px', color:"red"}}></p>
</div>
  );
  }

export default PostAlbum;
