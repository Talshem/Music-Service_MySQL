import React, { useState, useEffect } from 'react';
import './App.css';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import SideNav, {
  Toggle, Nav, NavItem, NavIcon, NavText,
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

function App() {
const [expanded, setExpanded] = useState(false)

  function handleMargin() {
    if (expanded) {
    document.querySelector('.App').style.transition = 'all 0.2s';
    document.querySelector('.App').style.paddingLeft = '0px';
      setExpanded(false);
    } else {
    document.querySelector('.App').style.transition = 'all 0.2s';
    document.querySelector('.App').style.paddingLeft = '54px';
      setExpanded(true);
    }
  }
  return (
<div className="App">

    <HashRouter>
   <SideNav
        expanded={expanded}
        onToggle={handleMargin}
        className="sideNav"
      >
        <SideNav.Toggle />
        <SideNav.Nav defaultSelected="home">
          <NavItem eventKey="home">
            <NavIcon>
              <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
              <NavLink to="/">Home</NavLink>
            </NavText>
          </NavItem>
          <NavItem eventKey="1">
            <NavIcon>
              <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
               <NavLink to="/Songs">Songs</NavLink>
            </NavText>
          </NavItem>
          <NavItem eventKey="2">
            <NavIcon>
              <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
           <NavLink to="/Artists">Artists</NavLink>
            </NavText>
          </NavItem>
          <NavItem eventKey="3">
            <NavIcon>
              <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
               <NavLink to="/Albums">Albums</NavLink>
            </NavText>
          </NavItem>
          <NavItem eventKey="4">
            <NavIcon>
              <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
             <NavLink to="/Playlists">Playlists</NavLink>
            </NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
<Route exact path="/" component={Home}/>
<Route path="/Songs" component={Songs}/>
<Route path="/Artists" component={Artists}/>
<Route path="/Playlists" component={Playlists}/>
<Route path="/Albums" component={Albums}/>
      </HashRouter>
    </div>
  );
}

export default App;
