import { useState, useCallback } from 'react';
import { useSim } from '../hooks/useSim.js';
import { SimControls } from '../components/UI.jsx';
import { genBFS, genDFS } from '../generators/index.js';
import { T } from '../theme.js';

// Weighted graph with 10 nodes
const NC  = 10;
const ADJ = {
  0: [1,2], 1: [0,3,4], 2: [0,5,6], 3: [1,7],
  4: [1,7,8], 5: [2,9], 6: [2,9], 7: [3,4], 8: [4,9], 9: [5,6,8],
};
const WEIGHTS = {
  '0-1':4, '0-2':2, '1-3':5, '1-4':3, '2-5':6, '2-6':4,
  '3-7':2, '4-7':1, '4-8':7, '5-9':3, '6-9':5, '8-9':2,
};
const POS = [
  { x:280, y:36 },  // 0
  { x:155, y:108 }, // 1
  { x:405, y:108 }, // 2
  { x:72,  y:190 }, // 3
  { x:220, y:190 }, // 4
  { x:330, y:190 }, // 5
  { x:478, y:190 }, // 6
  { x:72,  y:278 }, // 7
  { x:220, y:278 }, // 8
  { x:375, y:278 }, // 9
];

// Dijkstra generator
function* genDijkstra(adj, weights, src, nc) {
  const dist  = Array(nc).fill(Infinity);
  const prev  = Array(nc).fill(null);
  const vis   = {};
  const order = [];
  dist[src] = 0;
  const pq = [[0, src]];
  yield { dist: [...dist], vis: { ...vis }, cur: src, order: [], edge: null };

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (vis[u]) continue;
    vis[u] = true;
    order.push(u);
    yield { dist: [...dist], vis: { ...vis }, cur: u, order: [...order], edge: null };
    for (const v of (adj[u] || [])) {
      const w = weights[`${Math.min(u,v)}-${Math.max(u,v)}`] || 1;
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
        pq.push([dist[v], v]);
        yield { dist: [...dist], vis: { ...vis }, cur: u, order: [...order], edge: [u, v] };
      }
    }
  }
  yield { dist: [...dist], vis: { ...vis }, cur: null, order: [...order], edge: null, done: true };
}

