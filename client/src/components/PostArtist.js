import React from 'react';
import axios from 'axios';
import {
  NavLink,
} from "react-router-dom";

function PostArtist(props) {

  const addArtist = async (name, image) => {
  let regex = /'/gi
  const newName = name.replace(regex,`''`);
    try{
    await axios.post(`/artist`, {
    name: newName, 
    cover_img: image,
    })
  document.getElementById("artistForm").reset();
} catch (response){
   document.getElementById('artistError').innerHTML = "Artist already exists";
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
 <form id="artistForm" className="artistForm" onSubmit={() => addArtist(name, image)}>
   <div>
    <label> Name of the Artist: </label><br/>
    <input required type="text" defaultValue={name} onChange={insertName}/> <br/><br/>
    <label> Artist image URL </label><br/>
    <input required type="text" defaultValue={image} onChange={insertImage}/><br/><br/>
    <input type='submit' style={{left:'418px'}} className="post" value="Post Artist"/>
    </div>
    </form>

)}

  return (
<div> 
{form()}
<NavLink className="fa fa-arrow-left back" style={{left:"83px"}} to="/Artists"></NavLink>
<p id="artistError" style={{marginTop:"-2px", marginLeft:"120px", fontSize:'20px', color:"red"}}></p>
</div>
  );
  }

export default PostArtist;
