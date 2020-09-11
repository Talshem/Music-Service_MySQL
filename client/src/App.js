import React, { useState, useEffect } from 'react';
import './App.css';
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
  NavLink,
  HashRouter
} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import PostSong from './components/PostSong.js';

function App() {
const [registerOpen, setRegisterOpen] = useState(false)
const [loginOpen,setLoginOpen] = useState(false)
const [user, setUser] = useState(undefined);

useEffect(() => {
let user = localStorage.getItem('email');
const autoLogin = async () => {
try {
const { data } = await axios.get(`/auto/${user}`);
setUser(data[0])
} catch {
return
}
}; autoLogin();
}, [])

const handleLogout = async () => {
await axios.put(`/logout`, {
email: user.email,
});
setUser(undefined)
localStorage.clear();
    };

 
function validateEmail(mail) {
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
  {
    return (true)
  }
    return (false)
}

  const handleRegister = async (email, name, password, repassword) => {
    try{
    if(validateEmail(email)) {
          if (password === repassword){
      const { data } = await axios.post(`/users`, {
      name: name,
      email: email,
      password: password,
      });
setUser(data[0])
setRegisterOpen(false)
           } else {
document.getElementById('errorMessage').innerHTML='Password fields do not match';
           }
          } else {
 document.getElementById('errorMessage').innerHTML='Please enter a valid email address';
           }
  } catch(response){
  document.getElementById('errorMessage').innerHTML='The email you tried to register with is already in use';
  }; 
  }

    const handleLogin = async (email, password) => {
    try{
    if(validateEmail(email)) {
      const { data } = await axios.put(`/users`, {
      email: email,
      password: password,
      });
localStorage.setItem('email', email);
setLoginOpen(false)   
setTimeout(() => {
setUser(data[0])
}, 500);
    } else {
 document.getElementById('errorMessage').innerHTML='Please enter a valid email address';
    }
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
<Button variant="text" color="inherit" onClick={() => setLoginOpen(true)}>
        Login
      </Button>
      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Login</DialogTitle>
        <DialogContent>
          <TextField
            onChange={insertEmail}
            defaultValue={email}
            autoFocus
            margin="dense"
            id="name"
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
let name;
let password;
let repassword

      function insertEmail(event) {
        email = event.target.value;
      }

      function insertName(event) {
        name = event.target.value;
      }

      function insertPassword(event) {
        password = event.target.value;
      }

      function insertRePassword(event) {
        repassword = event.target.value;
      }

return (
  <span>
<Button variant="text" color="inherit" onClick={() => setRegisterOpen(true)}>
        Register
      </Button>
      <Dialog open={registerOpen} onClose={() => setRegisterOpen(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Register</DialogTitle>
        <DialogContent>
          <TextField
            onChange={insertEmail}
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
          />
          <TextField
            onChange={insertName}
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="name"
            fullWidth
          />
           <TextField
            onChange={insertPassword}
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
          />
           <TextField
            onChange={insertRePassword}
            autoFocus
            margin="dense"
            id="rePassword"
            label="Confirm password"
            type="password"
            fullWidth
          />
        </DialogContent>
        <DialogTitle style={{color:'red'}} id="errorMessage"></DialogTitle>
        <DialogActions>
          <Button onClick={() => setRegisterOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleRegister(email, name, password, repassword)} color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>
      </span>
)}

const logout =
<Button style={{marginLeft:'85px'}} variant="text" color="inherit" onClick={handleLogout}>
Logout
</Button>

const platform = user ? <h5> {logout} </h5> :  <h5> {login()} | {register()} </h5>

  return (
<div className="App">
{platform}
    <HashRouter>
   <SideNav
        className="sideNav"
      >
        <SideNav.Toggle />
        <SideNav.Nav defaultSelected="home">
          <NavItem eventKey="home">
            <NavIcon>
              <i style={{ fontSize: '1.75em' }} />
            </NavIcon>
              <NavLink to="/"><i style={{color:'white', fontSize:'44px', paddingTop:"3px"}} className="fa fa-fw fa-home" /></NavLink>
          </NavItem>
          <NavItem eventKey="1">
            <NavIcon>
              <i className="fa fa-fw " style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
               <NavLink className="navItem" to="/Songs">Songs</NavLink>
            </NavText>
          </NavItem>
          <NavItem eventKey="2">
            <NavIcon>
              <i className="fa fa-fw " style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
           <NavLink className="navItem" to="/Artists">Artists</NavLink>
            </NavText>
          </NavItem>
          <NavItem eventKey="3">
            <NavIcon>
              <i className="fa fa-fw " style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
               <NavLink className="navItem" to="/Albums">Albums</NavLink>
            </NavText>
          </NavItem>
          <NavItem eventKey="4">
            <NavIcon>
              <i className="fa fa-fw " style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
             <NavLink className="navItem" to="/Playlists">Playlists</NavLink>
            </NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
  <Route exact path="/" component={() => <Home user={user}/>}/>
<Route path="/Songs" component={() => <Songs user={user}/>}/>
<Route path="/Artists" component={() => <Artists user={user}/>}/>
<Route path="/Playlists" component={() => <Playlists user={user}/>}/>
<Route path="/Albums" component={() => <Albums user={user}/>}/>
<Route path="/PostSong" component={() => <PostSong/>}/>
      </HashRouter>
    </div>

    
  );
}

export default App;
