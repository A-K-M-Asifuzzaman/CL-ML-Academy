import { useState } from 'react';
import { useSim } from '../hooks/useSim.js';
import { SimControls } from '../components/UI.jsx';
import { genFib } from '../generators/index.js';
import { T } from '../theme.js';
export default function RecursionViz({color}){
  const[n,setN]=useState(5);
  const sim=useSim(()=>genFib(n),[n]);
  const st=sim.state;
  return(<div>
    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
      <span style={{fontSize:13,color:T.t2}}>fib(</span>
      <input type="number" value={n} onChange={e=>setN(Math.min(6,Math.max(1,+e.target.value)))} min={1} max={6} style={{width:50,padding:'4px 8px',borderRadius:6,border:`1px solid ${T.bd}`,background:T.s2,color:T.t0,fontSize:13,textAlign:'center'}}/>
      <span style={{fontSize:13,color:T.t2}}>) — max n=6</span>
    </div>
    <div style={{marginBottom:10}}>
      <div style={{fontSize:11,color:T.t2,marginBottom:5}}>CALL STACK (bottom = deepest)</div>
      <div style={{display:'flex',flexDirection:'column-reverse',gap:3,minHeight:80}}>
        {(st?.stk??[]).map((frame,i,arr2)=><div key={i} style={{padding:'5px 12px',borderRadius:6,background:i===arr2.length-1?color+'30':T.s2,border:`1px solid ${i===arr2.length-1?color:T.bd}`,fontSize:13,display:'flex',justifyContent:'space-between',transition:'all .2s'}}><code style={{color:i===arr2.length-1?color:T.t1,fontFamily:'var(--font-mono)'}}>fib({frame.n})</code><span style={{color:T.t3,fontSize:11}}>depth {frame.d}</span></div>)}
      </div>
    </div>
    {st?.ret!=null&&<div style={{padding:'6px 12px',background:T.gn+'20',borderRadius:7,border:`1px solid ${T.gn}40`,fontSize:13,color:T.gn,marginBottom:8}}>Return value: {st.ret}</div>}
    <SimControls sim={sim} color={color} codeKey="fib"/>
  </div>);
}
