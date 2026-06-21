import { useState, useRef, useCallback } from 'react';
import { T } from '../theme.js';

let _id = 100;
const node = (v) => ({ v, id: ++_id });
const INIT = [10, 25, 37, 48, 61].map(node);

export default function LinkedListViz({ color }) {
  const [list, setList] = useState(INIT);
  const [val, setVal] = useState('');
  const [pos, setPos] = useState('');
  const [active, setActive] = useState(-1);   // highlighted (traversal/found)
  const [flashId, setFlashId] = useState(null); // newly inserted
  const [msg, setMsg] = useState('Singly linked list · head → … → null');
  const [busy, setBusy] = useState(false);
  const timers = useRef([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const sleep = (ms) => new Promise(r => timers.current.push(setTimeout(r, ms)));

  // animated traversal up to index (inclusive)
  const traverse = useCallback(async (target, label) => {
    for (let i = 0; i <= target; i++) {
      setActive(i);
      setMsg(`${label}: visiting node[${i}]${i === target ? '' : ' → next'}`);
      await sleep(420);
    }
  }, []);

  const insertHead = async () => {
    const v = parseInt(val); if (isNaN(v) || busy) return;
    setBusy(true); const n = node(v);
    setMsg(`insertHead(${v}): new node → old head, head = new  ·  O(1)`);
    setList(l => [n, ...l]); setFlashId(n.id);
    await sleep(700); setFlashId(null); setActive(-1); setBusy(false); setVal('');
  };

  const insertTail = async () => {
    const v = parseInt(val); if (isNaN(v) || busy) return;
    setBusy(true); const n = node(v);
    await traverse(list.length - 1, `insertTail(${v})`);
    setMsg(`insertTail(${v}): reached tail, tail.next = new  ·  O(n)`);
    setList(l => [...l, n]); setFlashId(n.id);
    await sleep(700); setFlashId(null); setActive(-1); setBusy(false); setVal('');
  };

  const insertAt = async () => {
    const v = parseInt(val), p = parseInt(pos);
    if (isNaN(v) || isNaN(p) || busy) return;
    const idx = Math.max(0, Math.min(p, list.length));
    setBusy(true); const n = node(v);
    if (idx > 0) await traverse(idx - 1, `insertAt(${idx})`);
    setMsg(`insertAt(${idx}, ${v}): rewire prev.next → new → old  ·  O(n)`);
    setList(l => { const c = [...l]; c.splice(idx, 0, n); return c; }); setFlashId(n.id);
    await sleep(700); setFlashId(null); setActive(-1); setBusy(false); setVal(''); setPos('');
  };

  const search = async () => {
    const v = parseInt(val); if (isNaN(v) || busy) return;
    setBusy(true);
    for (let i = 0; i < list.length; i++) {
      setActive(i); setMsg(`search(${v}): node[${i}] = ${list[i].v} ${list[i].v === v ? '✓ match!' : '✗'}`);
      await sleep(420);
      if (list[i].v === v) { setMsg(`search(${v}): found at index ${i}  ·  O(n)`); await sleep(900); setActive(-1); setBusy(false); return; }
    }
    setMsg(`search(${v}): not found after ${list.length} comparisons  ·  O(n)`);
    await sleep(800); setActive(-1); setBusy(false);
  };

  const deleteAt = async () => {
    const p = parseInt(pos); if (isNaN(p) || busy || !list.length) return;
    const idx = Math.max(0, Math.min(p, list.length - 1));
    setBusy(true);
    if (idx > 0) await traverse(idx - 1, `delete(${idx})`);
    setActive(idx); setMsg(`delete(${idx}): prev.next = node.next, free node  ·  O(${idx === 0 ? '1' : 'n'})`);
    await sleep(550);
    setList(l => l.filter((_, i) => i !== idx));
    setActive(-1); setBusy(false); setPos('');
  };

  const reverse = async () => {
    if (busy || list.length < 2) return;
    setBusy(true); setMsg('reverse(): prev=null, walk flipping each next pointer  ·  O(n)');
    for (let i = 0; i < list.length; i++) { setActive(i); await sleep(320); }
    setList(l => [...l].reverse());
    setMsg('reverse(): done — head and tail swapped  ·  O(n) time, O(1) space');
    await sleep(700); setActive(-1); setBusy(false);
  };

  const reset = () => { clearTimers(); _id = 100; setList([10, 25, 37, 48, 61].map(node)); setActive(-1); setFlashId(null); setBusy(false); setMsg('Reset.'); };

  const OPS = [
    { label: '+ Head', fn: insertHead, c: color, need: 'val' },
    { label: '+ Tail', fn: insertTail, c: color, need: 'val' },
    { label: '+ At pos', fn: insertAt, c: T.cy, need: 'both' },
    { label: '🔍 Search', fn: search, c: T.ye, need: 'val' },
    { label: '✕ Delete pos', fn: deleteAt, c: T.rd, need: 'pos' },
    { label: '↺ Reverse', fn: reverse, c: T.pu, need: 'none' },
  ];

  return (
    <div>
      {/* Node chain */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', overflowX: 'auto', padding: '18px 4px 12px', marginBottom: 10, minHeight: 90 }}>
        <div style={{ fontSize: 10, color: T.gn, fontWeight: 700, marginRight: 6, flexShrink: 0 }}>head</div>
        <span style={{ color: T.t3, marginRight: 6, flexShrink: 0 }}>▶</span>
        {list.map((nd, i) => {
          const isActive = active === i;
          const isFlash = flashId === nd.id;
          const hl = isActive || isFlash;
          const c = isFlash ? T.gn : isActive ? color : T.bd;
          return (
            <div key={nd.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ position: 'relative', display: 'flex', borderRadius: 9, overflow: 'hidden', border: `2px solid ${c}`, background: hl ? c + '22' : T.s2, transition: 'all .25s', boxShadow: hl ? `0 0 16px ${c}70` : 'none', transform: isFlash ? 'translateY(-4px)' : 'none' }}>
                <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${T.bd}` }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: hl ? c : T.t1, fontFamily: 'var(--font-mono)' }}>{nd.v}</div>
                  <div style={{ fontSize: 8, color: T.t3 }}>data</div>
                </div>
                <div style={{ padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: T.s3 + '60' }}>
                  <div style={{ fontSize: 12, color: T.t2 }}>•</div>
                  <div style={{ fontSize: 8, color: T.t3 }}>next</div>
                </div>
                <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: T.t3, whiteSpace: 'nowrap' }}>[{i}]</div>
              </div>
              <span style={{ color: i === list.length - 1 ? T.t3 : (active > i ? color : T.t3), padding: '0 5px', fontSize: 13, transition: 'color .2s' }}>▶</span>
            </div>
          );
        })}
        <div style={{ fontSize: 11, color: T.t3, flexShrink: 0, fontFamily: 'var(--font-mono)' }}>null</div>
      </div>

      {/* Message */}
      <div className="glass-2" style={{ padding: '8px 12px', borderRadius: 9, fontSize: 11.5, color: busy ? color : T.t1, marginBottom: 10, minHeight: 34, display: 'flex', alignItems: 'center', fontFamily: 'var(--font-mono)' }}>
        {msg}
      </div>

      {/* Inputs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        <input value={val} onChange={e => setVal(e.target.value)} placeholder="value" type="number"
          style={{ width: 90, padding: '6px 10px', borderRadius: 8, border: `1px solid ${T.bd}`, background: T.s2, color: T.t0, fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
        <input value={pos} onChange={e => setPos(e.target.value)} placeholder="index" type="number"
          style={{ width: 80, padding: '6px 10px', borderRadius: 8, border: `1px solid ${T.bd}`, background: T.s2, color: T.t0, fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
        <button onClick={reset} style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${T.bd}`, background: 'transparent', color: T.t2, cursor: 'pointer', fontSize: 11, marginLeft: 'auto' }}>Reset</button>
      </div>

      {/* Op buttons */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {OPS.map(op => (
          <button key={op.label} onClick={op.fn} disabled={busy}
            style={{ padding: '6px 13px', borderRadius: 8, border: `1px solid ${op.c}45`, background: op.c + '14', color: op.c, cursor: busy ? 'not-allowed' : 'pointer', fontSize: 11.5, fontWeight: 600, opacity: busy ? 0.5 : 1, transition: 'all .15s' }}>
            {op.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 10, fontSize: 10.5, color: T.t3, lineHeight: 1.6 }}>
        Unlike arrays, linked lists give <strong style={{ color: T.gn }}>O(1)</strong> head insert/delete but <strong style={{ color: T.or }}>O(n)</strong> random access — you must walk from the head. No contiguous memory, so no cache locality.
      </div>
    </div>
  );
}
