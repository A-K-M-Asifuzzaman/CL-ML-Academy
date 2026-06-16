import { useState, useMemo } from 'react';
import { T } from '../theme.js';

const SENTENCES = {
  bank:    { tokens: ['The', 'bank', 'can', 'guarantee', 'deposits', 'from', 'the', 'river'], info: '"bank" can mean financial institution or river bank — attention resolves this by context.' },
  pronoun: { tokens: ['The', 'animal', 'didn\'t', 'cross', 'the', 'street', 'because', 'it', 'was', 'tired'], info: '"it" refers to "animal" — attention aligns "it" with "animal" with high weight.' },
  code:    { tokens: ['function', 'add', '(', 'a', ',', 'b', ')', '{', 'return', 'a+b', '}'], info: 'Code attention: "return" attends to "a+b"; braces attend to "function".' },
};

const softmax = (arr, T_) => {
  const scaled = arr.map(v => v / T_);
  const max    = Math.max(...scaled);
  const exps   = scaled.map(v => Math.exp(v - max));
  const sum    = exps.reduce((a, b) => a + b, 0);
  return exps.map(v => v / sum);
};

const syntheticAttention = (i, j, n, seed) => {
  const base = Math.abs(Math.sin((i + 1) * (j + 1) * 0.61 + seed * 0.9));
  const diag = i === j ? 0.5 : 0;
  const local = Math.exp(-Math.abs(i - j) * 0.4) * 0.3;
  return base + diag + local;
};

