import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { insertBST } from '../generators/index.js';
import { T } from '../theme.js';

const deleteBST = (root, val) => {
  if (!root) return null;
  if (val < root.val) return { ...root, left:  deleteBST(root.left,  val) };
  if (val > root.val) return { ...root, right: deleteBST(root.right, val) };
  if (!root.left)  return root.right;
  if (!root.right) return root.left;
  let succ = root.right;
  while (succ.left) succ = succ.left;
  return { ...root, val: succ.val, right: deleteBST(root.right, succ.val) };
};

const calcPos = (node, x, y, spread) => {
  if (!node) return [];
  return [{ val: node.val, x, y }, ...calcPos(node.left, x - spread, y + 65, spread * 0.54), ...calcPos(node.right, x + spread, y + 65, spread * 0.54)];
};
const calcEdges = (node, x, y, spread) => {
  if (!node) return [];
  const e = [];
  if (node.left)  e.push([x, y, x - spread, y + 65, node.val, node.left.val]);
  if (node.right) e.push([x, y, x + spread, y + 65, node.val, node.right.val]);
  return [...e, ...calcEdges(node.left, x - spread, y + 65, spread * 0.54), ...calcEdges(node.right, x + spread, y + 65, spread * 0.54)];
};

const treeHeight = node => node ? 1 + Math.max(treeHeight(node.left), treeHeight(node.right)) : 0;
const nodeCount  = node => node ? 1 + nodeCount(node.left) + nodeCount(node.right) : 0;
const isBalanced = node => {
  if (!node) return true;
  const diff = Math.abs(treeHeight(node.left) - treeHeight(node.right));
  return diff <= 1 && isBalanced(node.left) && isBalanced(node.right);
};

const DEFAULT_VALS = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 55];

