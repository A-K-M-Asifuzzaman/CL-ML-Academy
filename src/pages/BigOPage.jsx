import { T } from '../theme.js';
import BigOViz from '../visualizers/BigOViz.jsx';
const TABLE=[
  {name:'O(1)',label:'Constant',color:T.gn,examples:'arr[i], hash.get(), stack.push()'},
  {name:'O(log n)',label:'Logarithmic',color:T.cy,examples:'Binary search, BST ops, heap ops'},
  {name:'O(√n)',label:'Square Root',color:T.tl,examples:'Sieve inner loop, some number theory'},
  {name:'O(n)',label:'Linear',color:T.pu,examples:'Linear scan, array traversal, string copy'},
  {name:'O(n log n)',label:'Linearithmic',color:T.ye,examples:'Merge sort, heap sort, FFT'},
  {name:'O(n²)',label:'Quadratic',color:T.or,examples:'Bubble sort, nested loops, matrix multiply naive'},
  {name:'O(n³)',label:'Cubic',color:T.rd,examples:'Floyd-Warshall, matrix chain multiplication'},
  {name:'O(2^n)',label:'Exponential',color:'#ff4f6d',examples:'Subsets generation, fib without memo'},
  {name:'O(n!)',label:'Factorial',color:'#cc0044',examples:'Permutations, brute-force TSP'},
];

export default function BigOPage() {
  return (
    <div style={{ maxWidth:900,margin:'0 auto',padding:'0 20px 60px' }}>
      <div style={{ padding:'28px 0 22px' }}>
        <h1 style={{ fontSize:28,fontWeight:800,color:T.t0,marginBottom:8 }}>Ω Big-O Notation Reference</h1>
        <p style={{ color:T.t2,fontSize:14 }}>How algorithm runtime and memory usage scales with input size n. The universal language of algorithm analysis.</p>
      </div>
      <div style={{ padding:'18px 20px',background:T.s1,borderRadius:14,border:`1px solid ${T.bd}`,marginBottom:28 }}>
        <BigOViz/>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:10,marginBottom:28 }}>
        {TABLE.map((row,i)=>(
          <div key={row.name} style={{ display:'grid',gridTemplateColumns:'110px 140px 1fr',gap:14,alignItems:'center',padding:'10px 14px',background:T.s1,borderRadius:9,border:`1px solid ${T.bd}` }}>
            <code style={{ fontFamily:'var(--font-mono)',color:row.color,fontWeight:700,fontSize:14 }}>{row.name}</code>
            <span style={{ fontSize:12,color:T.t2 }}>{row.label}</span>
            <span style={{ fontSize:12,color:T.t1 }}>{row.examples}</span>
          </div>
        ))}
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
        {[['Rules for Calculating',['Drop constants: O(3n) → O(n)','Drop lower terms: O(n² + n) → O(n²)','Different inputs → different variables: O(a + b)','Nested loops multiply: O(n) × O(m) = O(nm)','Operations in sequence add: O(n) + O(m) = O(n+m)']],
          ['Space Complexity',['O(1): in-place algorithms (bubble, selection sort)','O(log n): recursive call stack (binary search)','O(n): storing copy of input or hash map','O(n²): 2D DP table, adjacency matrix for dense graph','Note: analyze auxiliary space, not input size']]
        ].map(([title,items])=>(
          <div key={title} style={{ padding:16,background:T.s1,borderRadius:10,border:`1px solid ${T.bd}` }}>
            <div style={{ fontSize:14,fontWeight:700,color:T.t0,marginBottom:10 }}>{title}</div>
            {items.map((item,i)=><div key={i} style={{ display:'flex',gap:8,marginBottom:6,fontSize:12 }}><span style={{ color:T.cy,flexShrink:0 }}>•</span><span style={{ color:T.t1 }}>{item}</span></div>)}
          </div>
        ))}
      </div>
    </div>
  );
}
