import React from 'react';
import axios from 'axios';
import {
  NavLink,
} from "react-router-dom";

function PostArtist(props) {

  const addArtist = async (event, name, image) => {
  event.preventDefault();
  let regex = /'/gi
  const newName = name.replace(regex,`''`);
    try{
    await axios.post(`/artist`, {
    name: newName, 
    cover_img: image,
    user: props.user.email,
    user_name: props.user.username
    })
  document.getElementById("artistForm").reset();
} catch (response){
   document.getElementById('artistError').innerHTML = "Undetected Error";
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
