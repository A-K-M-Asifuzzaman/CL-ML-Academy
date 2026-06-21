import { useState, useRef } from 'react';
import { T } from '../theme.js';

let _sid = 0;

export default function StackViz({ color }) {
  const [stack, setStack] = useState([10, 20, 5].map(v => ({ v, id: ++_sid })));
  const [val, setVal] = useState('');
  const [flash, setFlash] = useState(null);
  const [log, setLog] = useState(['init: [10, 20, 5]']);
  const [peeked, setPeeked] = useState(false);
  const tref = useRef([]);

  const addLog = (s) => setLog(l => [s, ...l].slice(0, 6));

  const push = () => {
    const v = val === '' ? Math.floor(Math.random() * 90 + 10) : parseInt(val);
    if (isNaN(v)) return;
    const n = { v, id: ++_sid };
    setStack(s => [...s, n]); setFlash({ id: n.id, kind: 'push' });
    addLog(`push(${v}) → top  ·  O(1)`); setVal('');
    tref.current.push(setTimeout(() => setFlash(null), 500));
  };

  const pop = () => {
    if (!stack.length) { addLog('pop() → underflow!'); return; }
    const top = stack[stack.length - 1];
    setFlash({ id: top.id, kind: 'pop' });
    addLog(`pop() → ${top.v}  ·  O(1)`);
    tref.current.push(setTimeout(() => { setStack(s => s.slice(0, -1)); setFlash(null); }, 380));
  };

  const peek = () => {
    if (!stack.length) { addLog('peek() → empty'); return; }
    setPeeked(true); addLog(`peek() → ${stack[stack.length - 1].v} (no removal)`);
    tref.current.push(setTimeout(() => setPeeked(false), 800));
  };

  const clear = () => { setStack([]); addLog('clear()'); };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 14 }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: T.t2, marginBottom: 6 }}>
          <span>STACK · LIFO</span><span style={{ color: T.t3 }}>size {stack.length}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 4, minHeight: 170, justifyContent: 'flex-start', padding: 8, borderRadius: 10, background: 'rgba(0,0,0,.2)', border: `1px solid ${T.bd}` }}>
          {!stack.length && <div style={{ textAlign: 'center', color: T.t3, fontSize: 12, padding: 18 }}>empty — push something</div>}
          {stack.map((nd, i) => {
            const top = i === stack.length - 1;
            const isFlash = flash?.id === nd.id;
            const popping = isFlash && flash.kind === 'pop';
            const c = top ? color : T.bd;
            return (
              <div key={nd.id} style={{
                padding: '9px 14px', borderRadius: 7, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: top || isFlash ? color + '24' : T.s2, border: `1.5px solid ${isFlash ? (popping ? T.rd : T.gn) : c}`,
                transition: 'all .3s cubic-bezier(.34,1.56,.64,1)',
                transform: popping ? 'translateX(40px) scale(.9)' : (top && peeked) ? 'scale(1.04)' : 'none',
                opacity: popping ? 0 : 1,
                boxShadow: top ? `0 0 14px ${color}50` : 'none',
              }}>
                <span style={{ fontWeight: 700, color: top ? color : T.t1, fontSize: 14, fontFamily: 'var(--font-mono)' }}>{nd.v}</span>
                {top && <span style={{ fontSize: 9, color, fontWeight: 700, letterSpacing: 1 }}>← TOP</span>}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && push()} placeholder="value" type="number"
            style={{ width: 76, padding: '6px 9px', borderRadius: 8, border: `1px solid ${T.bd}`, background: T.s2, color: T.t0, fontSize: 12, outline: 'none', fontFamily: 'inherit' }} />
          <button onClick={push} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: T.gn, color: T.bg, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>Push</button>
          <button onClick={pop} style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${T.rd}50`, background: T.rd + '15', color: T.rd, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>Pop</button>
          <button onClick={peek} style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${color}45`, background: color + '12', color, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>Peek</button>
          <button onClick={clear} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${T.bd}`, background: 'transparent', color: T.t3, cursor: 'pointer', fontSize: 11 }}>Clear</button>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10.5, color: T.t2, marginBottom: 6 }}>OPERATION LOG</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {log.map((l, i) => (
            <div key={i} style={{ padding: '5px 9px', borderRadius: 6, background: i === 0 ? color + '14' : T.s2, border: `1px solid ${i === 0 ? color + '30' : T.bd}`, fontSize: 10.5, color: i === 0 ? color : T.t2, fontFamily: 'var(--font-mono)', opacity: 1 - i * 0.13 }}>{l}</div>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 10, color: T.t3, lineHeight: 1.6 }}>Last-In-First-Out. Used in call stacks, undo, DFS, expression parsing.</div>
      </div>
    </div>
  );
}
