import { useState, useMemo, useRef, useEffect } from 'react';
import { T } from '../theme.js';

// Each complexity: growth fn, color, label, real-world note, sample algorithms
const FNS = [
  { key: 'o1',    name: 'O(1)',        col: T.gn, fn: () => 1,                                                            algos: 'Hash get · Stack push' },
  { key: 'ologn', name: 'O(log n)',    col: T.cy, fn: n => Math.log2(n),                                                  algos: 'Binary search · BST find' },
  { key: 'on',    name: 'O(n)',        col: T.bl, fn: n => n,                                                             algos: 'Linear scan · Counting' },
  { key: 'onlogn',name: 'O(n log n)',  col: T.ye, fn: n => n * Math.log2(n),                                             algos: 'Merge · Heap · Quick sort' },
  { key: 'on2',   name: 'O(n²)',       col: T.or, fn: n => n * n,                                                        algos: 'Bubble sort · All pairs' },
  { key: 'o2n',   name: 'O(2ⁿ)',       col: T.rd, fn: n => Math.pow(2, n),                                               algos: 'Naive Fibonacci · Subsets' },
  { key: 'onf',   name: 'O(n!)',       col: T.mg, fn: n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }, algos: 'Brute-force TSP · Permute' },
];

const fmt = (x) => {
  if (x < 1000) return x % 1 === 0 ? `${x}` : x.toFixed(1);
  if (x < 1e6) return `${(x / 1e3).toFixed(1)}K`;
  if (x < 1e9) return `${(x / 1e6).toFixed(1)}M`;
  if (x < 1e12) return `${(x / 1e9).toFixed(1)}B`;
  if (x < 1e15) return `${(x / 1e12).toFixed(1)}T`;
  return x.toExponential(1);
};

// ops → human time assuming 1e9 ops/sec
const opsToTime = (ops) => {
  const s = ops / 1e9;
  if (s < 1e-6) return '< 1µs';
  if (s < 1e-3) return `${(s * 1e6).toFixed(0)}µs`;
  if (s < 1)    return `${(s * 1e3).toFixed(0)}ms`;
  if (s < 60)   return `${s.toFixed(1)}s`;
  if (s < 3600) return `${(s / 60).toFixed(1)}min`;
  if (s < 86400)return `${(s / 3600).toFixed(1)}h`;
  if (s < 3.15e7) return `${(s / 86400).toFixed(1)}d`;
  const yr = s / 3.15e7;
  if (yr < 1e3) return `${yr.toFixed(0)}yr`;
  if (yr < 1e9) return `${(yr / 1e3).toFixed(0)}K yr`;
  return `${yr.toExponential(1)} yr`;
};

const W = 560, H = 240, PAD_L = 38, PAD_B = 26, PAD_T = 14, PAD_R = 36;
const N_PLOT = 32;
const Y_CAP = 64;

