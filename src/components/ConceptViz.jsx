import { T } from '../theme.js';
import VizBlock from './VizBlock.jsx';

/*  Animated concept diagrams — one per category, so EVERY topic has a
    visual. Pure SVG + SMIL/CSS (no JS loop, cheap & smooth). Topics that
    have a dedicated interactive visualizer use VizBlock instead.          */

const VB = '0 0 340 170';
const frame = () => ({ width: '100%', viewBox: VB, style: { display: 'block', background: T.s2, borderRadius: 12, border: `1px solid ${T.bd}` } });

// ── DSA: array cells with a moving two-pointer scan ──
const Arrays = (c) => (
  <svg {...frame(c)}>
    {[...Array(8)].map((_, i) => (
      <g key={i}>
        <rect x={20 + i * 38} y={60} width={32} height={40} rx={6} fill={T.s3} stroke={T.bd} />
        <text x={36 + i * 38} y={85} textAnchor="middle" fill={T.t2} fontSize={13} fontFamily="var(--font-mono)">{[5,2,8,1,9,3,7,4][i]}</text>
        <text x={36 + i * 38} y={120} textAnchor="middle" fill={T.t3} fontSize={9}>{i}</text>
      </g>
    ))}
    <g>
      <polygon points="0,-8 -6,2 6,2" fill={c}>
        <animateTransform attributeName="transform" type="translate" dur="3s" repeatCount="indefinite"
          values="36,48; 264,48; 36,48" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
      </polygon>
    </g>
    <g>
      <polygon points="0,8 -6,-2 6,-2" fill={T.gn}>
        <animateTransform attributeName="transform" type="translate" dur="3s" repeatCount="indefinite"
          values="264,112; 36,112; 264,112" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
      </polygon>
    </g>
    <text x={170} y={150} textAnchor="middle" fill={T.t3} fontSize={10}>two pointers converging · O(1) indexed access</text>
  </svg>
);

// ── Algorithms: bars sorting themselves ──
const Algo = (c) => {
  const h = [50, 30, 70, 20, 60, 40, 80, 35];
  const sorted = [20, 30, 35, 40, 50, 60, 70, 80];
  return (
    <svg {...frame(c)}>
      {h.map((v, i) => (
        <rect key={i} x={24 + i * 38} width={28} rx={4} fill={c}>
          <animate attributeName="height" dur="3s" repeatCount="indefinite"
            values={`${v};${sorted[i]};${sorted[i]};${v}`} keyTimes="0;0.4;0.8;1" />
          <animate attributeName="y" dur="3s" repeatCount="indefinite"
            values={`${120 - v};${120 - sorted[i]};${120 - sorted[i]};${120 - v}`} keyTimes="0;0.4;0.8;1" />
          <animate attributeName="fill" dur="3s" repeatCount="indefinite"
            values={`${c};${T.gn};${T.gn};${c}`} keyTimes="0;0.4;0.8;1" />
        </rect>
      ))}
      <text x={170} y={150} textAnchor="middle" fill={T.t3} fontSize={10}>divide · conquer · combine → sorted</text>
    </svg>
  );
};

// ── Data structures: tree of nodes appearing ──
const Trees = (c) => {
  const nodes = [[170,30],[110,80],[230,80],[80,125],[140,125],[200,125],[260,125]];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
  return (
    <svg {...frame(c)}>
      {edges.map(([a,b],i)=>(
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={T.bd} strokeWidth={1.5}>
          <animate attributeName="stroke" dur="3s" begin={`${i*0.2}s`} repeatCount="indefinite" values={`${T.bd};${c};${T.bd}`} />
        </line>
      ))}
      {nodes.map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r={16} fill={T.s3} stroke={c} strokeWidth={1.5}>
            <animate attributeName="r" dur="3s" begin={`${i*0.2}s`} repeatCount="indefinite" values="13;17;13" />
            <animate attributeName="fill" dur="3s" begin={`${i*0.2}s`} repeatCount="indefinite" values={`${T.s3};${c}33;${T.s3}`} />
          </circle>
          <text x={x} y={y+4} textAnchor="middle" fill={T.t1} fontSize={11} fontFamily="var(--font-mono)">{[8,4,12,2,6,10,14][i]}</text>
        </g>
      ))}
    </svg>
  );
};

