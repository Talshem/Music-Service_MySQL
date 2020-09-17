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
    return setArtist(<p style={{top:"400px", fontSize:"120px",textAlign:"right",width:"1230px"}} className="listTitle">Unknown artist</p>)
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
<li key={e.youtube_id} className="grid-item2">
<p>
<NavLink className="navTo" to={`/songs/${e.youtube_id}?name=${artistId}`}>{e.title}</NavLink>
</p>
<YouTube className="video" onPlay={() => playCount(e)} videoId={e.youtube_id} id="video" opts={{width:"200",height:"200"}}/>
</li>   
)})

let albumList = albums.map(e => {
return (
<li key={e.name} className="grid-item2">
<p>
<NavLink className="navTo" to={`/albums/${e.id}?name=${artistId}`}>{e.name}</NavLink>
</p>
<NavLink className="navTo" to={`/albums/${e.id}?name=${artistId}`}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="200" height="200" src={e.cover_img}></img>
</NavLink>
</li>   
)
})    

let x = () => {
return (
<div style={{marginLeft:'50px'}}>
<p className="dataTitle">{e.name}</p>
<br/><br/>
<div style={{marginTop:'-105px', color:"white", display:"flex"}}>
<div style={{fontSize:'20px'}}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="450" height="450" src={e.cover_img}></img>
<br/>
<i><strong>{e.is_liked}</strong> people liked this artist</i><br/>
<br/><br/><br/><br/><br/>
<NavLink style={{marginLeft:"0px"}} className="fa fa-arrow-left back" to="/Albums"></NavLink>
</div>
<div>
<div style={{height:"300px"}} className="dataSongs">
<h6 className="songsTitle">Songs</h6>
{songList}
</div>
<br/><br/><br/>
<div style={{height:"300px"}} className="dataSongs">
<h6 className="songsTitle">Albums</h6>
{albumList}
</div>
</div>
</div>
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
