/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import {
  NavLink,
} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";
import {
  ButtonBack, ButtonNext, CarouselProvider, Slide, Slider,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import UserContext from '../UserContext'
import { useStateIfMounted } from "use-state-if-mounted";

function Home(props) {
const [songs, setSongs] = useStateIfMounted([]);
const [albums, setAlbums] = useStateIfMounted([]);
const [artists, setArtists] = useStateIfMounted([]);
const [playlists, setPlaylists] = useStateIfMounted([]);
const [loading, setLoading] = useStateIfMounted(true);

const [songsLength, setSongsLength] = useStateIfMounted(0);
const [albumsLength, setAlbumsLength] = useStateIfMounted(0);
const [artistsLength, setArtistsLength] = useStateIfMounted(0);
const [playlistsLength, setPlaylistsLength] = useStateIfMounted(0);

const user = useContext(UserContext)

useEffect(() => {
    const fetchData = async () => {
      try {
      const songs = await axios.get(`/api/songs`)
      const albums = await axios.get(`/api/albums`);
      const artists = await axios.get(`/api/artists`);
      const playlists = await axios.get(`/api/playlists`);
      makeLists(songs.data, albums.data, artists.data, playlists.data)
      setLoading(false)
      }
       catch(response) {
      setLoading(false)
      return alert(response)
      }
    }; fetchData();
   }, [])

const playCount = async (e) => {
await axios.patch(`/api/songs/count/${e.youtube_id}`, {
play_count: e.play_count + 1,
});
};

const makeLists = (songs, albums, artists, playlists) => {
let z =30;
let index= 0;

let sArray = songs.map(e => {
setSongsLength(songs.length)
index++;
z--;
return (
<Slide index={index} style={{zIndex: z}} key={e.youtube_id} className="hov carouselist">
<div>
<p>
<NavLink className="navTo" to={`/songs/${e.youtube_id}`} >{e.title} - {e.Artist.name}</NavLink>
</p>
<YouTube className="video" onPlay={() => playCount(e)}videoId={e.youtube_id} id="video" opts={{width:"250",height:"250"}}/>
<br/><br/>
</div>
</Slide>
)}
)



let alArray = albums.map(e => {
setAlbumsLength(albums.length)
z--;
return (
<Slide style={{zIndex: z}} key={e.name} className="hov carouselist">
<p>
<NavLink className="navTo" to={`/albums/${e.id}`} >
{e.name} - {e.Artist.name}
</NavLink>
</p>
<NavLink className="navTo" to={`/albums/${e.id}`} >
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="250" height="250" src={e.cover_img}></img>
</NavLink>
<br/><br/>
</Slide>
)}
)

let arArray = artists.map(e => {
z--;
setArtistsLength(artists.length)
return (
<Slide style={{zIndex: z}} key={e.name} className="hov carouselist">
<p>
<NavLink className="navTo" to={`/artists/${e.id}`}>
{e.name}
</NavLink>
</p>
<NavLink className="navTo" to={`/artists/${e.id}`}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="250" height="250" src={e.cover_img}></img>
</NavLink>
<br/><br/>
</Slide>
)}
)

let pArray = playlists.map(e => {
z--;
setPlaylistsLength(playlists.length)
return (
<Slide style={{zIndex: z}} key={e.name} className="hov carouselist">
<p>
<NavLink className="navTo" to={`/playlists/${e.id}`}>
{e.name}
</NavLink>
</p>
<NavLink className="navTo" to={`/playlists/${e.id}`}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="250" height="250" src={e.cover_img}></img>
</NavLink>
<br/><br/>
</Slide>
)}
)
setSongs(sArray)
setAlbums(alArray)
setArtists(arArray)
setPlaylists(pArray)
}

const override =`
  position:absolute;
  width:200px;
  height:200px;
  margin-top:200px;
  left: 40%;
`;

const arrowColor = loading ? 'rgb(10, 10, 10)' : 'rgb(149, 243, 215)';

  return (
    <div>
<LoadingOverlay
  active={loading}
  spinner={<ClipLoader css={override} color="white" style={{zIndex:1010}} size={150}/>}
  >
  </LoadingOverlay>


<h3>Hello, {user ? user.username : 'Guest'}</h3>


<div className="homeLists">
<h4> Top Songs </h4> 
  <CarouselProvider
    naturalSlideWidth={25}
    naturalSlideHeight={35}
    visibleSlides={4}
    totalSlides={songsLength}
    step={4}
    infinite
  >
<Slider style={{maxHeight:"420px"}}>
{songs}
</Slider>
    <ButtonBack style={{color:arrowColor}} className="arrow fa fa-arrow-left" ></ButtonBack>
    <ButtonNext style={{color:arrowColor, float:"right"}}  className="arrow fa fa-arrow-right"></ButtonNext>
</CarouselProvider>


<h4> Top Albums </h4> 
  <CarouselProvider
    naturalSlideWidth={25}
    naturalSlideHeight={35}
    visibleSlides={4}
    totalSlides={albumsLength}
    step={4}
    infinite
  >
<Slider style={{maxHeight:"420px"}}>
{albums}
</Slider>
    <ButtonBack style={{color:arrowColor}} className="arrow fa fa-arrow-left" ></ButtonBack>
    <ButtonNext style={{color:arrowColor, float:"right"}} className="arrow fa fa-arrow-right"></ButtonNext>
</CarouselProvider>

<h4> Top Artists </h4> 
  <CarouselProvider
    naturalSlideWidth={25}
    naturalSlideHeight={35}
    visibleSlides={4}
    totalSlides={artistsLength}
    step={4}
    infinite
  >
<Slider style={{maxHeight:"420px"}}>
{artists}
</Slider>
    <ButtonBack style={{color:arrowColor}} className="arrow fa fa-arrow-left" ></ButtonBack>
    <ButtonNext style={{color:arrowColor, float:"right"}} className="arrow fa fa-arrow-right"></ButtonNext>
</CarouselProvider>

<h4> Top Playlists </h4> 
  <CarouselProvider
    naturalSlideWidth={25}
    naturalSlideHeight={35}
    visibleSlides={4}
    totalSlides={playlistsLength}
    step={4}
    infinite
  >
<Slider style={{maxHeight:"420px"}}>
{playlists}
</Slider>
    <ButtonBack style={{color:arrowColor}}className="arrow fa fa-arrow-left" ></ButtonBack>
    <ButtonNext style={{color:arrowColor, float:"right"}} className="arrow fa fa-arrow-right"></ButtonNext>
</CarouselProvider>
</div>

</div>
  );
}

export default Home;