// ── Complexity: growth curves racing up ──
const Complexity = (c) => {
  const curves = [
    { d: 'M20,130 L320,128', col: T.gn, label: 'O(1)' },
    { d: 'M20,130 Q120,118 320,100', col: T.cy, label: 'O(log n)' },
    { d: 'M20,130 L320,60', col: T.pu, label: 'O(n)' },
    { d: 'M20,130 Q200,120 320,25', col: T.or, label: 'O(n²)' },
    { d: 'M20,130 Q260,130 300,20', col: T.rd, label: 'O(2ⁿ)' },
  ];
  return (
    <svg {...frame(c)}>
      <line x1={20} y1={130} x2={320} y2={130} stroke={T.bd} />
      <line x1={20} y1={15} x2={20} y2={130} stroke={T.bd} />
      {curves.map((cv,i)=>(
        <path key={i} d={cv.d} fill="none" stroke={cv.col} strokeWidth={2} strokeLinecap="round"
          strokeDasharray="400" strokeDashoffset="400">
          <animate attributeName="stroke-dashoffset" dur="1.6s" begin={`${i*0.25}s`} fill="freeze" values="400;0" />
          <animate attributeName="stroke-dashoffset" dur="0s" begin="4s" fill="freeze" values="400" />
          <animate attributeName="stroke-dashoffset" dur="1.6s" begin="4s" fill="freeze" values="400;0" repeatCount="indefinite" />
        </path>
      ))}
      <text x={170} y={152} textAnchor="middle" fill={T.t3} fontSize={10}>how cost grows with input size</text>
    </svg>
  );
};

// ── Systems: pipeline stages with a flowing packet ──
const Systems = (c) => {
  const stages = ['CPU','Cache','RAM','Disk'];
  return (
    <svg {...frame(c)}>
      {stages.map((s,i)=>(
        <g key={i}>
          <rect x={20 + i*78} y={62} width={62} height={44} rx={8} fill={T.s3} stroke={T.bd} />
          <text x={51 + i*78} y={88} textAnchor="middle" fill={T.t2} fontSize={11}>{s}</text>
          {i<3 && <line x1={82+i*78} y1={84} x2={98+i*78} y2={84} stroke={T.bd} strokeWidth={1.5} />}
        </g>
      ))}
      <circle r={6} fill={c}>
        <animateMotion dur="3s" repeatCount="indefinite" path="M51,40 L51,62 M51,40 L285,40 L285,62" keyPoints="0;1" keyTimes="0;1" />
        <animate attributeName="cx" dur="3s" repeatCount="indefinite" values="51;285" />
        <animate attributeName="cy" dur="0s" values="40" />
      </circle>
      <text x={170} y={140} textAnchor="middle" fill={T.t3} fontSize={10}>data moves through the memory hierarchy</text>
    </svg>
  );
};

// ── Networks: packets between nodes ──
const Networks = (c) => (
  <svg {...frame(c)}>
    {[[50,50],[290,50],[50,120],[290,120],[170,85]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r={14} fill={T.s3} stroke={c} strokeWidth={1.5} />
    ))}
    {[[50,50,170,85],[290,50,170,85],[50,120,170,85],[290,120,170,85]].map(([x1,y1,x2,y2],i)=>(
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.bd} strokeWidth={1.2} />
        <circle r={4} fill={c}>
          <animate attributeName="cx" dur="2s" begin={`${i*0.5}s`} repeatCount="indefinite" values={`${x1};${x2}`} />
          <animate attributeName="cy" dur="2s" begin={`${i*0.5}s`} repeatCount="indefinite" values={`${y1};${y2}`} />
          <animate attributeName="opacity" dur="2s" begin={`${i*0.5}s`} repeatCount="indefinite" values="0;1;1;0" />
        </circle>
      </g>
    ))}
    <text x={170} y={89} textAnchor="middle" fill={T.t1} fontSize={9}>router</text>
    <text x={170} y={155} textAnchor="middle" fill={T.t3} fontSize={10}>packets routed across hosts</text>
  </svg>
);

// ── Databases: table rows + index lookup ──
const Databases = (c) => (
  <svg {...frame(c)}>
    {[...Array(5)].map((_,i)=>(
      <g key={i}>
        <rect x={30} y={30+i*22} width={150} height={18} rx={3} fill={i===2?c+'22':T.s3} stroke={i===2?c:T.bd} />
        <text x={40} y={43+i*22} fill={T.t2} fontSize={10} fontFamily="var(--font-mono)">row {i+1}</text>
      </g>
    ))}
    <path d="M195,75 L240,75" stroke={c} strokeWidth={1.5} markerEnd="url(#a)" />
    <rect x={240} y={50} width={70} height={50} rx={8} fill={T.s3} stroke={c} />
    <text x={275} y={72} textAnchor="middle" fill={c} fontSize={11}>B-tree</text>
    <text x={275} y={88} textAnchor="middle" fill={T.t3} fontSize={9}>index</text>
    <circle cx={185} cy={75} r={4} fill={c}><animate attributeName="opacity" dur="1.5s" repeatCount="indefinite" values="0.3;1;0.3" /></circle>
    <text x={170} y={150} textAnchor="middle" fill={T.t3} fontSize={10}>O(log n) lookup via index</text>
  </svg>
);

