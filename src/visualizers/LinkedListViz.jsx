import { useSim } from '../hooks/useSim.js';
import { SimControls } from '../components/UI.jsx';
import { genLLTraversal } from '../generators/index.js';
import { T } from '../theme.js';
const VALS=[10,25,37,48,52,61,79];
export default function LinkedListViz({color}){
  const sim=useSim(()=>genLLTraversal(VALS),[]);
  const st=sim.state;
  return(<div>
    <div style={{display:'flex',alignItems:'center',gap:0,flexWrap:'nowrap',overflowX:'auto',paddingBottom:8,marginBottom:10}}>
      {VALS.map((v,i)=>{const isCur=st?.cur===i,isDone=st?.vis?.includes(i);return(<div key={i} style={{display:'flex',alignItems:'center'}}><div style={{minWidth:62,height:52,borderRadius:7,border:`2px solid ${isCur?color:isDone?T.gn:T.bd}`,background:isCur?color+'30':isDone?T.gn+'15':T.s2,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transition:'all .25s',position:'relative',flexShrink:0,boxShadow:isCur?`0 0 14px ${color}80`:'none'}}>{isCur&&<div style={{position:'absolute',top:-14,fontSize:9,color,fontWeight:700}}>HEAD</div>}<div style={{fontSize:14,fontWeight:700,color:isCur?color:isDone?T.gn:T.t1}}>{v}</div><div style={{fontSize:9,color:T.t3}}>node[{i}]</div></div>{i<VALS.length-1&&<div style={{display:'flex',alignItems:'center',padding:'0 3px'}}><div style={{width:20,height:2,background:isDone?T.gn:T.bd}}/><span style={{fontSize:11,color:isDone?T.gn:T.t3}}>▶</span></div>}</div>);})}
      <div style={{display:'flex',alignItems:'center',padding:'0 8px'}}><div style={{width:14,height:2,background:T.bd}}/><span style={{fontSize:11,color:T.t3}}>NULL</span></div>
    </div>
    <SimControls sim={sim} color={color}/>
  </div>);
}
