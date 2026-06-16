import { Link } from 'react-router-dom';
import { T } from '../theme.js';
const ROADMAP = [
  { phase:'Phase 1', title:'Foundations', weeks:'Weeks 1–4', color:T.cy, topics:[
    {id:'arrays',title:'Arrays',icon:'▦'},{id:'strings',title:'Strings',icon:'≡'},{id:'linked-lists',title:'Linked Lists',icon:'◈'},
    {id:'stacks',title:'Stacks',icon:'⧉'},{id:'queues',title:'Queues',icon:'≋'},{id:'recursion',title:'Recursion',icon:'↺'},
    {id:'bit-manipulation',title:'Bit Manipulation',icon:'⊻'},{id:'big-o',title:'Big-O Notation',icon:'Ω'},
  ]},
  { phase:'Phase 2', title:'Core Algorithms', weeks:'Weeks 5–8', color:T.gn, topics:[
    {id:'sorting',title:'Sorting Algorithms',icon:'⊞'},{id:'searching',title:'Searching',icon:'⌕'},
    {id:'two-pointers',title:'Two Pointers',icon:'⇌'},{id:'sliding-window',title:'Sliding Window',icon:'⊓'},
    {id:'backtracking',title:'Backtracking',icon:'↩'},{id:'greedy',title:'Greedy Algorithms',icon:'↑'},
  ]},
  { phase:'Phase 3', title:'Data Structures', weeks:'Weeks 9–12', color:T.pu, topics:[
    {id:'hash-tables',title:'Hash Tables',icon:'⊞'},{id:'trees',title:'Trees & BST',icon:'⊠'},
    {id:'graphs',title:'Graphs',icon:'◎'},{id:'heaps',title:'Heaps',icon:'△'},
    {id:'dp',title:'Dynamic Programming',icon:'▣'},{id:'big-o-notation',title:'Complexity Analysis',icon:'⊡'},
  ]},
  { phase:'Phase 4', title:'Systems & Math', weeks:'Weeks 13–16', color:T.or, topics:[
    {id:'operating-systems',title:'Operating Systems',icon:'⊙'},{id:'computer-networks',title:'Networks',icon:'⊕'},
    {id:'databases',title:'Databases',icon:'⊗'},{id:'linear-algebra',title:'Linear Algebra',icon:'∥'},
  ]},
  { phase:'Phase 5', title:'Machine Learning', weeks:'Weeks 17–22', color:T.rd, topics:[
    {id:'ml-basics',title:'ML Fundamentals',icon:'◑'},{id:'neural-nets',title:'Neural Networks',icon:'◉'},
    {id:'cnn',title:'CNNs',icon:'⊟'},{id:'transformers',title:'Transformers',icon:'⊛'},
    {id:'mlops',title:'MLOps',icon:'⚡'},
  ]},
];

export default function RoadmapPage() {
  return (
    <div style={{ maxWidth:900,margin:'0 auto',padding:'0 20px 60px' }}>
      <div style={{ padding:'28px 0 22px' }}>
        <h1 style={{ fontSize:28,fontWeight:800,color:T.t0,marginBottom:8 }}>📅 Learning Roadmap</h1>
        <p style={{ color:T.t2,fontSize:14 }}>A structured path from CS fundamentals to ML engineering. Follow the phases in order for the best learning experience.</p>
      </div>
      {ROADMAP.map((phase,pi)=>(
        <div key={phase.phase} style={{ marginBottom:28 }}>
          <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:14 }}>
            <div style={{ width:36,height:36,borderRadius:'50%',background:phase.color+'25',border:`2px solid ${phase.color}`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,color:phase.color,fontSize:14,flexShrink:0 }}>{pi+1}</div>
            <div>
              <div style={{ fontSize:16,fontWeight:700,color:phase.color }}>{phase.title}</div>
              <div style={{ fontSize:12,color:T.t2 }}>{phase.weeks}</div>
            </div>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:8,paddingLeft:50 }}>
            {phase.topics.map(t=>(
              <Link key={t.id} to={`/topic/${t.id}`}
                style={{ textDecoration:'none',display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,background:T.s1,border:`1px solid ${phase.color}25`,color:T.t1,transition:'all .15s' }}
                onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${phase.color}70`;e.currentTarget.style.background=T.s2;}}
                onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${phase.color}25`;e.currentTarget.style.background=T.s1;}}>
                <span style={{ fontSize:16 }}>{t.icon}</span>
                <span style={{ fontSize:12,fontWeight:500 }}>{t.title}</span>
              </Link>
            ))}
          </div>
          {pi < ROADMAP.length-1 && <div style={{ display:'flex',justifyContent:'center',marginTop:16,color:T.t3,fontSize:20 }}>↓</div>}
        </div>
      ))}
    </div>
  );
}
