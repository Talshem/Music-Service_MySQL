/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext} from 'react';
import {
  NavLink,
   useRouteMatch,
} from "react-router-dom";
import UserContext from '../UserContext'
import { useStateIfMounted } from "use-state-if-mounted";

export default function Uploads(props){
const [search, setSearch] = useStateIfMounted(undefined)

let match = useRouteMatch();

const user = useContext(UserContext)

return(
<div style={{position:'relative', width:"92%", top:'0px'}}>
<p className='listTitle'>Search user</p>
<input className="filterList" onChange={(event) => setSearch(event.target.value)} /> 
<NavLink to={search ? `${match.url}/${search}` : `${match.url}`}>
<button className="searchButton">Search</button>
</NavLink>
{ user ? 
<NavLink to={`${match.url}/${user.username}`}>
<button style={{position:'relative', textAlign:"right", width:"108%", top:"550px", marginBottom:"0px"}} className="post">To my uploads</button>
</NavLink> : '' }
</div>
)
}