// ── Math: vector field / gradient arrows ──
const Math_ = (c) => (
  <svg {...frame(c)}>
    {[...Array(6)].map((_,r)=>[...Array(9)].map((_,col)=>{
      const x=30+col*35, y=30+r*20;
      return <line key={`${r}-${col}`} x1={x} y1={y} x2={x+8} y2={y-6} stroke={c} strokeWidth={1.3} opacity={0.4+0.5*(r/6)}>
        <animate attributeName="opacity" dur="3s" begin={`${(r+col)*0.1}s`} repeatCount="indefinite" values="0.2;0.9;0.2" />
      </line>;
    }))}
    <circle r={6} fill={T.gn}>
      <animateMotion dur="4s" repeatCount="indefinite" path="M300,40 Q200,60 120,110 T60,135" />
    </circle>
    <text x={170} y={158} textAnchor="middle" fill={T.t3} fontSize={10}>gradient descent over a vector field</text>
  </svg>
);

// ── ML: scatter points + decision boundary ──
const ML = (c) => {
  const ptsA = [[60,50],[90,40],[75,75],[110,60],[85,95]];
  const ptsB = [[240,120],[270,100],[255,135],[290,115],[230,90]];
  return (
    <svg {...frame(c)}>
      {ptsA.map(([x,y],i)=><circle key={`a${i}`} cx={x} cy={y} r={6} fill={T.cy} />)}
      {ptsB.map(([x,y],i)=><circle key={`b${i}`} cx={x} cy={y} r={6} fill={T.or} />)}
      <line x1={40} y1={140} x2={300} y2={30} stroke={c} strokeWidth={2} strokeDasharray="6 4">
        <animate attributeName="x1" dur="3s" repeatCount="indefinite" values="40;55;40" />
        <animate attributeName="y2" dur="3s" repeatCount="indefinite" values="30;45;30" />
      </line>
      <text x={170} y={158} textAnchor="middle" fill={T.t3} fontSize={10}>a learned decision boundary separates classes</text>
    </svg>
  );
};

