/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import {
  NavLink,
} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";
import generator from 'generate-password'

function Uploads(props) {
const [songs, setSongs] = useState([]);
const [albums, setAlbums] = useState([]);
const [artists, setArtists] = useState([]);
const [playlists, setPlaylists] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState('');
const [user, setUser] = useState(generator.generate({
    length: 20,
    numbers: true
}))
const [toggle, setToggle] = useState(false);

useEffect(() => {
if(props.user){
let user = props.user.email;
setUser(user)
}}, [props.user])

useEffect(() => {
    const fetchData = async () => {
      try {
      const songs = await axios.get(`/top_songs?name=${search}`)
      const albums = await axios.get(`/top_albums?name=${search}`);
      const artists = await axios.get(`/top_artists?name=${search}`);
      const playlists = await axios.get(`/top_playlists?name=${search}`);
      let songList = songs.data[0].filter(e => e.user === user);
      let albumList = albums.data.filter(e => e.user === user);
      let artistList = artists.data.filter(e => e.user === user);
      let playlistList = playlists.data.filter(e => e.user === user);
      makeLists(songList, albumList, artistList, playlistList)
      } catch(response) {
    setLoading(false)
    return alert(response)
      }
    }; fetchData();
   }, [toggle, user])

const handleSearch = () => {
setToggle(!toggle)
setLoading(true)
}

   const playCount = async (e) => {
await axios.put(`/count`, {
song_id: e.youtube_id,
count: e.play_count + 1,
});
};

const deleteSong = async (e) => {
const newId = e.youtube_id.replace(`'`,`''`);
await axios.delete(`/song/${newId}`);
setToggle(!toggle)
};
const deleteArtist = async (e) => {
const newName = e.name.replace(`'`,`''`);
await axios.delete(`/artist/${newName}`);
setToggle(!toggle)
};
const deleteAlbum = async (e) => {
const newName = e.name.replace(`'`,`''`);
await axios.delete(`/album/${newName}`);
setToggle(!toggle)
};
const deletePlaylist = async (e) => {
await axios.delete(`/playlist/${e.id}`);
setToggle(!toggle)
};


const makeLists = (songs, albums, artists, playlists) => {

let sArray = songs.map(e => {

const deleteButton = <button onClick={() => deleteSong(e)} style={{ width:"130px"}} className="deleteButton">Delete song</button>;

return (
<li key={e.youtube_id} className="hov">
<p>
<NavLink className="navTo" to="/SongData" onClick={() => props.song(e)}>{e.title}</NavLink>
</p>
<YouTube className="video" onPlay={() => playCount(e)}videoId={e.youtube_id} id="video" opts={{width:"125",height:"125"}}/>
<br/>
{deleteButton}
</li>
)}
)


let alArray = albums.map(e => {
const deleteButton = <button onClick={() => deleteAlbum(e)} style={{ width:"130px"}} className="deleteButton">Delete album</button>;
return (
<li key={e.name} className="hov">
<p>
<NavLink className="navTo" to="/AlbumData" onClick={() => props.album(e)}>
{e.name}
</NavLink>
</p>
<NavLink className="navTo" to="/AlbumData" onClick={() => props.album(e)}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="125" height="125" src={e.cover_img}></img>
</NavLink>
<br/>
{deleteButton}
</li>
)}
)

let arArray = artists.map(e => {
const deleteButton = <button onClick={() => deleteArtist(e)} style={{ width:"130px"}} className="deleteButton">Delete artist</button>;
return (
<li key={e.name} className="hov">
<p>
<NavLink className="navTo" to="/ArtistData" onClick={() => props.artist(e)}>
{e.name}
</NavLink>
</p>
<NavLink className="navTo" to="/ArtistData" onClick={() => props.artist(e)}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="125" height="125" src={e.cover_img}></img>
</NavLink>
<br/>
{deleteButton}
</li>
)}
)
let pArray = playlists.map(e => {
const deleteButton = <button onClick={() => deletePlaylist(e)} style={{ width:"130px"}} className="deleteButton">Delete playlist</button>;
return (
<li key={e.name} className="hov">
<p>
<NavLink className="navTo" to="/PlaylistData" onClick={() => props.playlist(e)}>
{e.name}
</NavLink>
</p>
<NavLink className="navTo" to="/PlaylistData" onClick={() => props.playlist(e)}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="125" height="125" src={e.cover_img}></img>
</NavLink>
<br/>
{deleteButton}
</li>
)}
)
setSongs(sArray)
setAlbums(alArray)
setArtists(arArray)
setPlaylists(pArray)
setLoading(false)
}

const override =`
  display: block;
  position:absolute;
  width:200px;
  height:200px;
  top:180px;
  left: 375px;
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
<p style={{marginLeft:"47px", marginTop:"10px"}}className='listTitle'>My Uploads</p>
<input style={{marginLeft:"47px",marginTop:'95px'}} className="filterList" onChange={(event) => setSearch(event.target.value)} /> 
<button style={{marginLeft:"620px" ,marginTop:'95px'}}onClick={() => handleSearch()} className="searchButton">Search</button>
<div className='uploadsList'>
<div className="upload" ><h6 className="upTitle">Songs</h6>{songs}</div>
<div className="upload" ><h6 className="upTitle">Albums</h6>{albums}</div>
<div className="upload" ><h6 className="upTitle">Artists</h6>{artists}</div>
<div className="upload" ><h6 className="upTitle">Playlists</h6>{playlists}</div>
</div>
</div>
  );
  }

export default Uploads;
