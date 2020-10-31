/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react';
import './App.css';
import './Page.css';
import Home from './components/Home.js'
import Songs from './components/Songs.js'
import Artists from './components/Artists.js'
import Playlists from './components/Playlists.js'
import Albums from './components/Albums.js'
import {
  Route,
  NavLink,
  Switch,
  useHistory,
  withRouter,
  useLocation
} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import PostSong from './components/PostSong.js';
import PostAlbum from './components/PostAlbum.js';
import PostArtist from './components/PostArtist.js';
import PostPlaylist from './components/PostPlaylist.js';
import Uploads from './components/Uploads.js';
import NoFound from './NoFound.js';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Slide from '@material-ui/core/Slide';
import network from './Network.js';
import { UserProvider } from './UserContext'
import AlbumData from './components/AlbumData.js';
import ArtistData from './components/ArtistData.js';
import PlaylistData from './components/PlaylistData.js';
import SongData from './components/SongData.js';
import UploadsData from './components/UploadsData.js';
import { ConfirmProvider } from "material-ui-confirm";
import { Mixpanel } from './AnalyticsManager';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});


function usePageViews() {
  let location = useLocation();
  useEffect(() => {
    Mixpanel.track('Url change',{ loaction: location });
  }, [location]);
}

function App() {
const [registerOpen, setRegisterOpen] = useState(false)
const [loginOpen,setLoginOpen] = useState(false)
const [user, setUser] = useState(undefined);

let history = useHistory();

usePageViews();

useEffect(() => {
const autoLogin = async () => {
try {
var date = new Date();
const { data } = await network.patch(`/api/users/auto`, {
last_login: date.toISOString().substring(0, 10),
});
setUser(data)
if(data.user.username) Mixpanel.identify(data.user.username)
Mixpanel.track('Site visit');
} catch { return }
}; autoLogin();
}, [])

const handleLogout = () => {
setUser(undefined)
localStorage.clear();
}


  const handleRegister = async (username, password, repassword) => {
    try{
    if (password !== repassword){
    return document.getElementById('errorMessage').innerHTML='Password fields do not match';
           }
      let occupied = await axios.get(`api/users/${username}`)  
      if(occupied.data && occupied.data.username){
      return document.getElementById('errorMessage').innerHTML = 'Username is already in use';
      } else {
      const { data } = await network.post(`/api/users/register`, {
      username: username,
      password: password,
      })
if (data && data.success && data.token) {
localStorage.setItem('token', data.token);
setRegisterOpen(false)   
setTimeout(() => {
setUser(data.user)
}, 500);
Mixpanel.people.set({
USER_ID: data.user.username,
      });
Mixpanel.track('Registration', { user: data.user.username });
} else {
  document.getElementById('errorMessage').innerHTML = data.message
}
    }
  } catch (response){
  document.getElementById('errorMessage2').innerHTML= response.message;
  }; 
  }

    const handleLogin = async (username, password) => {
    try{
      const { data } = await network.post(`/api/users/login`, {
      username: username,
      password: password,
    });
if (data && data.success && data.token) {
localStorage.setItem('token', data.token);
setLoginOpen(false)   
setTimeout(() => {
setUser(data.user)
Mixpanel.identify(data.user.username)
Mixpanel.track('Successful login');
}, 500);
} else {
  document.getElementById('errorMessage').innerHTML = data.message
}
  } catch (response) {
  document.getElementById('errorMessage').innerHTML = response.message
  }; 
};


function login(){
let username;
let password;

      function insertUsername(event) {
        username = event.target.value;
      }

      function insertPassword(event) {
        password = event.target.value;
      }

return (
  <span>
<Button style={{fontSize:"20px", marginLeft:'255px'}} variant="text" color="inherit" onClick={() => setLoginOpen(true)}>
        Login
      </Button>
      <Dialog TransitionComponent={Transition} open={loginOpen} onClose={() => setLoginOpen(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Login</DialogTitle>
        <DialogContent>
          <TextField
            onChange={insertUsername}
            defaultValue={username}
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="username"
            required
            inputProps={{maxLength: 12}}
            fullWidth
          />
            <TextField
            onChange={insertPassword}
            autoFocus
            defaultValue={password}
            margin="dense"
            id="password"
            label="Password"
            type="password"
            required
            minLength={{maxLength: 36}}
            fullWidth
          />
        </DialogContent>
        <DialogTitle style={{color:'red'}} id="errorMessage"></DialogTitle>
        <DialogActions>
          <Button type="submit" onClick={() => setLoginOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleLogin(username, password)} color="primary">
            login
          </Button>
        </DialogActions>
      </Dialog>
      </span>
)}

function register(){
let username;
let password;
let repassword

      function insertUsername(event) {
        username = event.target.value;
      }

      function insertPassword(event) {
        password = event.target.value;
      }

      function insertRePassword(event) {
        repassword = event.target.value;
      }

return (
  <span>
<Button style={{fontSize:"20px"}} variant="text" color="inherit" onClick={() => setRegisterOpen(true)}>
        Register
      </Button>
      <Dialog TransitionComponent={Transition} open={registerOpen} onClose={() => setRegisterOpen(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Register</DialogTitle>
        <DialogContent>
          <TextField
            onChange={insertUsername}
            autoFocus
            required
            margin="dense"
            id="username"
            label="Username"
            type="name"
            inputProps={{maxLength: 12}}
            fullWidth
          />
           <TextField
            onChange={insertPassword}
            autoFocus
            required
            margin="dense"
            id="password"
            label="Password"
            type="password"
            inputProps={{maxLength: 36}}
            fullWidth
          />
           <TextField
            onChange={insertRePassword}
            autoFocus
            required
            margin="dense"
            id="password"
            label="Confirm password"
            autoComplete=""
            type="password"
            minLength={{maxLength: 36}}
            fullWidth
          />
        </DialogContent>
        <DialogTitle style={{color:'red'}} id="errorMessage"></DialogTitle>
        <DialogActions>
          <Button onClick={() => setRegisterOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleRegister(username, password, repassword)} color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>
      </span>
)}

const logout =
<Button style={{fontSize:"20px"}} variant="text" color="inherit" onClick={() => handleLogout()}>
Logout
</Button>

const platform = user ? <h5> <Button disabled={true} style={{fontSize:"20px", color:"rgb(180, 60, 60)"}} variant="text">{user.username}</Button> | {logout} </h5> :  <h5> {login()} | {register()} </h5>


const AnimatedSwitch = withRouter(({ location }) => (
  <TransitionGroup >
    <CSSTransition key={location.key} classNames="page" timeout={1000}>
<ConfirmProvider>
<UserProvider value={user}>
      <Switch location={location} history={history}>
<Route exact path="/" component={() => <Home/>}/>
<Route exact path="/songs" component={() => <Songs/>}/>
<Route exact path="/songs/:songId" component={() => <SongData/>}/>
<Route exact path="/artists" component={() => <Artists/>}/>
<Route exact path="/artists/:artistId" component={() => <ArtistData/>}/>
<Route exact path="/playlists" component={() => <Playlists/>}/>
<Route exact path="/playlists/:playlistId" component={() => <PlaylistData/>}/>
<Route exact path="/albums" component={() => <Albums/>}/>
<Route exact path="/albums/:albumId" component={() => <AlbumData/>}/>
<Route exact path="/uploads" component={() => <Uploads/>}/>
<Route exact path="/uploads/:userId" component={() => <UploadsData/>}/>
<Route exact path="/PostSong" component={() => <PostSong/>}/>
<Route exact path="/PostAlbum" component={() => <PostAlbum/>}/>
<Route exact path="/PostArtist" component={() => <PostArtist/>}/>
<Route exact path="/PostPlaylist" component={() => <PostPlaylist/>}/>
<Route component={() => <NoFound/>}/>
      </Switch>
</UserProvider>
</ConfirmProvider>
    </CSSTransition>
  </TransitionGroup>
));

  return (
<div className="App">
{platform}
   <div className="nav">
            <NavLink to="/"><i style={{ fontSize:'44px', paddingTop:"3px", fontWeight:'normal'}} className="navItem fa fa-fw fa-home" /></NavLink>
            <NavLink className="navItem" to="/songs">Songs</NavLink>
            <NavLink className="navItem" to="/albums">Albums</NavLink>
            <NavLink className="navItem" to="/artists">Artists</NavLink>
            <NavLink className="navItem" to="/playlists">Playlists</NavLink>
            <NavLink className="navItem" to="/Uploads">Uploads</NavLink>
    </div>
      <AnimatedSwitch />
    </div>
  );
}


export default App;