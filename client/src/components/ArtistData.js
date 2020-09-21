/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  NavLink,
  useParams,
} from "react-router-dom";
import YouTube from 'react-youtube';
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";


function ArtistData(props) {
const [songs, setSongs] = useState([])
const [albums, setAlbums] = useState([])
const [loading, setLoading] = useState(true);
const [artist, setArtist] = useState(undefined)
const [name, setName] = useState(undefined)

let { artistId } = useParams();

const playCount = async (e) => {
await axios.put(`/count`, {
song_id: e.youtube_id,
count: e.play_count + 1,
});
};


useEffect(() => {
  const fetchData = async () => {
      try{
      const { data } = await axios.get(`/artist/${artistId}`)
      setName(data[0].name)
      if (data[0].length !== 0){
      makeID(data[0])
      }
  } catch(response) {
        setLoading(false)
    return setArtist(<p style={{top:"440px", fontSize:"120px",textAlign:"right",width:"86%"}} className="listTitle">Unknown artist</p>)
  }
    }; fetchData();
   }, [songs, albums])


   useEffect(() => {
    const fetchData = async () => {
      try {
      const album = await axios.get(`/top_albums?artist=${name}`);
      setAlbums(album.data[1])
      const song = await axios.get(`/top_songs?artist=${name}`);
      setSongs(song.data[2])
    } catch { return }
    }; fetchData();
   }, [name])


function makeID(e){


let songList = songs.map(e => {
return (
<div key={e.youtube_id} className="grid-item2">
<p>
<NavLink className="navTo" to={`/songs/${e.youtube_id}?name=${artistId}`}>{e.title}</NavLink>
</p>
<YouTube className="video xxx" onPlay={() => playCount(e)} videoId={e.youtube_id} opts={{width:'200', height:'200'}} id="video"/>
</div>   
)})

let albumList = albums.map(e => {
return (
<div key={e.name} className="grid-item2">
<p>
<NavLink className="navTo" to={`/albums/${e.id}?name=${artistId}`}>{e.name}</NavLink>
</p>
<NavLink className="navTo" to={`/albums/${e.id}?name=${artistId}`}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="200" height="200" src={e.cover_img}></img>
</NavLink>
</div>   
)
})    

let x = () => {
return (
<div style={{marginLeft:'50px', width:"96.5%"}}>
<p className="dataTitle">{e.name}</p>
<br/><br/>


<div style={{width:'100%', marginTop:'-105px', color:"white", display:"flex"}}>

<div style={{fontSize:'20px', width:'36%', marginRight:"2%"}}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="100%" height="72%" src={e.cover_img}></img>
<br/>
<i><strong>{e.is_liked}</strong> people liked this artist</i><br/>

</div>


<div style={{width:'62%'}}>
<h6 className="songsTitle">Songs</h6>
<div style={{marginBottom:"10%", height:"240px", whiteSpace:"nowrap"}} className="dataSongs">
{songList}
</div>
<h6 className="songsTitle">Albums</h6>
<div style={{height:"240px", whiteSpace:"nowrap"}} className="dataSongs">
{albumList}
</div>
</div>

</div>
<NavLink style={{marginTop:'-35px'}} className="fa fa-arrow-left back" to="/artists"></NavLink>
</div>
)}
setArtist(x)
setTimeout(() => {
setLoading(false) 
}, 1500);
}


const override =`
  position:absolute;
  width:200px;
  height:200px;
  margin-top:200px;
  left: 40%;
`;

  return (
<div>
  <LoadingOverlay
  active={loading}
  spinner={<ClipLoader css={override} color="white" style={{zIndex:1010}} size={150}/>}
  >
  {loading ?
  <p style={{left:"0", top:"-15px", zIndex:"1007", background:"rgb(0,0,0,0.5)", position:"fixed", width:"100vw", height:"100vh"}}></p> : ''
  }
  </LoadingOverlay>
{artist}
</div>
  );
  }

export default ArtistData;