export default function BigOViz() {
  const [n, setN] = useState(16);
  const [hover, setHover] = useState(null);
  const [active, setActive] = useState(FNS.map(f => f.key));
  const [drawn, setDrawn] = useState(false);
  const pathRefs = useRef({});

  useEffect(() => { const t = setTimeout(() => setDrawn(true), 60); return () => clearTimeout(t); }, []);

  const px = (i) => PAD_L + (i / (N_PLOT - 1)) * (W - PAD_L - PAD_R);
  const py = (v) => H - PAD_B - Math.min(v, Y_CAP) / Y_CAP * (H - PAD_T - PAD_B);

  const curves = useMemo(() => FNS.map(f => {
    const pts = Array.from({ length: N_PLOT }, (_, i) => {
      const x = (i / (N_PLOT - 1)) * 16 + 0.001;
      const raw = f.fn(x);
      const scaled = f.key === 'o1' ? 1
        : f.key === 'ologn' ? raw * 4
        : f.key === 'on' ? raw * 2.6
        : f.key === 'onlogn' ? raw * 0.9
        : f.key === 'on2' ? raw * 0.32
        : f.key === 'o2n' ? Math.min(raw * 0.02, Y_CAP)
        : Math.min(raw * 0.0001, Y_CAP);
      return { x: px(i), y: py(scaled) };
    });
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    return { ...f, d, end: pts[pts.length - 1] };
  }), []);

  const toggle = (key) => setActive(a => a.includes(key) ? (a.length > 1 ? a.filter(k => k !== key) : a) : [...a, key]);

  return (
    <div>
      {/* Legend pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {FNS.map(f => {
          const on = active.includes(f.key);
          return (
            <button key={f.key} onClick={() => toggle(f.key)}
              onMouseEnter={() => setHover(f.key)} onMouseLeave={() => setHover(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 20, cursor: 'pointer',
                background: on ? f.col + '18' : 'transparent', border: `1px solid ${on ? f.col + '50' : T.bd}`,
                color: on ? f.col : T.t3, fontSize: 11, fontFamily: 'var(--font-mono)', transition: 'all .15s', opacity: on ? 1 : .5 }}>
              <span style={{ width: 14, height: 3, borderRadius: 2, background: f.col, boxShadow: on ? `0 0 6px ${f.col}` : 'none' }} />
              {f.name}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }} onMouseLeave={() => setHover(null)}>
        <defs>
          {FNS.map(f => (
            <linearGradient key={f.key} id={`fill-${f.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={f.col} stopOpacity="0.22" />
              <stop offset="100%" stopColor={f.col} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {[0, .25, .5, .75, 1].map(t => (
          <line key={t} x1={PAD_L} y1={py(Y_CAP * t)} x2={W - PAD_R} y2={py(Y_CAP * t)} stroke={T.bd} strokeWidth={0.5} strokeDasharray="2 4" opacity={0.5} />
        ))}
        <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke={T.bd} strokeWidth={1.2} />
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke={T.bd} strokeWidth={1.2} />
        <text x={(W + PAD_L) / 2} y={H - 4} textAnchor="middle" fill={T.t3} fontSize={10}>input size (n) →</text>
        <text x={-(H / 2)} y={11} transform="rotate(-90)" textAnchor="middle" fill={T.t3} fontSize={10}>operations →</text>

        {(() => {
          const xMark = px(Math.min(n, 16) / 16 * (N_PLOT - 1));
          return <line x1={xMark} y1={PAD_T} x2={xMark} y2={H - PAD_B} stroke={T.cy} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />;
        })()}

        {curves.filter(c => active.includes(c.key)).map(c => {
          const dim = hover && hover !== c.key;
          const areaD = `${c.d} L${c.end.x},${H - PAD_B} L${PAD_L},${H - PAD_B} Z`;
          return (
            <g key={c.key} style={{ opacity: dim ? 0.18 : 1, transition: 'opacity .2s' }}>
              {hover === c.key && <path d={areaD} fill={`url(#fill-${c.key})`} />}
              <path ref={el => (pathRefs.current[c.key] = el)} d={c.d} fill="none" stroke={c.col}
                strokeWidth={hover === c.key ? 3 : 2} strokeLinecap="round" strokeLinejoin="round"
                style={{ filter: hover === c.key ? `drop-shadow(0 0 4px ${c.col})` : 'none',
                  strokeDasharray: 1400, strokeDashoffset: drawn ? 0 : 1400,
                  transition: 'stroke-dashoffset 1.1s ease, stroke-width .15s, filter .15s' }} />
              <text x={Math.min(c.end.x + 4, W - 2)} y={Math.max(PAD_T + 6, Math.min(c.end.y, H - PAD_B - 2))} fill={c.col} fontSize={9} fontFamily="var(--font-mono)">{c.name}</text>
            </g>
          );
        })}
      </svg>

      {/* n slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '10px 2px 14px' }}>
        <span style={{ fontSize: 11, color: T.t2, whiteSpace: 'nowrap' }}>n = <strong style={{ color: T.cy, fontFamily: 'var(--font-mono)', fontSize: 13 }}>{n}</strong></span>
        <input type="range" min={1} max={64} value={n} onChange={e => setN(+e.target.value)} style={{ flex: 1, accentColor: T.cy, cursor: 'pointer' }} />
      </div>

      {/* Live operations table */}
      <div style={{ overflowX: 'auto', borderRadius: 10, border: `1px solid ${T.bd}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, fontFamily: 'var(--font-mono)' }}>
          <thead>
            <tr style={{ background: T.s2 }}>
              <th style={{ textAlign: 'left', padding: '7px 12px', color: T.t2, fontWeight: 600 }}>Complexity</th>
              <th style={{ textAlign: 'right', padding: '7px 12px', color: T.t2, fontWeight: 600 }}>ops @ n={n}</th>
              <th style={{ textAlign: 'right', padding: '7px 12px', color: T.t2, fontWeight: 600 }}>est. time</th>
              <th className="hide-mobile" style={{ textAlign: 'left', padding: '7px 12px', color: T.t2, fontWeight: 600 }}>Examples</th>
            </tr>
          </thead>
          <tbody>
            {FNS.filter(f => active.includes(f.key)).map(f => {
              const ops = f.fn(n);
              const danger = ops > 1e9;
              return (
                <tr key={f.key} style={{ borderTop: `1px solid ${T.bd}`, background: hover === f.key ? f.col + '0c' : 'transparent', transition: 'background .15s' }}
                  onMouseEnter={() => setHover(f.key)} onMouseLeave={() => setHover(null)}>
                  <td style={{ padding: '7px 12px', color: f.col, fontWeight: 700 }}>
                    <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: f.col, marginRight: 7, verticalAlign: 'middle' }} />
                    {f.name}
                  </td>
                  <td style={{ padding: '7px 12px', textAlign: 'right', color: danger ? T.rd : T.t1 }}>{fmt(ops)}</td>
                  <td style={{ padding: '7px 12px', textAlign: 'right', color: danger ? T.rd : T.gn }}>{opsToTime(ops)}</td>
                  <td className="hide-mobile" style={{ padding: '7px 12px', color: T.t3, fontFamily: 'var(--font-sans)' }}>{f.algos}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 8, fontSize: 10.5, color: T.t3, lineHeight: 1.6 }}>
        💡 Time assumes ~10⁹ ops/sec. Toggle curves &amp; drag the slider — see how <span style={{ color: T.rd }}>O(2ⁿ)</span> and <span style={{ color: T.mg }}>O(n!)</span> become impossible well before n=64.
      </div>
    </div>
  );
}
