import { useState } from 'react';
import { useSim } from '../hooks/useSim.js';
import { SimControls } from '../components/UI.jsx';
import { genBinarySearch } from '../generators/index.js';
import { T } from '../theme.js';
const ARR=[11,12,13,15,18,22,25,33,34,42,45,56,64,67,78,89,90];
export default function BSearchViz({color}){
  const[target,setTarget]=useState(42);
  const sim=useSim(()=>genBinarySearch(ARR,target),[target]);
  const st=sim.state;
  return(<div>
    <div style={{display:'flex',gap:8,marginBottom:12,alignItems:'center'}}>
      <span style={{fontSize:13,color:T.t2}}>Search for:</span>
      <input type="number" value={target} onChange={e=>setTarget(+e.target.value)} style={{width:70,padding:'4px 8px',borderRadius:6,border:`1px solid ${T.bd}`,background:T.s2,color:T.t0,fontSize:13,textAlign:'center'}}/>
    </div>
    <div style={{display:'flex',gap:3,flexWrap:'wrap',marginBottom:10}}>
      {ARR.map((v,i)=>{const out=st&&(i<st.lo||i>st.hi)&&!st.done;const isMid=st?.mid===i;const isFound=st?.found===i;let bg=color+'1a',border=`1px solid ${color}30`,tc=T.t1;if(isFound){bg=T.gn;border=`2px solid ${T.gn}`;tc=T.bg;}else if(isMid){bg=T.ye+'40';border=`2px solid ${T.ye}`;tc=T.ye;}else if(out){bg='transparent';tc=T.t3;border='1px solid transparent';}return(<div key={i} style={{position:'relative',width:38,height:38,borderRadius:7,background:bg,border,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transition:'all .2s'}}><span style={{fontSize:12,fontWeight:700,color:tc}}>{v}</span>{st?.lo===i&&<div style={{position:'absolute',top:-13,fontSize:8,color:T.bl,fontWeight:700}}>LO</div>}{st?.hi===i&&<div style={{position:'absolute',top:-13,fontSize:8,color:T.rd,fontWeight:700}}>HI</div>}{isMid&&<div style={{position:'absolute',top:-13,fontSize:8,color:T.ye,fontWeight:700}}>MID</div>}</div>);})}
    </div>
    <SimControls sim={sim} color={color} codeKey="bsearch"/>
  </div>);
}
