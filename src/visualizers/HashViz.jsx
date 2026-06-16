import { useState } from 'react';
import { T } from '../theme.js';
export default function HashViz({color}){
  const[inp,setInp]=useState('');const[buckets,setBuckets]=useState(Array.from({length:8},()=>[]));const[flash,setFlash]=useState(null);
  const hashFn=str=>{let h=0;for(const c of str)h=(h*31+c.charCodeAt(0))%8;return((h%8)+8)%8;};
  const insert=()=>{if(!inp.trim())return;const key=inp.trim(),idx=hashFn(key);setFlash(idx);setTimeout(()=>setFlash(null),700);setBuckets(prev=>{const nb=prev.map(b=>[...b]);if(!nb[idx].includes(key))nb[idx].push(key);return nb;});setInp('');};
  return(<div>
    <div style={{display:'flex',gap:7,marginBottom:10}}>
      <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&insert()} placeholder="Type key to insert..." style={{flex:1,padding:'5px 10px',borderRadius:6,border:`1px solid ${T.bd}`,background:T.s2,color:T.t0,fontSize:13}}/>
      <button onClick={insert} style={{padding:'5px 14px',borderRadius:6,background:color,border:'none',color:T.bg,fontWeight:700,cursor:'pointer'}}>Insert</button>
      <button onClick={()=>setBuckets(Array.from({length:8},()=>[]))} style={{padding:'5px 10px',borderRadius:6,border:`1px solid ${T.bd}`,background:'transparent',color:T.t2,cursor:'pointer',fontSize:12}}>Clear</button>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:4}}>
      {buckets.map((bkt,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:28,textAlign:'center',fontFamily:'var(--font-mono)',fontSize:12,color:T.t3,flexShrink:0}}>[{i}]</div><div style={{flex:1,padding:'5px 9px',background:flash===i?color+'30':T.s2,borderRadius:6,border:`1px solid ${flash===i?color:T.bd}`,minHeight:30,display:'flex',alignItems:'center',gap:5,transition:'all .15s'}}>{!bkt.length?<span style={{color:T.t3,fontSize:11}}>—</span>:bkt.map((k,j)=><span key={j} style={{padding:'2px 8px',borderRadius:12,background:color+'25',color,border:`1px solid ${color}40`,fontSize:12,fontWeight:600}}>{k}</span>)}</div></div>)}
    </div>
    <div style={{marginTop:8,fontSize:10,color:T.t3}}>h(key) = (sum of charCode x 31^i) mod 8</div>
  </div>);
}
