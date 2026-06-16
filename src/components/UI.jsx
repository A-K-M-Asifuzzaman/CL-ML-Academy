import { useState } from 'react';
import { T } from '../theme.js';

export function SimControls({ sim, color = T.cy }) {
  const handleSeek = e => {
    const r = e.currentTarget.getBoundingClientRect();
    sim.seek(Math.round(((e.clientX - r.left) / r.width) * (sim.total - 1)));
  };
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', background:T.s2, borderRadius:8, border:`1px solid ${T.bd}`, flexWrap:'wrap', marginTop:10 }}>
      <div style={{ display:'flex', gap:3 }}>
        {[['⏮','reset'],['⏪','prev'],['pp','pp'],['⏩','next']].map(([icon, act]) => (
          <button key={act}
            onClick={act === 'pp' ? (sim.playing ? sim.pause : sim.play) : sim[act]}
            style={{ width:28, height:28, borderRadius:5, border:'none', cursor:'pointer', fontSize:13,
              background: act === 'pp' ? color + 'cc' : T.s3,
              color: act === 'pp' ? T.bg : T.t1, flexShrink:0 }}>
            {act === 'pp' ? (sim.playing ? '⏸' : '▶') : icon}
          </button>
        ))}
      </div>
      <div style={{ flex:1, minWidth:80, cursor:'pointer' }} onClick={handleSeek}>
        <div style={{ height:3, background:T.s3, borderRadius:2 }}>
          <div style={{ height:'100%', width:`${sim.progress * 100}%`, background:color, borderRadius:2, transition:'width .08s' }} />
        </div>
        <div style={{ fontSize:10, color:T.t2, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {sim.idx + 1}/{sim.total}{sim.state?.msg ? ` — ${sim.state.msg}` : ''}
        </div>
      </div>
      <select value={sim.speed} onChange={e => sim.setSpeed(+e.target.value)}
        style={{ background:T.s3, color:T.t1, border:`1px solid ${T.bd}`, borderRadius:5, padding:'2px 5px', fontSize:11 }}>
        {[0.25, 0.5, 1, 2, 4].map(s => <option key={s} value={s}>{s}x</option>)}
      </select>
    </div>
  );
}

export function CodeBlock({ code, language = 'javascript' }) {
  const [copied, setCopied] = useState(false);
  const lines = code.trim().split('\n');
  const hl = line => {
    const e = line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return e
      .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm, '<span style="color:#5a7080">$1</span>')
      .replace(/('(?:[^\'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span style="color:#9ecbff">$1</span>')
      .replace(/\b(const|let|var|function|class|return|if|else|for|while|import|export|default|async|await|new|this|from|of|in|static|extends|constructor|yield|throw|try|catch|switch|case|break|continue|null|undefined|true|false|def|self|pass)\b/g, '<span style="color:#ff7b72">$&</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#79c0ff">$&</span>');
  };
  return (
    <div style={{ borderRadius:8, overflow:'hidden', border:`1px solid ${T.bd}`, background:'#050d1a', fontSize:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 12px', background:T.s2, borderBottom:`1px solid ${T.bd}` }}>
        <span style={{ fontSize:11, color:T.t2 }}>{language}</span>
        <button onClick={() => { try { navigator.clipboard.writeText(code); } catch {} setCopied(true); setTimeout(() => setCopied(false), 1400); }}
          style={{ fontSize:11, background:'transparent', border:`1px solid ${T.bd}`, borderRadius:4, color:copied ? T.gn : T.t2, padding:'2px 8px', cursor:'pointer' }}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div style={{ overflowX:'auto', padding:'12px 16px' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display:'flex', gap:12, lineHeight:'1.7' }}>
            <span style={{ color:T.t3, minWidth:24, textAlign:'right', userSelect:'none', fontSize:10, paddingTop:1 }}>{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: hl(line) }} style={{ color:T.t1, fontFamily:'var(--font-mono)', whiteSpace:'pre' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Badge({ text, color }) {
  return (
    <span style={{ fontSize:10, padding:'2px 8px', borderRadius:12, background:color + '18', color, border:`1px solid ${color}30`, flexShrink:0 }}>
      {text}
    </span>
  );
}

export function PointCard({ point, index, color }) {
  return (
    <div style={{ padding:'10px 14px', background:T.s1, borderRadius:9, border:`1px solid ${T.bd}`, display:'flex', gap:12, alignItems:'flex-start' }}>
      <div style={{ width:22, height:22, borderRadius:'50%', background:color + '20', color, fontSize:11, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, flexShrink:0, marginTop:1 }}>
        {index + 1}
      </div>
      <div>
        <div style={{ fontSize:13, fontWeight:700, color, marginBottom:3 }}>{point.t}</div>
        <div style={{ fontSize:13, color:T.t1, lineHeight:1.65 }}>{point.d}</div>
      </div>
    </div>
  );
}

export function Loader({ color = T.cy }) {
  return (
    <div style={{ display:'flex', gap:5, alignItems:'center', padding:'6px 0' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:color, animation:`pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

export function ProgressBar({ value, color, height = 4 }) {
  return (
    <div style={{ height, background:T.bd, borderRadius:height / 2, overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${value}%`, background:color, borderRadius:height / 2, transition:'width .5s ease' }} />
    </div>
  );
}
