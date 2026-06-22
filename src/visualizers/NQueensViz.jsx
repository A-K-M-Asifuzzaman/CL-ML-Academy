import { useState } from 'react';
import { useSim } from '../hooks/useSim.js';
import { SimControls } from '../components/UI.jsx';
import { genNQueens } from '../generators/index.js';
import { T } from '../theme.js';
export default function NQueensViz({color}){
  const[n,setN]=useState(6);
  const sim=useSim(()=>genNQueens(n),[n]);
  const st=sim.state;const board=st?.board??Array.from({length:n},()=>Array(n).fill(0));
  const cellSize=38;
  return(<div>
    <div style={{display:'flex',gap:8,marginBottom:12,alignItems:'center'}}>
      <span style={{fontSize:13,color:T.t2}}>N =</span>
      {[4,5,6,7,8].map(v=><button key={v} onClick={()=>setN(v)} style={{width:28,height:28,borderRadius:6,border:`1px solid ${n===v?color:T.bd}`,background:n===v?color+'25':'transparent',color:n===v?color:T.t2,cursor:'pointer',fontSize:12}}>{v}</button>)}
    </div>
    <div style={{display:'inline-grid',gridTemplateColumns:`repeat(${n},${cellSize}px)`,gap:2,marginBottom:12,background:T.s1,padding:8,borderRadius:8,border:`1px solid ${T.bd}`}}>
      {board.flat().map((v,i)=>{const r=Math.floor(i/n),c=i%n;const isTry=st?.try&&st.try[0]===r&&st.try[1]===c;const isPlaced=v===1;const isDark=(r+c)%2===0;return(<div key={i} style={{width:cellSize,height:cellSize,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,background:isPlaced?color+'35':isTry?T.ye+'25':isDark?T.s3:T.s2,border:`1px solid ${isPlaced?color:isTry?T.ye:T.bd}`,transition:'all .15s',boxShadow:isPlaced?`0 0 8px ${color}60`:''}}>{isPlaced?'♛':isTry?'·':''}</div>);})}
    </div>
    {st?.found&&<div style={{padding:'7px 12px',background:T.gn+'20',borderRadius:7,border:`1px solid ${T.gn}40`,fontSize:13,color:T.gn,marginBottom:8}}>Solution found!</div>}
    <SimControls sim={sim} color={color} codeKey="nqueens"/>
  </div>);
}
