import { useSim } from '../hooks/useSim.js';
import { SimControls } from '../components/UI.jsx';
import { genStack } from '../generators/index.js';
import { T } from '../theme.js';
const OPS=[{t:'push',v:10},{t:'push',v:20},{t:'push',v:5},{t:'push',v:30},{t:'pop'},{t:'push',v:15},{t:'pop'},{t:'pop'}];
export default function StackViz({color}){
  const sim=useSim(()=>genStack(OPS),[]);
  const st=sim.state;const stk=st?.stk??[];
  return(<div>
    <div style={{display:'grid',gridTemplateColumns:'110px 1fr',gap:12}}>
      <div><div style={{fontSize:11,color:T.t2,marginBottom:6}}>STACK (LIFO)</div>
        <div style={{border:`1px solid ${T.bd}`,borderRadius:7,overflow:'hidden',minHeight:140,background:T.s1}}>
          {[...stk].reverse().map((v,i)=><div key={i} style={{padding:'7px 12px',borderBottom:`1px solid ${T.bd}`,background:i===0?color+'30':T.s2,display:'flex',justifyContent:'space-between',transition:'all .2s'}}><span style={{fontWeight:700,color:i===0?color:T.t1,fontSize:13}}>{v}</span>{i===0&&<span style={{fontSize:9,color,fontWeight:700}}>TOP</span>}</div>)}
          {!stk.length&&<div style={{padding:12,textAlign:'center',color:T.t3,fontSize:12}}>empty</div>}
        </div>
      </div>
      <div><div style={{fontSize:11,color:T.t2,marginBottom:6}}>OPERATIONS</div>
        <div style={{display:'flex',flexDirection:'column',gap:3}}>
          {OPS.map((op,i)=><div key={i} style={{padding:'3px 8px',borderRadius:5,background:T.s2,border:`1px solid ${T.bd}`,fontSize:12}}><span style={{color:op.t==='push'?T.gn:T.rd,fontWeight:700}}>{op.t.toUpperCase()}</span>{op.v!=null&&<span style={{color:T.t2}}> {op.v}</span>}</div>)}
        </div>
      </div>
    </div>
    <div style={{marginTop:10}}><SimControls sim={sim} color={color}/></div>
  </div>);
}