// ── DL: neural network firing ──
const DL = (c) => {
  const layers = [[40,[40,75,110]],[140,[40,65,90,115]],[240,[55,85,115]],[300,[80]]];
  const allNodes = layers.flatMap(([x,ys])=>ys.map(y=>[x,y]));
  return (
    <svg {...frame(c)}>
      {layers.slice(0,-1).map(([x1,ys1],li)=>{
        const [x2,ys2]=layers[li+1];
        return ys1.flatMap((y1,a)=>ys2.map((y2,b)=>(
          <line key={`${li}-${a}-${b}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.bd} strokeWidth={0.6}>
            <animate attributeName="stroke" dur="2.4s" begin={`${li*0.4}s`} repeatCount="indefinite" values={`${T.bd};${c}66;${T.bd}`} />
          </line>
        )));
      })}
      {allNodes.map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={8} fill={T.s3} stroke={c} strokeWidth={1.3}>
          <animate attributeName="fill" dur="2.4s" begin={`${(x/70)*0.4}s`} repeatCount="indefinite" values={`${T.s3};${c};${T.s3}`} />
        </circle>
      ))}
      <text x={170} y={158} textAnchor="middle" fill={T.t3} fontSize={10}>signals propagate forward through layers</text>
    </svg>
  );
};

// ── NLP: tokens with attention links ──
const NLP = (c) => {
  const toks = ['The','cat','sat','on','mat'];
  return (
    <svg {...frame(c)}>
      {toks.map((t,i)=>(
        <g key={i}>
          <rect x={28+i*62} y={60} width={52} height={28} rx={6} fill={T.s3} stroke={c} strokeWidth={1.2} />
          <text x={54+i*62} y={78} textAnchor="middle" fill={T.t1} fontSize={11}>{t}</text>
        </g>
      ))}
      {[[2,0],[2,1],[2,4],[4,2]].map(([a,b],i)=>{
        const x1=54+a*62, x2=54+b*62;
        const mid=(x1+x2)/2;
        return <path key={i} d={`M${x1},60 Q${mid},${20-i*4} ${x2},60`} fill="none" stroke={c} strokeWidth={1.4} opacity={0.6}>
          <animate attributeName="opacity" dur="3s" begin={`${i*0.4}s`} repeatCount="indefinite" values="0.1;0.8;0.1" />
        </path>;
      })}
      <text x={170} y={150} textAnchor="middle" fill={T.t3} fontSize={10}>self-attention links every token to every other</text>
    </svg>
  );
};

// ── CV: image grid + conv filter sweeping ──
const CV = (c) => (
  <svg {...frame(c)}>
    {[...Array(6)].map((_,r)=>[...Array(6)].map((_,col)=>(
      <rect key={`${r}-${col}`} x={50+col*24} y={20+r*20} width={22} height={18} rx={2}
        fill={T.s3} stroke={T.bd} strokeWidth={0.5}>
        <animate attributeName="fill" dur="0.5s" begin={`${(r*6+col)*0.08}s`} repeatCount="indefinite"
          values={`${T.s3};${c}44;${T.s3}`} />
      </rect>
    )))}
    <rect width={50} height={42} fill="none" stroke={T.gn} strokeWidth={2} rx={3}>
      <animateTransform attributeName="transform" type="translate" dur="4s" repeatCount="indefinite"
        values="48,18; 122,18; 48,98; 122,98; 48,18" />
    </rect>
    <text x={170} y={160} textAnchor="middle" fill={T.t3} fontSize={10}>a convolution filter slides over the image</text>
  </svg>
);

// ── MLOps: CI/CD pipeline ──
const MLOps = (c) => {
  const stages = ['Data','Train','Eval','Deploy','Monitor'];
  return (
    <svg {...frame(c)}>
      {stages.map((s,i)=>(
        <g key={i}>
          <rect x={14+i*64} y={62} width={56} height={40} rx={8} fill={T.s3} stroke={c} strokeWidth={1.2}>
            <animate attributeName="stroke" dur="3s" begin={`${i*0.5}s`} repeatCount="indefinite" values={`${T.bd};${c};${T.bd}`} />
            <animate attributeName="fill" dur="3s" begin={`${i*0.5}s`} repeatCount="indefinite" values={`${T.s3};${c}22;${T.s3}`} />
          </rect>
          <text x={42+i*64} y={86} textAnchor="middle" fill={T.t2} fontSize={9.5}>{s}</text>
          {i<4 && <text x={74+i*64} y={86} textAnchor="middle" fill={T.t3} fontSize={11}>→</text>}
        </g>
      ))}
      <path d="M300,102 Q310,130 170,135 Q30,130 40,102" fill="none" stroke={c} strokeWidth={1.2} strokeDasharray="4 4" opacity={0.5} />
      <text x={170} y={150} textAnchor="middle" fill={T.t3} fontSize={10}>continuous training &amp; monitoring loop</text>
    </svg>
  );
};

const CATEGORY_VIZ = {
  dsa: Arrays, algo: Algo, ds: Trees, complex: Complexity, sys: Systems,
  net: Networks, db: Databases, math: Math_, ml: ML, dl: DL, nlp: NLP, cv: CV, mlops: MLOps,
};

const CATEGORY_LABEL = {
  dsa: 'Data Structure Concept', algo: 'Algorithm Concept', ds: 'Structure Concept',
  complex: 'Complexity Concept', sys: 'Systems Concept', net: 'Networking Concept',
  db: 'Database Concept', math: 'Math Concept', ml: 'ML Concept', dl: 'Deep Learning Concept',
  nlp: 'NLP Concept', cv: 'Vision Concept', mlops: 'MLOps Concept',
};

export default function ConceptViz({ topic }) {
  // Dedicated interactive visualizer takes priority
  if (topic.viz && topic.viz !== 'none') return <VizBlock topic={topic} />;

  const Render = CATEGORY_VIZ[topic.cat] || Arrays;
  const c = topic.color;
  return (
    <div className="viz-frame" style={{ padding: 0, borderColor: c + '30' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: `1px solid ${c}22` }}>
        <span style={{ position: 'relative', width: 8, height: 8 }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: c }} />
          <span style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: `1.5px solid ${c}`, animation: 'pulse 1.6s ease-in-out infinite' }} />
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: c, letterSpacing: 1.2, textTransform: 'uppercase' }}>
          {CATEGORY_LABEL[topic.cat] || 'Concept'}
        </span>
        <span className="hide-mobile" style={{ marginLeft: 'auto', fontSize: 10, color: T.t3 }}>Animated illustration</span>
      </div>
      <div style={{ padding: 16 }}>
        {Render(c)}
      </div>
    </div>
  );
}
