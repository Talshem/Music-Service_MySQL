/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react';
import './App.css';
import './Page.css';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import SideNav, {
 NavItem, NavIcon, NavText,
} from '@trendmicro/react-sidenav';
import Home from './components/Home.js'
import Songs from './components/Songs.js'
import Artists from './components/Artists.js'
import Playlists from './components/Playlists.js'
import Albums from './components/Albums.js'
import {
  Route,
  Link,
  Switch,
  withRouter
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function App() {
const [registerOpen, setRegisterOpen] = useState(false)
const [loginOpen,setLoginOpen] = useState(false)
const [user, setUser] = useState(undefined);

/* re-adjust to tokens
useEffect(() => {
  const autoLogin = async () => {
  var name = "session=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var sessionCookie = decodedCookie.replace(name, '');

if (sessionCookie != "" && sessionCookie != "0") {
try {
const { data } = await axios.get(`/api/users/auto/${sessionCookie}`);
setTimeout(() => {
setUser(data)
}, 500);
} catch { return }
  }
}; autoLogin();
}, [])
*/

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
      if(occupied.data){
      return document.getElementById('errorMessage').innerHTML = 'Username is already in use';
      } else {
      const date = new Date();
      const { data } = await axios.post(`/api/users`, {
      username: username,
      password: password,
      preferences: '[]',
      created_at: date.toISOString().substring(0, 10),
      last_login: date.toISOString().substring(0, 10)
      })
setTimeout(() => {
setUser(data)
}, 500);
setRegisterOpen(false)
    }
  } catch (response){
  document.getElementById('errorMessage').innerHTML='The username you tried to register with is already in use';
  }; 
  }

    const handleLogin = async (username, password) => {
    try{
       var date = new Date();
      const { data } = await network.post(`/api/users/login`, {
      username: username,
      password: password,
      last_login: date.toISOString().substring(0, 10),
    });

if (data && data.success && data.token) {
localStorage.setItem('token', data.token);
setLoginOpen(false)   
setTimeout(() => {
setUser(data.user)
}, 500);
} else {
  document.getElementById('errorMessage').innerHTML = "Either the username or password you entered is incorrect"
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

const platform = user ? <h5> {logout} </h5> :  <h5> {login()} | {register()} </h5>


const AnimatedSwitch = withRouter(({ location }) => (
  <TransitionGroup >
    <CSSTransition key={location.key} classNames="page" timeout={1000}>
      <Switch location={location}>
    <UserProvider value={user}>
<Route exact path="/" component={() => <Home/>}/>
<Route path="/songs" component={() => <Songs/>}/>
<Route path="/artists" component={() => <Artists/>}/>
<Route path="/playlists" component={() => <Playlists/>}/>
<Route path="/albums" component={() => <Albums/>}/>
<Route path="/Uploads" component={() => <Uploads/>}/>
<Route path="/PostSong" component={() => <PostSong/>}/>
<Route path="/PostAlbum" component={() => <PostAlbum/>}/>
<Route path="/PostArtist" component={() => <PostArtist/>}/>
<Route path="/PostPlaylist" component={() => <PostPlaylist/>}/>
  </UserProvider>
<Route path="*" component={() => <NoFound/>}/>
      </Switch>
    </CSSTransition>
  </TransitionGroup>
));

  return (
<div className="App">
{platform}
   <SideNav
        style={{background:'rgb(180, 60, 60)', borderRight:"2px solid white"}}
        expanded={true}
        onToggle={() => {return}}
      >
        <SideNav.Toggle/>
        <SideNav.Nav defaultSelected="home">
          <NavItem eventKey="home">
            <NavIcon>
              <i style={{ fontSize: '1.75em' }} />
            </NavIcon>
              <Link to="/"><i style={{color:'white', fontSize:'44px', paddingTop:"3px"}} className="fa fa-fw fa-home" /></Link>
          </NavItem>
          <NavItem eventKey="1">
            <NavIcon>
              <i className="fa fa-fw " style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
               <Link className="navItem" to="/songs">Songs</Link>
            </NavText>
          </NavItem>
             <NavItem eventKey="2">
            <NavIcon>
              <i className="fa fa-fw " style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
               <Link className="navItem" to="/albums">Albums</Link>
            </NavText>
          </NavItem>
          <NavItem eventKey="3">
            <NavIcon>
              <i className="fa fa-fw " style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
           <Link className="navItem" to="/artists">Artists</Link>
            </NavText>
          </NavItem>
          <NavItem eventKey="4">
            <NavIcon>
              <i className="fa fa-fw " style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
             <Link className="navItem" to="/playlists">Playlists</Link>
            </NavText>
          </NavItem>
           <NavItem eventKey="5">
            <NavIcon>
              <i className="fa fa-fw " style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
             <Link className="navItem" to="/Uploads">Uploads</Link>
            </NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
      <AnimatedSwitch />
    </div>
  );
}


export default App;