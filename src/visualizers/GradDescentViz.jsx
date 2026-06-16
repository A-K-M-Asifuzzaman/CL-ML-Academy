import { useState } from 'react';
import { useSim } from '../hooks/useSim.js';
import { SimControls } from '../components/UI.jsx';
import { genGradientDescent } from '../generators/index.js';
import { T } from '../theme.js';
const FNS=[{label:'x²',fn:x=>x*x,grad:x=>2*x,start:3,opt:0},{label:'(x-1)²',fn:x=>(x-1)**2,grad:x=>2*(x-1),start:-2,opt:1},{label:'x⁴-4x²',fn:x=>x**4-4*x**2,grad:x=>4*x**3-8*x,start:2.5,opt:Math.sqrt(2)}];
export default function GradDescentViz({color}){
  const[fi,setFi]=useState(0);const[lr,setLr]=useState(0.1);
  const{fn,grad,start,opt}=FNS[fi];
  const sim=useSim(()=>genGradientDescent(fn,grad,start,lr,40),[fi,lr]);
  const st=sim.state;
  const W=540,H=220,pad=40;
  const xs=Array.from({length:100},(_,i)=>-3.5+i*.07);
  const ys=xs.map(fn);const yMin=Math.min(...ys),yMax=Math.max(...ys);
  const px=x=>(x+3.5)/(7)*(W-2*pad)+pad;
  const py=y=>H-pad-(y-yMin)/(yMax-yMin||1)*(H-2*pad);
  const pathD=xs.map((x,i)=>`${i===0?'M':'L'}${px(x)},${py(fn(x))}`).join(' ');
  return(<div>
    <div style={{display:'flex',gap:8,marginBottom:10,flexWrap:'wrap',alignItems:'center'}}>
      {FNS.map((f,i)=><button key={i} onClick={()=>setFi(i)} style={{padding:'4px 12px',borderRadius:16,border:`1px solid ${fi===i?color:T.bd}`,background:fi===i?color+'20':'transparent',color:fi===i?color:T.t2,cursor:'pointer',fontSize:12}}>{f.label}</button>)}
      <div style={{display:'flex',alignItems:'center',gap:6,marginLeft:'auto'}}>
        <span style={{fontSize:11,color:T.t2}}>lr={lr}</span>
        <input type="range" min={0.01} max={0.5} step={0.01} value={lr} onChange={e=>setLr(+e.target.value)} style={{width:80}}/>
      </div>
    </div>
    <div style={{background:T.s1,borderRadius:10,border:`1px solid ${T.bd}`,overflow:'hidden',marginBottom:10}}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:'block'}}>
        <path d={pathD} fill="none" stroke={color+'60'} strokeWidth={2}/>
        <line x1={30} y1={py(0)} x2={W-25} y2={py(0)} stroke={T.bd} strokeWidth={0.8}/>
        {st&&<g><circle cx={px(st.x)} cy={py(st.fx)} r={7} fill={color} style={{filter:`drop-shadow(0 0 6px ${color})`}}/><text x={px(st.x)+10} y={py(st.fx)-8} fill={color} fontSize={11}>x={st.x.toFixed(3)}</text></g>}
        <circle cx={px(opt)} cy={py(fn(opt))} r={5} fill={T.gn} opacity={0.6}/>
        <text x={px(opt)+8} y={py(fn(opt))+4} fill={T.gn} fontSize={10}>optimal</text>
      </svg>
    </div>
    {st&&<div style={{display:'flex',gap:10,marginBottom:8,flexWrap:'wrap'}}>
      <div style={{padding:'5px 10px',background:T.s2,borderRadius:7,border:`1px solid ${T.bd}`,fontSize:12}}><span style={{color:T.t2}}>x = </span><span style={{color,fontFamily:'var(--font-mono)'}}>{st.x.toFixed(5)}</span></div>
      <div style={{padding:'5px 10px',background:T.s2,borderRadius:7,border:`1px solid ${T.bd}`,fontSize:12}}><span style={{color:T.t2}}>f(x) = </span><span style={{color:T.ye,fontFamily:'var(--font-mono)'}}>{st.fx.toFixed(6)}</span></div>
    </div>}
    <SimControls sim={sim} color={color}/>
  </div>);
}
