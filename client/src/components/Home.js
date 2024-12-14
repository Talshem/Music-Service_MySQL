/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
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


useEffect(() => {
    const fetchData = async () => {
      try {
      const { data: songs } = await axios.get(`/api/songs/top`)
      const { data: albums } = await axios.get(`/api/albums/top`)
      const { data: artists } = await axios.get(`/api/artists/top`)
      const { data: playlists } = await axios.get(`/api/playlists/top`)
      console.log(albums)
      makeLists(songs, albums, artists, playlists) 
      setLoading(false)
      }
       catch(response) {
      setLoading(false)
      }
    }; fetchData();
   }, [])


const playCount = async (e) => {
await axios.patch(`/api/songs/count/${e.youtube_id}`, {
play_count: e.play_count + 1,
});
};

const makeLists = (songs, albums, artists, playlists) => {
let sArray = songs.map(e => {
setSongsLength(songs.length)
return (
<Slide key={e.youtube_id} className="hov carouselist">
<div>
<p>
<NavLink className="navTo" to={`/songs/${e.youtube_id}`} > {e.Artist ? <> {e.title} - {e.Artist.name} </> : <> {e.title}</>}</NavLink>
</p>
<YouTube className="video" onPlay={() => playCount(e)}videoId={e.youtube_id} id="video" opts={{width:"300",height:"300"}}/>
<br/><br/>
</div>
</Slide>
)}
)



let alArray = albums.map(e => {
setAlbumsLength(albums.length)
return (
<Slide key={e.name} className="hov carouselist">
<p>
<NavLink className="navTo" to={`/albums/${e.id}`} >
{e.Artist ? <> {e.name} - {e.Artist.name} </> : <> {e.name}</>}
</NavLink>
</p>
<NavLink className="navTo" to={`/albums/${e.id}`} >
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="300" height="300" src={e.cover_img}></img>
</NavLink>
<br/><br/>
</Slide>
)}
)

let arArray = artists.map(e => {
setArtistsLength(artists.length)
return (
<Slide key={e.name} className="hov carouselist">
<p>
<NavLink className="navTo" to={`/artists/${e.id}`}>
{e.name}
</NavLink>
</p>
<NavLink className="navTo" to={`/artists/${e.id}`}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="300" height="300" src={e.cover_img}></img>
</NavLink>
<br/><br/>
</Slide>
)}
)

let pArray = playlists.map(e => {
setPlaylistsLength(playlists.length)
return (
<Slide key={e.name} className="hov carouselist">
<p>
<NavLink className="navTo" to={`/playlists/${e.id}`}>
{e.name}
</NavLink>
</p>
<NavLink className="navTo" to={`/playlists/${e.id}`}>
<img onError={(e)=>{e.target.onerror = null; e.target.src="/no_image.jpg"}} alt={e.name} width="300" height="300" src={e.cover_img}></img>
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

  return (
    <div>
<LoadingOverlay
  active={loading}
  spinner={<ClipLoader css={override} color="white" style={{zIndex:1010}} size={150}/>}
  >
  </LoadingOverlay>
  
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
{!loading ?
<>
    <ButtonBack className="arrow fa fa-arrow-left" ></ButtonBack>
    <ButtonNext style={{float:"right"}}  className="arrow fa fa-arrow-right"></ButtonNext>
</>
: null}
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
{!loading ?
<>
    <ButtonBack className="arrow fa fa-arrow-left" ></ButtonBack>
    <ButtonNext style={{float:"right"}} className="arrow fa fa-arrow-right"></ButtonNext>
</>
: null}
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
{!loading ?
<>
    <ButtonBack className="arrow fa fa-arrow-left" ></ButtonBack>
    <ButtonNext style={{float:"right"}} className="arrow fa fa-arrow-right"></ButtonNext>
</>
: null}
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
</Slider>{!loading ?
<>
    <ButtonBack className="arrow fa fa-arrow-left" ></ButtonBack>
    <ButtonNext style={{float:"right"}} className="arrow fa fa-arrow-right"></ButtonNext>
</>
: null}
</CarouselProvider>
</div>

</div>
  );
}

export default Home;
