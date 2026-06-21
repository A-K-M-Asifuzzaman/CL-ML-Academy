import { useState, useEffect, useRef } from 'react';
import { T } from '../theme.js';

/* A live, looping product-hero showcase: a browser window that cycles through
   real visualizations (sort → graph → neural net) with animated content and
   floating glass stat cards. Pure CSS/SVG animation — light and smooth. */

const TABS = ['sort.js', 'graph.js', 'network.py'];

function SortScene() {
  const bars = [38, 64, 22, 80, 48, 92, 30, 58, 72, 16];
  const sorted = [...bars].sort((a, b) => a - b);
  return (
    <svg viewBox="0 0 360 180" width="100%" style={{ display: 'block' }}>
      {bars.map((v, i) => (
        <rect key={i} x={14 + i * 34} width={24} rx={5} fill={T.cy}>
          <animate attributeName="height" dur="4s" repeatCount="indefinite"
            values={`${v};${sorted[i]};${sorted[i]};${v}`} keyTimes="0;0.45;0.85;1" />
          <animate attributeName="y" dur="4s" repeatCount="indefinite"
            values={`${150 - v};${150 - sorted[i]};${150 - sorted[i]};${150 - v}`} keyTimes="0;0.45;0.85;1" />
          <animate attributeName="fill" dur="4s" repeatCount="indefinite"
            values={`${T.cy};${T.gn};${T.gn};${T.cy}`} keyTimes="0;0.45;0.85;1" />
        </rect>
      ))}
    </svg>
  );
}

function GraphScene() {
  const nodes = [[60,40],[160,30],[280,55],[100,120],[210,130],[320,120]];
  const edges = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5]];
  return (
    <svg viewBox="0 0 360 180" width="100%" style={{ display: 'block' }}>
      {edges.map(([a,b],i)=>(
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={T.bd} strokeWidth={1.5}>
          <animate attributeName="stroke" dur="3.2s" begin={`${i*0.25}s`} repeatCount="indefinite" values={`${T.bd};${T.pu};${T.bd}`} />
          <animate attributeName="stroke-width" dur="3.2s" begin={`${i*0.25}s`} repeatCount="indefinite" values="1.5;2.6;1.5" />
        </line>
      ))}
      {nodes.map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r={16} fill={T.s3} stroke={T.pu} strokeWidth={1.6}>
            <animate attributeName="fill" dur="3.2s" begin={`${i*0.3}s`} repeatCount="indefinite" values={`${T.s3};${T.pu}44;${T.s3}`} />
          </circle>
          <text x={x} y={y+4} textAnchor="middle" fill={T.t1} fontSize={11} fontFamily="var(--font-mono)">{i}</text>
        </g>
      ))}
    </svg>
  );
}

function NetScene() {
  const layers = [[40,[50,90,130]],[150,[40,75,110,145]],[260,[55,90,125]],[330,[90]]];
  const all = layers.flatMap(([x, ys]) => ys.map(y => [x, y]));
  return (
    <svg viewBox="0 0 380 180" width="100%" style={{ display: 'block' }}>
      {layers.slice(0,-1).map(([x1,ys1],li)=>{
        const [x2,ys2]=layers[li+1];
        return ys1.flatMap((y1,a)=>ys2.map((y2,b)=>(
          <line key={`${li}-${a}-${b}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.bd} strokeWidth={0.6}>
            <animate attributeName="stroke" dur="2.6s" begin={`${li*0.4}s`} repeatCount="indefinite" values={`${T.bd};${T.gn}66;${T.bd}`} />
          </line>
        )));
      })}
      {all.map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={9} fill={T.s3} stroke={T.gn} strokeWidth={1.4}>
          <animate attributeName="fill" dur="2.6s" begin={`${(x/80)*0.4}s`} repeatCount="indefinite" values={`${T.s3};${T.gn};${T.s3}`} />
        </circle>
      ))}
    </svg>
  );
}

const SCENES = [SortScene, GraphScene, NetScene];
const ACCENTS = [T.cy, T.pu, T.gn];

export default function HeroShowcase() {
  const [tab, setTab] = useState(0);
  const timer = useRef(null);
  useEffect(() => {
    timer.current = setInterval(() => setTab(t => (t + 1) % 3), 4200);
    return () => clearInterval(timer.current);
  }, []);
  const Scene = SCENES[tab];
  const ac = ACCENTS[tab];

  return (
    <div style={{ position: 'relative' }}>
      {/* glow behind */}
      <div className="orb" style={{ width: 280, height: 280, background: ac, top: -30, right: -20, opacity: .22, transition: 'background .6s' }} />

      <div className="window" style={{ position: 'relative', zIndex: 1 }}>
        {/* chrome */}
        <div className="window-bar">
          <span className="window-dot" style={{ background: '#ff5f57' }} />
          <span className="window-dot" style={{ background: '#febc2e' }} />
          <span className="window-dot" style={{ background: '#28c840' }} />
          <div style={{ display: 'flex', gap: 4, marginLeft: 12 }}>
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)}
                style={{ fontSize: 11, padding: '4px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)',
                  background: i === tab ? T.s3 : 'transparent', color: i === tab ? ACCENTS[i] : T.t3, transition: 'all .2s' }}>{t}</button>
            ))}
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: T.t3, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.gn, boxShadow: `0 0 6px ${T.gn}` }} /> running
          </span>
        </div>

        {/* body */}
        <div style={{ padding: 18, background: `radial-gradient(120% 80% at 50% -10%, ${ac}0d, transparent 60%)` }}>
          <div style={{ minHeight: 188, display: 'flex', alignItems: 'center' }}>
            <Scene />
          </div>
          {/* mini stat footer */}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {[['steps', '1,284'], ['ops/s', '60'], ['complexity', tab === 0 ? 'O(n log n)' : tab === 1 ? 'O(V+E)' : 'O(n·d)']].map(([k, v]) => (
              <div key={k} style={{ flex: 1, background: T.s2, border: `1px solid ${T.bd}`, borderRadius: 9, padding: '8px 10px' }}>
                <div style={{ fontSize: 9.5, color: T.t3, textTransform: 'uppercase', letterSpacing: '.08em' }}>{k}</div>
                <div style={{ fontSize: 13, color: T.t0, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* floating glass cards */}
      <div className="glass-2 float-med" style={{ position: 'absolute', top: -18, left: -22, zIndex: 2, padding: '10px 13px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: T.gn + '1e', color: T.gn, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>✓</div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: T.t0, lineHeight: 1 }}>+15 XP</div>
          <div style={{ fontSize: 10, color: T.t3, marginTop: 2 }}>topic complete</div>
        </div>
      </div>

      <div className="glass-2 float-slow" style={{ position: 'absolute', bottom: -20, right: -16, zIndex: 2, padding: '10px 13px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: T.or + '1e', color: T.or, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🔥</div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: T.t0, lineHeight: 1 }}>7-day streak</div>
          <div style={{ fontSize: 10, color: T.t3, marginTop: 2 }}>keep it going</div>
        </div>
      </div>
    </div>
  );
}