export default function GraphViz({ color }) {
  const [mode, setMode]   = useState('bfs');
  const [start, setStart] = useState(0);
  const [showW, setShowW] = useState(true);

  const sim = useSim(() => {
    if (mode === 'bfs')      return genBFS(ADJ, start, NC);
    if (mode === 'dfs')      return genDFS(ADJ, start, NC);
    return genDijkstra(ADJ, WEIGHTS, start, NC);
  }, [mode, start]);

  const st = sim.state;

  const nodeColor = i => {
    if (st?.cur === i) return color;
    if (mode === 'dijkstra' && st?.vis?.[i]) return T.gn;
    if (st?.order?.includes(i)) return T.gn;
    if (st?.vis?.[i]) return T.gn + '70';
    return null;
  };
  const edgeColor = (u, v) => {
    if (st?.edge && ((st.edge[0] === u && st.edge[1] === v) || (st.edge[0] === v && st.edge[1] === u))) return T.pk;
    if (st?.order?.includes(u) && st?.order?.includes(v)) return T.gn + '70';
    return T.bd;
  };
  const edgeWidth = (u, v) => {
    if (st?.edge && ((st.edge[0] === u && st.edge[1] === v) || (st.edge[0] === v && st.edge[1] === u))) return 2.5;
    return 1.5;
  };

  const edges = [];
  for (let u = 0; u < NC; u++) for (const v of (ADJ[u] || [])) if (v > u) edges.push([u, v]);

  const modeDescriptions = {
    bfs:      'Explores level by level using a Queue (FIFO). Guarantees shortest path in unweighted graphs.',
    dfs:      'Explores as deep as possible using a Stack (LIFO/recursion). Used in topological sort, cycle detection.',
    dijkstra: 'Greedy shortest-path in weighted graphs using a Min-Heap. O((V+E) log V). No negative edges.',
  };

  return (
    <div>
      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {[['bfs', '⊞ BFS', T.cy], ['dfs', '↓ DFS', T.pu], ['dijkstra', '⊕ Dijkstra', T.gn]].map(([m, label, c]) => (
          <button key={m} onClick={() => setMode(m)} style={{ padding: '4px 12px', borderRadius: 20, border: `1px solid ${mode === m ? c : T.bd}`, background: mode === m ? c + '20' : 'transparent', color: mode === m ? c : T.t2, cursor: 'pointer', fontSize: 11, fontWeight: mode === m ? 700 : 400 }}>{label}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center', fontSize: 10.5, color: T.t2 }}>
          Start:
          {Array.from({ length: NC }, (_, i) => (
            <button key={i} onClick={() => setStart(i)} style={{ width: 22, height: 22, borderRadius: '50%', border: `1px solid ${start === i ? color : T.bd}`, background: start === i ? color + '30' : 'transparent', color: start === i ? color : T.t2, cursor: 'pointer', fontSize: 10, padding: 0 }}>{i}</button>
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginLeft: 6 }}>
            <input type="checkbox" checked={showW} onChange={e => setShowW(e.target.checked)} /> Weights
          </label>
        </div>
      </div>

      {/* Algorithm description */}
      <div style={{ padding: '7px 12px', background: T.s2, borderRadius: 8, border: `1px solid ${T.bd}`, fontSize: 11, color: T.t2, marginBottom: 10 }}>
        {modeDescriptions[mode]}
      </div>

      {/* Graph SVG */}
      <div style={{ background: T.s1, borderRadius: 12, border: `1px solid ${T.bd}`, marginBottom: 8, overflow: 'hidden' }}>
        <svg width="100%" viewBox="0 0 560 320" style={{ display: 'block' }}>
          {/* Edges */}
          {edges.map(([u, v]) => {
            const mx = (POS[u].x + POS[v].x) / 2, my = (POS[u].y + POS[v].y) / 2;
            const w  = WEIGHTS[`${Math.min(u,v)}-${Math.max(u,v)}`];
            return (
              <g key={`${u}-${v}`}>
                <line x1={POS[u].x} y1={POS[u].y} x2={POS[v].x} y2={POS[v].y}
                  stroke={edgeColor(u, v)} strokeWidth={edgeWidth(u, v)} style={{ transition: 'stroke .2s, stroke-width .2s' }} />
                {showW && <text x={mx} y={my - 6} textAnchor="middle" fill={T.t3} fontSize={9} fontFamily="monospace">{w}</text>}
              </g>
            );
          })}
          {/* Nodes */}
          {Array.from({ length: NC }, (_, i) => {
            const p = POS[i]; const nc = nodeColor(i); const isCur = st?.cur === i;
            const d = mode === 'dijkstra' && st?.dist?.[i] !== undefined && st.dist[i] !== Infinity ? st.dist[i] : null;
            return (
              <g key={i}>
                {isCur && <circle cx={p.x} cy={p.y} r={26} fill={color + '18'} style={{ animation: 'pulse 1s infinite' }} />}
                <circle cx={p.x} cy={p.y} r={19} fill={nc ? nc + '28' : T.s2} stroke={nc || T.bd} strokeWidth={isCur ? 2.5 : 1.5} style={{ filter: isCur ? `drop-shadow(0 0 10px ${color})` : 'none', transition: 'all .25s' }} />
                <text x={p.x} y={p.y + 5} textAnchor="middle" fill={nc || T.t1} fontSize={12} fontWeight={700}>{i}</text>
                {d !== null && <text x={p.x} y={p.y + 34} textAnchor="middle" fill={T.cy} fontSize={9}>d={d}</text>}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Traversal order + queue/stack display */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
        {st?.order?.length > 0 && (
          <div style={{ padding: '7px 11px', background: T.s2, borderRadius: 8, border: `1px solid ${T.bd}`, fontSize: 11 }}>
            <div style={{ color: T.t3, marginBottom: 4, fontSize: 10, fontWeight: 700 }}>{mode.toUpperCase()} ORDER</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {st.order.map((v, i) => (
                <span key={i} style={{ padding: '2px 7px', borderRadius: 8, background: v === st.cur ? color + '30' : T.s1, color: v === st.cur ? color : T.gn, fontSize: 11, fontWeight: 700, border: `1px solid ${v === st.cur ? color + '60' : T.gn + '40'}` }}>{v}</span>
              ))}
            </div>
          </div>
        )}
        {mode === 'dijkstra' && st?.dist && (
          <div style={{ padding: '7px 11px', background: T.s2, borderRadius: 8, border: `1px solid ${T.bd}`, fontSize: 11 }}>
            <div style={{ color: T.t3, marginBottom: 4, fontSize: 10, fontWeight: 700 }}>SHORTEST DISTANCES FROM {start}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 3 }}>
              {st.dist.map((d, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '2px 0' }}>
                  <div style={{ fontSize: 9, color: T.t3 }}>→{i}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: d === Infinity ? T.t3 : T.cy }}>{d === Infinity ? '∞' : d}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <SimControls sim={sim} color={color} />

      {/* Complexity table */}
      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
        {[['BFS', 'O(V+E)', 'Queue (FIFO)'], ['DFS', 'O(V+E)', 'Stack (LIFO)'], ['Dijkstra', 'O((V+E)logV)', 'Min-Heap']].map(([name, tc, ds]) => (
          <div key={name} style={{ padding: '7px 10px', borderRadius: 8, background: T.s2, border: `1px solid ${T.bd}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color }}>{name}</div>
            <div style={{ fontSize: 10, color: T.t2 }}>{tc}</div>
            <div style={{ fontSize: 9, color: T.t3 }}>{ds}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
