import { T } from '../theme.js';
const FNS=[{name:'O(1)',col:T.gn,fn:()=>1},{name:'O(log n)',col:T.cy,fn:i=>Math.log2(i+1)},{name:'O(n)',col:T.pu,fn:i=>i+1},{name:'O(n log n)',col:T.ye,fn:i=>(i+1)*Math.log2(i+2)},{name:'O(n²)',col:T.or,fn:i=>Math.pow(i+1,2)/5},{name:'O(2^n)',col:T.rd,fn:i=>Math.min(Math.pow(2,i)/40,44)}];
export default function BigOViz(){
  const N=20,maxY=44,W=540,H=200;
  const px=i=>(i/(N-1))*(W-60)+35;const py=v=>H-15-Math.min(v,maxY)/maxY*(H-35);
  return(<div>
    <svg width="100%" viewBox={`0 0 ${W} ${H+20}`} style={{display:'block',marginBottom:10}}>
      {[0,.25,.5,.75,1].map(t=><line key={t} x1={30} y1={py(maxY*t)} x2={W-25} y2={py(maxY*t)} stroke={T.bd} strokeWidth={0.5}/>)}
      <line x1={30} y1={H-15} x2={W-25} y2={H-15} stroke={T.bd} strokeWidth={1.5}/><line x1={30} y1={10} x2={30} y2={H-15} stroke={T.bd} strokeWidth={1.5}/>
      <text x={W/2} y={H+16} textAnchor="middle" fill={T.t3} fontSize={10}>n (input size)</text>
      {FNS.map(f=>{const pts=Array.from({length:N},(_,i)=>({x:px(i),y:py(f.fn(i))}));const d=pts.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ');return<path key={f.name} d={d} fill="none" stroke={f.col} strokeWidth={2} strokeLinecap="round"/>;  })}
      {FNS.map(f=>{const y=py(Math.min(f.fn(N-1),maxY));return<text key={f.name} x={W-22} y={Math.max(14,Math.min(y+4,H-5))} fill={f.col} fontSize={9} textAnchor="start">{f.name}</text>;})}
    </svg>
    <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
      {FNS.map(f=><div key={f.name} style={{display:'flex',alignItems:'center',gap:5,padding:'3px 9px',borderRadius:14,background:f.col+'15',border:`1px solid ${f.col}30`}}><div style={{width:14,height:2.5,borderRadius:2,background:f.col}}/><span style={{fontSize:11,color:f.col,fontFamily:'var(--font-mono)'}}>{f.name}</span></div>)}
    </div>
  </div>);
}
