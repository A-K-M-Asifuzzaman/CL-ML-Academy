import { useState, useMemo } from 'react';
import { T } from '../theme.js';

const SIZE = 8;
const hashFn = (str, size = SIZE) => {
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) % size;
  return ((h % size) + size) % size;
};

const SEED = ['cat', 'dog', 'bird'];

export default function HashViz({ color }) {
  const [inp, setInp] = useState('');
  const [buckets, setBuckets] = useState(() => {
    const b = Array.from({ length: SIZE }, () => []);
    SEED.forEach(k => b[hashFn(k)].push(k));
    return b;
  });
  const [flash, setFlash] = useState(null);
  const [trace, setTrace] = useState(null);
  const [mode, setMode] = useState('insert');

  const stats = useMemo(() => {
    const count = buckets.reduce((s, b) => s + b.length, 0);
    const used = buckets.filter(b => b.length > 0).length;
    const collisions = buckets.reduce((s, b) => s + Math.max(0, b.length - 1), 0);
    const maxChain = Math.max(0, ...buckets.map(b => b.length));
    return { count, used, collisions, maxChain, load: count / SIZE };
  }, [buckets]);

  const computeTrace = (key) => {
    let h = 0; const steps = [];
    for (const c of key) { h = (h * 31 + c.charCodeAt(0)) % SIZE; steps.push({ c, code: c.charCodeAt(0), h }); }
    return { key, idx: ((h % SIZE) + SIZE) % SIZE, steps };
  };

  const doInsert = () => {
    const key = inp.trim(); if (!key) return;
    const tr = computeTrace(key); const idx = tr.idx;
    const collided = buckets[idx].length > 0 && !buckets[idx].includes(key);
    setTrace({ ...tr, collided, found: null });
    setFlash(idx); setTimeout(() => setFlash(null), 900);
    setBuckets(prev => { const nb = prev.map(b => [...b]); if (!nb[idx].includes(key)) nb[idx].push(key); return nb; });
    setInp('');
  };

  const doFind = () => {
    const key = inp.trim(); if (!key) return;
    const tr = computeTrace(key); const idx = tr.idx;
    const found = buckets[idx].includes(key);
    setTrace({ ...tr, collided: false, found });
    setFlash(idx); setTimeout(() => setFlash(null), 1100);
  };

  const run = () => (mode === 'insert' ? doInsert() : doFind());
  const clear = () => { setBuckets(Array.from({ length: SIZE }, () => [])); setTrace(null); setFlash(null); };
  const seed = () => { const b = Array.from({ length: SIZE }, () => []); ['cat','dog','bird','fish','ant','bee','owl','fox','elk','cod'].forEach(k => b[hashFn(k)].push(k)); setBuckets(b); setTrace(null); };

  const loadColor = stats.load > 0.75 ? T.rd : stats.load > 0.5 ? T.or : T.gn;

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'Entries', value: stats.count, c: color },
          { label: 'Load α', value: stats.load.toFixed(2), c: loadColor },
          { label: 'Collisions', value: stats.collisions, c: stats.collisions ? T.or : T.gn },
          { label: 'Longest chain', value: stats.maxChain, c: stats.maxChain > 2 ? T.rd : T.t1 },
        ].map(s => (
          <div key={s.label} className="glass-2" style={{ flex: 1, minWidth: 78, padding: '8px 10px', borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.c, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
            <div style={{ fontSize: 9.5, color: T.t3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Load factor bar */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: T.t3, marginBottom: 3 }}>
          <span>load factor α = entries / buckets</span>
          <span style={{ color: loadColor }}>{stats.load > 0.75 ? 'resize recommended →' : 'healthy'}</span>
        </div>
        <div style={{ height: 6, background: T.s3, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.min(stats.load, 1) * 100}%`, background: `linear-gradient(90deg, ${loadColor}, ${loadColor}aa)`, borderRadius: 3, transition: 'width .4s ease, background .3s', boxShadow: `0 0 8px ${loadColor}80` }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: `1px solid ${T.bd}` }}>
          {['insert', 'find'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ padding: '6px 13px', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                background: mode === m ? color + '22' : 'transparent', color: mode === m ? color : T.t3 }}>{m}</button>
          ))}
        </div>
        <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && run()}
          placeholder={mode === 'insert' ? 'key to insert…' : 'key to search…'}
          style={{ flex: 1, minWidth: 130, padding: '6px 11px', borderRadius: 8, border: `1px solid ${T.bd}`, background: T.s2, color: T.t0, fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
        <button onClick={run} style={{ padding: '6px 16px', borderRadius: 8, background: color, border: 'none', color: T.bg, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>{mode === 'insert' ? 'Insert' : 'Find'}</button>
        <button onClick={seed} style={{ padding: '6px 11px', borderRadius: 8, border: `1px solid ${T.bd}`, background: T.s2, color: T.t2, cursor: 'pointer', fontSize: 11 }}>Seed</button>
        <button onClick={clear} style={{ padding: '6px 11px', borderRadius: 8, border: `1px solid ${T.bd}`, background: 'transparent', color: T.t3, cursor: 'pointer', fontSize: 11 }}>Clear</button>
      </div>

      {/* Hash trace */}
      {trace && (
        <div className="glass-2" style={{ padding: '8px 12px', borderRadius: 9, marginBottom: 12, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
          <div style={{ color: T.t2, marginBottom: 4 }}>
            h(<span style={{ color }}>"{trace.key}"</span>) = {trace.steps.map((s, i) => (
              <span key={i}>{i > 0 && ' → '}<span title={`'${s.c}' = ${s.code}`} style={{ color: T.t1 }}>{s.h}</span></span>
            ))} <span style={{ color: T.t3 }}>(×31 + charCode) mod {SIZE}</span>
          </div>
          <div>
            → bucket <span style={{ color, fontWeight: 700 }}>[{trace.idx}]</span>
            {trace.found === true && <span style={{ color: T.gn }}> · ✓ FOUND</span>}
            {trace.found === false && <span style={{ color: T.rd }}> · ✗ not present</span>}
            {trace.collided && <span style={{ color: T.or }}> · ⚠ collision → chained</span>}
          </div>
        </div>
      )}

      {/* Buckets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {buckets.map((bkt, i) => {
          const isFlash = flash === i;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: isFlash ? color : T.t3, flexShrink: 0, fontWeight: isFlash ? 700 : 400, transition: 'color .2s' }}>[{i}]</div>
              <div style={{ flex: 1, padding: '6px 10px', background: isFlash ? color + '22' : T.s2, borderRadius: 8, border: `1px solid ${isFlash ? color : bkt.length > 1 ? T.or + '40' : T.bd}`, minHeight: 34, display: 'flex', alignItems: 'center', gap: 6, transition: 'all .2s', boxShadow: isFlash ? `0 0 14px ${color}50` : 'none', flexWrap: 'wrap' }}>
                {!bkt.length
                  ? <span style={{ color: T.t3, fontSize: 11 }}>∅ empty</span>
                  : bkt.map((k, j) => (
                    <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ padding: '2px 9px', borderRadius: 12, background: color + '22', color, border: `1px solid ${color}45`, fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{k}</span>
                      {j < bkt.length - 1 && <span style={{ color: T.or, fontSize: 11 }}>→</span>}
                    </span>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 10, fontSize: 10.5, color: T.t3, lineHeight: 1.6 }}>
        Separate chaining: collisions append to a linked list in the same bucket. Average lookup is <strong style={{ color: T.gn }}>O(1 + α)</strong>; once α &gt; 0.75 most implementations <strong style={{ color: T.or }}>resize &amp; rehash</strong> to keep chains short.
      </div>
    </div>
  );
}