export default function BSTViz({ color }) {
  const [root,    setRoot]    = useState(null);
  const [inp,     setInp]     = useState('');
  const [trav,    setTrav]    = useState([]);
  const [travIdx, setTravIdx] = useState(-1);
  const [travMode, setTravMode] = useState('inorder');
  const [visVal,  setVisVal]  = useState(null);
  const [searchPath, setSearchPath] = useState([]);
  const [searching,  setSearching]  = useState(false);
  const [op, setOp] = useState('insert'); // insert | delete | search
  const intervalRef = useRef(null);
  const newNodeRef  = useRef(null);

  useEffect(() => {
    let r = null;
    DEFAULT_VALS.forEach(v => { r = insertBST(r, v); });
    setRoot(r);
  }, []);

  const nodes = root ? calcPos(root, 280, 40, 130) : [];
  const edges = root ? calcEdges(root, 280, 40, 130) : [];
  const h     = treeHeight(root);
  const n     = nodeCount(root);
  const bal   = isBalanced(root);

  const collect = (mode, r) => {
    const res = [];
    const inn = nd => { if (!nd) return; inn(nd.left); res.push(nd.val); inn(nd.right); };
    const pre = nd => { if (!nd) return; res.push(nd.val); pre(nd.left); pre(nd.right); };
    const pst = nd => { if (!nd) return; pst(nd.left); pst(nd.right); res.push(nd.val); };
    if (mode === 'inorder')   inn(r);
    if (mode === 'preorder')  pre(r);
    if (mode === 'postorder') pst(r);
    return res;
  };

  const runTraversal = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const res = collect(travMode, root);
    setTrav(res); setTravIdx(-1); setVisVal(null); setSearchPath([]);
    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i >= res.length) { clearInterval(intervalRef.current); setVisVal(null); setTravIdx(res.length); return; }
      setVisVal(res[i]); setTravIdx(i); i++;
    }, 380);
  };

  const doSearch = (val) => {
    setSearching(true); setSearchPath([]); setTrav([]);
    const path = [];
    let cur = root;
    const step = () => {
      if (!cur) { setSearching(false); setSearchPath([...path, -1]); return; }
      path.push(cur.val);
      setSearchPath([...path]);
      if (val === cur.val) { setSearching(false); setVisVal(cur.val); return; }
      cur = val < cur.val ? cur.left : cur.right;
      setTimeout(step, 450);
    };
    setTimeout(step, 200);
  };

  const handleOp = () => {
    const v = parseInt(inp);
    if (isNaN(v) || v < 1 || v > 999) return;
    if (op === 'insert') {
      setRoot(r => insertBST(r, v));
      newNodeRef.current = v;
    } else if (op === 'delete') {
      setRoot(r => deleteBST(r, v));
    } else {
      doSearch(v);
    }
    setInp(''); setTrav([]); setTravIdx(-1); setVisVal(null);
    if (op !== 'search') setSearchPath([]);
  };

  const nodeState = val => {
    if (visVal === val) return 'vis';
    if (searchPath.includes(val)) return searchPath[searchPath.length - 1] === val ? 'found' : 'path';
    if (travIdx >= 0 && trav.indexOf(val) <= travIdx && trav.indexOf(val) >= 0 && val !== visVal) return 'done';
    return 'idle';
  };
  const nodeColors = { vis: color, found: T.gn, path: T.or, done: T.cy + '80', idle: null };
  const nc = val => nodeColors[nodeState(val)];

  const opColor = { insert: T.gn, delete: T.rd, search: T.cy }[op];

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 10 }}>
        {[['Height', h, T.or], ['Nodes', n, T.cy], ['Balanced', bal ? 'Yes' : 'No', bal ? T.gn : T.rd]].map(([label, val, c]) => (
          <div key={label} style={{ padding: '7px 10px', borderRadius: 9, background: T.s2, border: `1px solid ${T.bd}`, textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: T.t3 }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: c }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Operation selector */}
        <div style={{ display: 'flex', background: T.s2, borderRadius: 10, padding: 3, border: `1px solid ${T.bd}`, gap: 2 }}>
          {[['insert','Insert',T.gn],['delete','Delete',T.rd],['search','Search',T.cy]].map(([o,l,c]) => (
            <button key={o} onClick={() => setOp(o)} style={{ padding: '4px 11px', borderRadius: 8, border: 'none', background: op === o ? c + '25' : 'transparent', color: op === o ? c : T.t2, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', fontWeight: op === o ? 700 : 400 }}>{l}</button>
          ))}
        </div>
        <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleOp()} placeholder="1-999"
          style={{ width: 80, padding: '5px 8px', borderRadius: 8, border: `1px solid ${opColor}50`, background: T.s2, color: T.t0, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
        <button onClick={handleOp} style={{ padding: '5px 14px', borderRadius: 8, background: opColor + '25', border: `1px solid ${opColor}60`, color: opColor, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>{op === 'insert' ? '+ Insert' : op === 'delete' ? '− Delete' : '⌕ Search'}</button>
        <button onClick={() => { let r = null; DEFAULT_VALS.forEach(v => { r = insertBST(r, v); }); setRoot(r); setTrav([]); setTravIdx(-1); setVisVal(null); setSearchPath([]); }} style={{ padding: '5px 11px', borderRadius: 8, border: `1px solid ${T.bd}`, background: 'transparent', color: T.t2, cursor: 'pointer', fontSize: 11 }}>Reset</button>
      </div>

      {/* SVG */}
      <div style={{ background: T.s1, borderRadius: 12, border: `1px solid ${T.bd}`, overflow: 'hidden', marginBottom: 10 }}>
        <svg width="100%" viewBox="0 0 560 340" style={{ display: 'block' }}>
          {edges.map(([x1, y1, x2, y2, pv, cv], i) => {
            const onPath = searchPath.includes(pv) && searchPath.includes(cv);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={onPath ? T.or : T.bd} strokeWidth={onPath ? 2 : 1.5} style={{ transition: 'all .2s' }} />;
          })}
          {nodes.map(nd => {
            const c = nc(nd.val); const isCur = visVal === nd.val || searchPath[searchPath.length - 1] === nd.val;
            return (
              <g key={nd.val}>
                {isCur && <circle cx={nd.x} cy={nd.y} r={25} fill={(c || color) + '18'} />}
                <circle cx={nd.x} cy={nd.y} r={18} fill={c ? c + '30' : T.s2} stroke={c || T.bd} strokeWidth={isCur ? 2.5 : 1.5} style={{ filter: isCur ? `drop-shadow(0 0 8px ${c || color})` : 'none', transition: 'all .2s' }} />
                <text x={nd.x} y={nd.y + 5} textAnchor="middle" fill={c ? (isCur ? T.bg : c) : T.t1} fontSize={nd.val > 99 ? 9 : 11} fontWeight={700}>{nd.val}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Traversal */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: T.t2 }}>Traversal:</span>
        {[['inorder','Inorder ⟨L→Root→R⟩'],['preorder','Preorder ⟨Root→L→R⟩'],['postorder','Postorder ⟨L→R→Root⟩']].map(([m, l]) => (
          <button key={m} onClick={() => setTravMode(m)} style={{ padding: '3px 10px', borderRadius: 14, border: `1px solid ${travMode === m ? color : T.bd}`, background: travMode === m ? color + '18' : 'transparent', color: travMode === m ? color : T.t2, cursor: 'pointer', fontSize: 10.5 }}>{l}</button>
        ))}
        <button onClick={runTraversal} style={{ padding: '4px 12px', borderRadius: 14, background: T.gn + '20', border: `1px solid ${T.gn}50`, color: T.gn, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>▶ Run</button>
      </div>
      {trav.length > 0 && (
        <div style={{ padding: '7px 12px', background: T.s2, borderRadius: 8, border: `1px solid ${T.bd}`, fontSize: 12 }}>
          <span style={{ color: T.t2, fontSize: 10 }}>{travMode}: </span>
          {trav.map((v, i) => (
            <span key={i}>
              <span style={{ color: i < travIdx ? T.gn : i === travIdx ? color : T.t3, fontWeight: i === travIdx ? 800 : 400 }}>{v}</span>
              {i < trav.length - 1 && <span style={{ color: T.bd }}> → </span>}
            </span>
          ))}
        </div>
      )}
      {searchPath.length > 0 && (
        <div style={{ padding: '7px 12px', background: T.s2, borderRadius: 8, border: `1px solid ${T.bd}`, fontSize: 12, marginTop: 6 }}>
          <span style={{ color: T.t3, fontSize: 10 }}>Search path: </span>
          {searchPath.map((v, i) => (
            <span key={i}>
              <span style={{ color: i === searchPath.length - 1 ? T.gn : T.or, fontWeight: 700 }}>{v === -1 ? '✗ Not found' : v}</span>
              {i < searchPath.length - 1 && <span style={{ color: T.t3 }}> → </span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
