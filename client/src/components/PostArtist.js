import React, { useContext } from 'react';
import {
  NavLink,
} from "react-router-dom";
import UserContext from '../UserContext'
import network from '../Network.js';

function PostArtist(props) {

  const user = useContext(UserContext)

  const addArtist = async (event, name, image) => {
  event.preventDefault();
  const date = new Date();

    try{
    await network.post(`/api/artists`, {
    name: name, 
    cover_img: image,
    username: user.username,
    upload_at: date.toISOString().substring(0, 10)
    })
  document.getElementById("artistForm").reset();
} catch (response){
   document.getElementById('artistError').innerHTML = "Only registered users can post new artists to the website";
  }; 
};


function form(){
let name;
let image;

      function insertName(event) {
        name = event.target.value;
      }
      function insertImage(event) {
        image = event.target.value;
      }

return (
 <form id="artistForm" onSubmit={(event) => addArtist(event, name, image)}>
   <div>
    <label> Name of the Artist: </label><br/>
    <input id="artist_name" required type="text" defaultValue={name} onChange={insertName}/> <br/><br/>
  <br/> <br/>
    <label> Artist image URL </label><br/>
    <input id="artist_img" required type="text" defaultValue={image} onChange={insertImage}/><br/><br/>
  <br/> <br/>
    <input type='submit' className="post" value="Post Artist"/>
    <NavLink style={{marginTop:'-50px'}} className="fa fa-arrow-left back" to="/Artists"></NavLink>
    </div>
    </form>

)}

  return (
<div className="artistForm"> 
{form()}
<p id="artistError" style={{marginTop:"-2px", marginLeft:"120px", fontSize:'20px', color:"red"}}></p>
</div>
  );
  }

export default PostArtist;
