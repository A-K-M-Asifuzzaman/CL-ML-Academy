import { useSim } from '../hooks/useSim.js';
import { SimControls } from '../components/UI.jsx';
import { genQueue } from '../generators/index.js';
import { T } from '../theme.js';
const OPS=[{t:'enq',v:10},{t:'enq',v:20},{t:'enq',v:30},{t:'deq'},{t:'enq',v:5},{t:'enq',v:15},{t:'deq'},{t:'deq'}];
export default function QueueViz({color}){
  const sim=useSim(()=>genQueue(OPS),[]);
  const st=sim.state;const q=st?.q??[];
  return(<div>
    <div style={{marginBottom:10}}><div style={{fontSize:11,color:T.t2,marginBottom:5}}>QUEUE (FIFO) — front left, rear right</div>
      <div style={{display:'flex',alignItems:'center',gap:5,padding:10,background:T.s1,borderRadius:8,border:`1px solid ${T.bd}`,minHeight:52}}>
        {!q.length?<span style={{color:T.t3,fontSize:12}}>Queue empty</span>:<>
          <div style={{fontSize:10,color:T.gn,padding:'2px 6px',borderRadius:12,background:T.gn+'20',border:`1px solid ${T.gn}30`,flexShrink:0}}>FRONT</div>
          {q.map((v,i)=><div key={i} style={{padding:'7px 14px',borderRadius:6,background:i===0?T.gn+'20':i===q.length-1?color+'20':T.s3,border:`1px solid ${i===0?T.gn:i===q.length-1?color:T.bd}`,fontWeight:700,color:T.t0,transition:'all .2s',fontSize:13,flexShrink:0}}>{v}</div>)}
          <div style={{fontSize:10,color,padding:'2px 6px',borderRadius:12,background:color+'20',border:`1px solid ${color}30`,flexShrink:0}}>REAR</div>
        </>}
      </div>
    </div>
    <SimControls sim={sim} color={color}/>
  </div>);
}
