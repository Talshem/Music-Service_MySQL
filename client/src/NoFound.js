import React, { useEffect, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import ClipLoader from "react-spinners/ClipLoader";

function NoFound() {
const [unfound, setUnfound] = useState(undefined)
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchData = async () => {
      setUnfound(page)
      setLoading(false)
    }; fetchData();
   }, [])

 let page =
<div>
<p style={{height:"100px", marginTop:"-50px", fontSize:"400px",textAlign:"center",width:"825px"}} className="dataTitle">404</p>
<p style={{position:'relative', top:"180px", fontSize:"120px",textAlign:"right",width:'95%'}} className="listTitle">Page not found</p>
</div>

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
{unfound}
</div>
  )}
  
export default NoFound;