export default function AttentionViz({ color }) {
  const [sentence, setSentence] = useState('bank');
  const [selRow,   setSelRow]   = useState(1);  // query token index
  const [temp,     setTemp]     = useState(1.0);
  const [view,     setView]     = useState('heatmap'); // heatmap | lines

  const tokens = SENTENCES[sentence].tokens;
  const n      = tokens.length;

  const matrix = useMemo(() => {
    return Array.from({ length: n }, (_, i) => {
      const raw = Array.from({ length: n }, (_, j) => syntheticAttention(i, j, n, sentence.charCodeAt(0)));
      return softmax(raw, temp);
    });
  }, [n, temp, sentence]);

  const selRow_ = Math.min(selRow, n - 1);
  const weights = matrix[selRow_];

  const hexAlpha = v => Math.round(v * 255).toString(16).padStart(2, '0');

  const CELL = Math.min(42, Math.floor(480 / n));

  return (
    <div>
      {/* Sentence selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: T.t2 }}>Sentence:</span>
        {Object.keys(SENTENCES).map(k => (
          <button key={k} onClick={() => { setSentence(k); setSelRow(k === 'bank' ? 1 : k === 'pronoun' ? 7 : 0); }} style={{ padding: '3px 10px', borderRadius: 14, border: `1px solid ${sentence === k ? color : T.bd}`, background: sentence === k ? color + '20' : 'transparent', color: sentence === k ? color : T.t2, cursor: 'pointer', fontSize: 10.5 }}>
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: T.t2 }}>View:</span>
          {[['heatmap','⊞ Matrix'],['lines','↔ Lines']].map(([v,l]) => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '3px 9px', borderRadius: 10, border: `1px solid ${view === v ? T.cy : T.bd}`, background: view === v ? T.cy + '18' : 'transparent', color: view === v ? T.cy : T.t2, cursor: 'pointer', fontSize: 10.5 }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Context info */}
      <div style={{ padding: '7px 12px', background: T.s2, borderRadius: 8, border: `1px solid ${T.bd}`, fontSize: 11, color: T.t2, marginBottom: 12 }}>
        {SENTENCES[sentence].info}
      </div>

      {/* Temperature slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: T.t2, whiteSpace: 'nowrap' }}>Temperature: <strong style={{ color }}>{temp.toFixed(1)}</strong></span>
        <input type="range" min="0.1" max="3" step="0.1" value={temp} onChange={e => setTemp(+e.target.value)} style={{ flex: 1, accentColor: color }} />
        <div style={{ fontSize: 10, color: T.t3, whiteSpace: 'nowrap' }}>{temp <= 0.5 ? '🔥 Sharp' : temp >= 2 ? '🌊 Flat' : '≈ Normal'}</div>
      </div>

      {view === 'heatmap' ? (
        /* Full attention matrix heatmap */
        <div style={{ overflowX: 'auto', marginBottom: 12 }}>
          <div style={{ display: 'inline-block', border: `1px solid ${T.bd}`, borderRadius: 10, overflow: 'hidden', background: T.s1 }}>
            {/* Header row */}
            <div style={{ display: 'flex' }}>
              <div style={{ width: CELL, height: CELL, flexShrink: 0 }} />
              {tokens.map((tok, j) => (
                <div key={j} style={{ width: CELL, height: CELL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.max(7, CELL / 5.5), color: T.t3, fontWeight: 600, flexShrink: 0, borderLeft: `1px solid ${T.bd}20`, transform: 'rotate(-20deg)', overflow: 'visible' }}>{tok}</div>
              ))}
            </div>
            {/* Rows */}
            {matrix.map((row, i) => (
              <div key={i} style={{ display: 'flex', cursor: 'pointer' }} onClick={() => setSelRow(i)}>
                <div style={{ width: CELL, height: CELL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.max(7, CELL / 5.5), color: i === selRow_ ? color : T.t2, fontWeight: i === selRow_ ? 700 : 400, flexShrink: 0, borderRight: `1px solid ${T.bd}20`, background: i === selRow_ ? color + '12' : 'transparent' }}>{tokens[i]}</div>
                {row.map((w, j) => (
                  <div key={j} title={`"${tokens[i]}" → "${tokens[j]}": ${(w * 100).toFixed(1)}%`}
                    style={{ width: CELL, height: CELL, background: color + hexAlpha(w * 0.9), borderLeft: `1px solid ${T.bg}30`, flexShrink: 0, transition: 'background .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, color: w > 0.3 ? T.bg : 'transparent' }}>
                    {w > 0.2 ? (w * 100).toFixed(0) : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: T.t3, marginTop: 6 }}>Click a row to select query token. Darker = higher attention weight.</div>
        </div>
      ) : (
        /* Lines view */
        <div style={{ background: T.s1, borderRadius: 12, border: `1px solid ${T.bd}`, marginBottom: 12, padding: 8 }}>
          <div style={{ fontSize: 10, color: T.t3, marginBottom: 6 }}>Query: <strong style={{ color }}>{tokens[selRow_]}</strong> — click tokens below to change query</div>
          <svg width="100%" viewBox={`0 0 ${Math.max(560, n * 62)} 220`} style={{ display: 'block' }}>
            {weights.map((w, j) => (
              <line key={j} x1={selRow_ * 60 + 34} y1={50} x2={j * 60 + 34} y2={170}
                stroke={color} strokeWidth={Math.max(0.3, w * 7)} opacity={Math.max(0.04, w * 0.95)} strokeLinecap="round" />
            ))}
            {tokens.map((tok, i) => {
              const isSel = i === selRow_;
              return (
                <g key={i} onClick={() => setSelRow(i)} style={{ cursor: 'pointer' }}>
                  <rect x={i * 60} y={20} width={68} height={30} rx={7} fill={isSel ? color + '40' : T.s2} stroke={isSel ? color : T.bd} strokeWidth={isSel ? 2 : 1} />
                  <text x={i * 60 + 34} y={40} textAnchor="middle" fill={isSel ? color : T.t1} fontSize={10} fontWeight={isSel ? 700 : 400}>{tok}</text>
                </g>
              );
            })}
            {tokens.map((tok, j) => {
              const w = weights[j]; const alpha = hexAlpha(w);
              return (
                <g key={j}>
                  <rect x={j * 60} y={150} width={68} height={30} rx={7} fill={color + alpha} stroke={color} strokeWidth={Math.max(0.5, w * 3)} />
                  <text x={j * 60 + 34} y={170} textAnchor="middle" fill={T.bg} fontSize={10} fontWeight={700}>{tok}</text>
                  <text x={j * 60 + 34} y={194} textAnchor="middle" fill={T.t3} fontSize={8}>{(w * 100).toFixed(0)}%</text>
                </g>
              );
            })}
            <text x={0} y={15}  fill={T.t3} fontSize={8}>Query (Q)</text>
            <text x={0} y={148} fill={T.t3} fontSize={8}>Keys (K) → attention weights</text>
          </svg>
        </div>
      )}

      {/* Selected row detail */}
      <div style={{ padding: '8px 12px', background: T.s2, borderRadius: 9, border: `1px solid ${T.bd}`, fontSize: 11 }}>
        <div style={{ color: T.t3, fontSize: 10, marginBottom: 4 }}>Query: <strong style={{ color }}>{tokens[selRow_]}</strong> attends to:</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {[...weights.map((w, j) => ({ j, w }))].sort((a, b) => b.w - a.w).map(({ j, w }) => (
            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 8, background: color + hexAlpha(w * 0.7), fontSize: 10.5 }}>
              <span style={{ color: T.t0, fontWeight: 600 }}>{tokens[j]}</span>
              <span style={{ color: T.t3, fontSize: 9 }}>{(w * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
