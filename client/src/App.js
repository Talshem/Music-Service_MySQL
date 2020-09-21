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
import generator from 'generate-password'
import Uploads from './components/Uploads.js';
import NoFound from './NoFound.js';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function App() {
const [registerOpen, setRegisterOpen] = useState(false)
const [loginOpen,setLoginOpen] = useState(false)
const [user, setUser] = useState(undefined);

useEffect(() => {
  const autoLogin = async () => {
  var name = "session=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var sessionCookie = decodedCookie.replace(name, '');

if (sessionCookie != "" && sessionCookie != "0") {
try {
const { data } = await axios.get(`/auto/${sessionCookie}`);
setTimeout(() => {
setUser(data[0])
}, 500);
} catch { return }
  }
}; autoLogin();
}, [])

const handleLogout = async () => {
await axios.put(`/logout`, {
email: user.email,
});
setUser(undefined)
document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    };

 
function validateEmail(mail) {
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
  {
    return (true)
  }
    return (false)
}


  const handleRegister = async (email, name, password, repassword) => {
    let code = generator.generate({
    length: 50,
    numbers: true
});

    try{
    if(!validateEmail(email)) {
     return document.getElementById('errorMessage').innerHTML='Please enter a valid email address';
    }
     if(name.length > 10) {
     return document.getElementById('errorMessage').innerHTML='Username can not exceed 10 characters';
    }
    if (password !== repassword){
    return document.getElementById('errorMessage').innerHTML='Password fields do not match';
           }

      let occupied = await axios.get(`user/${name}`)  
      if(occupied.data.length !== 0){
      return document.getElementById('errorMessage').innerHTML = 'Username is already in use';
      } else {
      const { data } = await axios.post(`/users`, {
      username: name,
      email: email,
      password: password,
      auto_code: code,
      })
setTimeout(() => {
setUser(data[0])
}, 500);
setRegisterOpen(false)

 var d = new Date();
  d.setTime(d.getTime() + (24*60*60*7));
  var expires = "expires=" + d.toGMTString();
  document.cookie = "session=" + code + ";" + expires + ";path=/";
    }
  } catch (response){
  document.getElementById('errorMessage').innerHTML='The email you tried to register with is already in use';
  }; 
  }

    const handleLogin = async (email, password) => {
    if(!validateEmail(email)) {
    return document.getElementById('errorMessage').innerHTML='Please enter a valid email address';
    }
    let code = generator.generate({
    length: 50,
    numbers: true
});
    try{
      const { data } = await axios.put(`/users`, {
      email: email,
      password: password,
      auto_code: code,
      });

 var d = new Date();
  d.setTime(d.getTime() + (24*60*60*7));
  var expires = "expires=" + d.toGMTString();
  document.cookie = "session=" + code + ";" + expires + ";path=/";

setLoginOpen(false)   
setTimeout(() => {
setUser(data[0])
}, 500);
  } catch (response){
  document.getElementById('errorMessage').innerHTML='Either the email or password you entered is incorrect';
  }; 
};

function login(){
let email;
let password;

      function insertEmail(event) {
        email = event.target.value;
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
            onChange={insertEmail}
            defaultValue={email}
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            required
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
            fullWidth
          />
        </DialogContent>
        <DialogTitle style={{color:'red'}} id="errorMessage"></DialogTitle>
        <DialogActions>
          <Button type="submit" onClick={() => setLoginOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleLogin(email, password)} color="primary">
            login
          </Button>
        </DialogActions>
      </Dialog>
      </span>
)}

function register(){
let email;
let username;
let password;
let repassword

      function insertEmail(event) {
        email = event.target.value;
      }

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
            onChange={insertEmail}
            autoFocus
            required
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
          />
          <TextField
            onChange={insertUsername}
            autoFocus
            required
            margin="dense"
            id="username"
            label="Username"
            type="name"
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
            fullWidth
          />
        </DialogContent>
        <DialogTitle style={{color:'red'}} id="errorMessage"></DialogTitle>
        <DialogActions>
          <Button onClick={() => setRegisterOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleRegister(email, username, password, repassword)} color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>
      </span>
)}

const logout =
<Button style={{fontSize:"20px"}} variant="text" color="inherit" onClick={handleLogout}>
Logout
</Button>

const platform = user ? <h5> {logout} </h5> :  <h5> {login()} | {register()} </h5>


const AnimatedSwitch = withRouter(({ location }) => (
  <TransitionGroup >
    <CSSTransition key={location.key} classNames="page" timeout={1000}>
      <Switch location={location}>
<Route exact path="/" component={() => <Home user={user}/>}/>
<Route path="/songs" component={() => <Songs user={user}/>}/>
<Route path="/artists" component={() => <Artists user={user}/>}/>
<Route path="/playlists" component={() => <Playlists user={user}/>}/>
<Route path="/albums" component={() => <Albums user={user}/>}/>
<Route path="/Uploads" component={() => <Uploads user={user}/>}/>
<Route path="/PostSong" component={() => <PostSong user={user}/>}/>
<Route path="/PostAlbum" component={() => <PostAlbum user={user}/>}/>
<Route path="/PostArtist" component={() => <PostArtist user={user}/>}/>
<Route path="/PostPlaylist" component={() => <PostPlaylist user={user}/>}/>
<Route path="*" component={() => <NoFound user={user}/>}/>
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