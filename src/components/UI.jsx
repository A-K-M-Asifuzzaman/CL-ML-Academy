import { useState } from 'react';
import { T } from '../theme.js';
import CodeTrace from './CodeTrace.jsx';

export function SimControls({ sim, color = T.cy, codeKey }) {
  const handleSeek = e => {
    const r = e.currentTarget.getBoundingClientRect();
    sim.seek(Math.round(((e.clientX - r.left) / r.width) * (sim.total - 1)));
  };
  return (
    <>
      {codeKey && <CodeTrace codeKey={codeKey} state={sim.state} color={color} />}
    <div className="glass-2" style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderRadius:12, flexWrap:'wrap', marginTop:12 }}>
      <div style={{ display:'flex', gap:4 }}>
        {[['⏮','reset','Restart'],['⏪','prev','Step back'],['pp','pp','Play/Pause'],['⏩','next','Step forward']].map(([icon, act, title]) => (
          <button key={act} title={title}
            onClick={act === 'pp' ? (sim.playing ? sim.pause : sim.play) : sim[act]}
            style={{ width: act==='pp'?34:30, height:30, borderRadius:8, border: act==='pp'?'none':`1px solid ${T.bd}`, cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center',
              background: act === 'pp' ? `linear-gradient(135deg, ${color}, ${color}bb)` : 'rgba(255,255,255,.03)',
              color: act === 'pp' ? T.bg : T.t1, flexShrink:0, transition:'all .15s', fontWeight: act==='pp'?700:400,
              boxShadow: act==='pp' ? `0 4px 14px -4px ${color}` : 'none' }}
            onMouseEnter={e => { if(act!=='pp'){ e.currentTarget.style.borderColor = color+'70'; e.currentTarget.style.color = color; } }}
            onMouseLeave={e => { if(act!=='pp'){ e.currentTarget.style.borderColor = T.bd; e.currentTarget.style.color = T.t1; } }}>
            {act === 'pp' ? (sim.playing ? '⏸' : '▶') : icon}
          </button>
        ))}
      </div>
      <div style={{ flex:1, minWidth:90, cursor:'pointer' }} onClick={handleSeek}>
        <div style={{ height:5, background:T.s3, borderRadius:3, position:'relative', overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${sim.progress * 100}%`, background:`linear-gradient(90deg, ${color}, ${T.pu})`, borderRadius:3, transition:'width .08s', boxShadow:`0 0 8px ${color}80` }} />
        </div>
        <div style={{ fontSize:10, color:T.t2, marginTop:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          <span style={{ fontFamily:'var(--font-mono)', color:color }}>{sim.idx + 1}/{sim.total}</span>{sim.state?.msg ? ` — ${sim.state.msg}` : ''}
        </div>
      </div>
      <select value={sim.speed} onChange={e => sim.setSpeed(+e.target.value)}
        style={{ background:T.s3, color:T.t1, border:`1px solid ${T.bd}`, borderRadius:7, padding:'4px 7px', fontSize:11, cursor:'pointer' }}>
        {[0.25, 0.5, 1, 2, 4].map(s => <option key={s} value={s}>{s}×</option>)}
      </select>
    </div>
    </>
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
