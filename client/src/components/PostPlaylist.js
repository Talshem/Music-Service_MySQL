import React from 'react';
import axios from 'axios';
import {
  NavLink,
  HashRouter
} from "react-router-dom";

function PostPlaylist(props) {
  
function validateDate(date) {
 if (/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(date))
  {
    return (true)
  }
    return (false)
}

  const addPlaylist = async (name, songs, image, created_at) => {
    const newCreated_at = created_at.slice(0,10)
    if (!validateDate(newCreated_at)) {
    return document.getElementById('playlistError').innerHTML = "Release date form is invalid";
    }
    if (!props.user) {
    return document.getElementById('playlistError').innerHTML = 'Only registered users can post new playlists to the website!';
    }
  const newName = name.replace(`'`,`''`);
  const newSongs = songs.replace(`'`,`''`);
    try{
    await axios.post(`/playlist`, {
    name: newName, 
    songs: [newSongs], 
    cover_img: image,
    created_at: newCreated_at,
    })
  document.getElementById("playlistForm").reset();
} catch (response){
   document.getElementById('playlistError').innerHTML = "Undetected error";
  }; 
};


function form(){
let name;
let songs;
let image;
let created_at

      function insertName(event) {
        name = event.target.value;
      }
      function insertSongs(event) {
      songs = event.target.value;
      }
      function insertImage(event) {
        image = event.target.value;
      }

      function insertRelease(event) {
        created_at = event.target.value;
      }


return (
 <form id="playlistForm" className="playlistForm" onSubmit={() => addPlaylist(name, songs, image, created_at)}>
   <div>
    <label> Name of the Playlist: </label><br/>
    <input required type="text" defaultValue={name} onChange={insertName}/> <br/><br/>
    <label> Songs: </label><i class='tooltip fas fa-info'> <span className="tooltiptext">Add a comma after every song</span></i><br/>
    <textarea rows="5" required type="text" defaultValue={songs} onChange={insertSongs}/> <br/><br/>
    <label> Cover image URL </label><br/>
    <input required type="text" defaultValue={image} onChange={insertImage}/><br/><br/>
    <label> Release date: </label><i class='tooltip fas fa-info'> <span className="tooltiptext">Y Y Y Y - M M - D D</span></i><br/>
    <input required type="text" defaultValue={created_at} onChange={insertRelease}/><br/><br/>
    <input type='submit' style={{left:'400px'}} className="post" value="Post Playlist"/>
    </div>
    </form>

)}

  return (
<div> 
{form()}
<HashRouter>
<NavLink className="fa fa-arrow-left back" style={{left:"83px"}} to="/Playlists"></NavLink>
</HashRouter>
<p id="playlistError" style={{marginTop:"-2px", marginLeft:"120px", fontSize:'20px', color:"red"}}></p>
</div>
  );
  }

export default PostPlaylist;
