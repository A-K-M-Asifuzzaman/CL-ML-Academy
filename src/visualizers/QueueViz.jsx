import { useState, useRef } from 'react';
import { T } from '../theme.js';

let _qid = 0;

export default function QueueViz({ color }) {
  const [q, setQ] = useState([10, 20, 30].map(v => ({ v, id: ++_qid })));
  const [val, setVal] = useState('');
  const [flash, setFlash] = useState(null);
  const [log, setLog] = useState(['init: [10, 20, 30]']);
  const tref = useRef([]);
  const addLog = (s) => setLog(l => [s, ...l].slice(0, 6));

  const enqueue = () => {
    const v = val === '' ? Math.floor(Math.random() * 90 + 10) : parseInt(val);
    if (isNaN(v)) return;
    const n = { v, id: ++_qid };
    setQ(s => [...s, n]); setFlash({ id: n.id, kind: 'enq' });
    addLog(`enqueue(${v}) → rear  ·  O(1)`); setVal('');
    tref.current.push(setTimeout(() => setFlash(null), 500));
  };

  const dequeue = () => {
    if (!q.length) { addLog('dequeue() → empty!'); return; }
    const front = q[0];
    setFlash({ id: front.id, kind: 'deq' });
    addLog(`dequeue() → ${front.v}  ·  O(1)`);
    tref.current.push(setTimeout(() => { setQ(s => s.slice(1)); setFlash(null); }, 380));
  };

  const clear = () => { setQ([]); addLog('clear()'); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: T.t2, marginBottom: 6 }}>
        <span>QUEUE · FIFO — front (dequeue) ← … ← rear (enqueue)</span><span style={{ color: T.t3 }}>size {q.length}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 12, borderRadius: 10, background: 'rgba(0,0,0,.2)', border: `1px solid ${T.bd}`, minHeight: 64, overflowX: 'auto' }}>
        {!q.length
          ? <span style={{ color: T.t3, fontSize: 12 }}>Queue empty — enqueue something</span>
          : <>
            <div style={{ fontSize: 9, color: T.gn, padding: '2px 7px', borderRadius: 12, background: T.gn + '18', border: `1px solid ${T.gn}35`, flexShrink: 0, fontWeight: 700 }}>FRONT</div>
            {q.map((nd, i) => {
              const isFlash = flash?.id === nd.id;
              const deq = isFlash && flash.kind === 'deq';
              const enq = isFlash && flash.kind === 'enq';
              const isFront = i === 0, isRear = i === q.length - 1;
              const edge = isFront ? T.gn : isRear ? color : T.bd;
              return (
                <div key={nd.id} style={{
                  padding: '9px 15px', borderRadius: 8, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)', color: T.t0, flexShrink: 0,
                  background: isFront ? T.gn + '20' : isRear ? color + '20' : T.s3,
                  border: `1.5px solid ${deq ? T.rd : enq ? T.gn : edge}`,
                  transition: 'all .3s cubic-bezier(.34,1.56,.64,1)',
                  transform: deq ? 'translateX(-30px) scale(.85)' : enq ? 'scale(1.06)' : 'none',
                  opacity: deq ? 0 : 1,
                  boxShadow: (isFront || isRear) ? `0 0 12px ${edge}50` : 'none',
                }}>{nd.v}</div>
              );
            })}
            <div style={{ fontSize: 9, color, padding: '2px 7px', borderRadius: 12, background: color + '18', border: `1px solid ${color}35`, flexShrink: 0, fontWeight: 700 }}>REAR</div>
          </>}
      </div>

      <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && enqueue()} placeholder="value" type="number"
          style={{ width: 80, padding: '6px 10px', borderRadius: 8, border: `1px solid ${T.bd}`, background: T.s2, color: T.t0, fontSize: 12, outline: 'none', fontFamily: 'inherit' }} />
        <button onClick={enqueue} style={{ padding: '6px 15px', borderRadius: 8, border: 'none', background: T.gn, color: T.bg, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>Enqueue</button>
        <button onClick={dequeue} style={{ padding: '6px 15px', borderRadius: 8, border: `1px solid ${T.rd}50`, background: T.rd + '15', color: T.rd, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>Dequeue</button>
        <button onClick={clear} style={{ padding: '6px 11px', borderRadius: 8, border: `1px solid ${T.bd}`, background: 'transparent', color: T.t3, cursor: 'pointer', fontSize: 11 }}>Clear</button>
        <div style={{ display: 'flex', gap: 4, marginLeft: 'auto', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 240 }}>
          {log.slice(0, 2).map((l, i) => (
            <span key={i} style={{ padding: '3px 8px', borderRadius: 6, background: i === 0 ? color + '14' : T.s2, border: `1px solid ${i === 0 ? color + '30' : T.bd}`, fontSize: 10, color: i === 0 ? color : T.t3, fontFamily: 'var(--font-mono)' }}>{l}</span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: 10.5, color: T.t3, lineHeight: 1.6 }}>
        First-In-First-Out. Both ends are <strong style={{ color: T.gn }}>O(1)</strong> with a linked list or circular buffer. Powers BFS, task scheduling, and message pipelines.
      </div>
    </div>
  );
}
