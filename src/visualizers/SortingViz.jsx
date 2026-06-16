import { useState, useRef, useEffect } from 'react';
import { useSim } from '../hooks/useSim.js';
import { SimControls } from '../components/UI.jsx';
import { genBubble, genSelection, genInsertion, genMerge, genQuick, genHeapSort } from '../generators/index.js';
import { T } from '../theme.js';

const ALGOS = {
  bubble:    { name: 'Bubble Sort',    gen: genBubble,    tc: 'O(n²)',      sc: 'O(1)',      stable: true,  desc: 'Compare adjacent pairs and swap if out of order. Largest element bubbles to the end each pass.' },
  selection: { name: 'Selection Sort', gen: genSelection, tc: 'O(n²)',      sc: 'O(1)',      stable: false, desc: 'Find the minimum in the unsorted portion and place it at the front. Always O(n²) regardless of input.' },
  insertion: { name: 'Insertion Sort', gen: genInsertion, tc: 'O(n²)/O(n)', sc: 'O(1)',      stable: true,  desc: 'Build sorted array left-to-right by inserting each new element into its correct position. O(n) for nearly sorted.' },
  merge:     { name: 'Merge Sort',     gen: genMerge,     tc: 'O(n log n)', sc: 'O(n)',      stable: true,  desc: 'Divide array in half recursively, then merge sorted halves. Guaranteed O(n log n). Used in TimSort.' },
  quick:     { name: 'Quick Sort',     gen: genQuick,     tc: 'O(n log n)', sc: 'O(log n)',  stable: false, desc: 'Pick a pivot, partition elements smaller/larger, recurse. Avg O(n log n) but O(n²) worst case with bad pivots.' },
  heap:      { name: 'Heap Sort',      gen: genHeapSort,  tc: 'O(n log n)', sc: 'O(1)',      stable: false, desc: 'Build a max-heap in O(n), then extract max n times. In-place O(n log n). Poor cache performance.' },
};

const DEFAULT_ARR = [64, 34, 25, 12, 22, 11, 90, 45, 67, 33, 78, 56, 23, 89, 15];

export default function SortingViz({ color }) {
  const [algo, setAlgo]     = useState('bubble');
  const [arr, setArr]       = useState(DEFAULT_ARR);
  const [custom, setCustom] = useState('');
  const info                = ALGOS[algo];
  const sim                 = useSim(() => info.gen([...arr]), [algo, arr.join(',')]);
  const st                  = sim.state;
  const bars                = st?.arr ?? arr;
  const mx                  = Math.max(...bars, 1);

  const barColor = i => {
    if (st?.done || st?.sorted?.includes(i)) return T.gn;
    if (st?.sw?.includes(i))                 return T.pk;
    if (st?.hi?.includes(i))                 return T.ye;
    if (st?.rng && i >= st.rng[0] && i <= st.rng[1]) return T.pu;
    if (st?.placed === i)                    return T.gn;
    if (st?.piv === i)                       return T.or;
    if (st?.mi === i)                        return T.cy;
    return color;
  };

  const applyCustom = () => {
    const nums = custom.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n > 0 && n <= 200);
    if (nums.length >= 2) { setArr(nums.slice(0, 20)); setCustom(''); }
  };

  const shuffle = () => setArr(Array.from({ length: 16 }, () => Math.floor(Math.random() * 88) + 8));

  const stepMsg = () => {
    if (!st) return 'Press Play to start';
    if (st.done) return '✓ Sorted!';
    if (st.sw?.length) return `Swapping index ${st.sw[0]} ↔ ${st.sw[1]}  (${bars[st.sw[0]]} ↔ ${bars[st.sw[1]]})`;
    if (st.hi?.length === 2) return `Comparing index ${st.hi[0]} & ${st.hi[1]}  (${bars[st.hi[0]]} vs ${bars[st.hi[1]]})`;
    if (st.piv !== undefined) return `Pivot = ${bars[st.piv]} at index ${st.piv}`;
    if (st.rng) return `Merging range [${st.rng[0]}..${st.rng[1]}]`;
    return 'Running…';
  };

  return (
    <div>
      {/* Algorithm selector */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 12, flexWrap: 'wrap' }}>
        {Object.entries(ALGOS).map(([k, v]) => (
          <button key={k} onClick={() => setAlgo(k)}
            style={{ padding: '4px 11px', borderRadius: 20, border: `1px solid ${algo === k ? color : T.bd}`, background: algo === k ? color + '22' : 'transparent', color: algo === k ? color : T.t2, cursor: 'pointer', fontSize: 11, fontWeight: algo === k ? 700 : 400, transition: 'all .15s' }}>
            {v.name}
          </button>
        ))}
      </div>

      {/* Algorithm info */}
      <div style={{ padding: '9px 13px', borderRadius: 9, background: T.s2, border: `1px solid ${T.bd}`, marginBottom: 12, fontSize: 11 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
          <span>⏱ <strong style={{ color }}>{info.tc}</strong></span>
          <span>💾 <strong style={{ color: T.pu }}>{info.sc}</strong></span>
          <span style={{ color: info.stable ? T.gn : T.ye }}>{info.stable ? '✓ Stable' : '✗ Unstable'}</span>
        </div>
        <div style={{ color: T.t2 }}>{info.desc}</div>
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 200, padding: '0 2px', marginBottom: 6, background: T.s2, borderRadius: 10, border: `1px solid ${T.bd}` }}>
        {bars.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', paddingBottom: 4 }}>
            <div style={{ fontSize: 8, color: T.t3, marginBottom: 2, lineHeight: 1 }}>{v}</div>
            <div style={{
              width: '100%',
              height: `${(v / mx) * 170}px`,
              background: barColor(i),
              borderRadius: '2px 2px 0 0',
              transition: 'height .08s ease, background .1s ease',
              boxShadow: [T.gn, T.pk, color, T.cy].includes(barColor(i)) ? `0 0 6px ${barColor(i)}60` : 'none',
            }} />
          </div>
        ))}
      </div>

      {/* Step message */}
      <div style={{ padding: '7px 12px', borderRadius: 8, background: T.s2, border: `1px solid ${T.bd}`, fontSize: 11.5, color: st?.done ? T.gn : T.t1, marginBottom: 10, minHeight: 32, display: 'flex', alignItems: 'center' }}>
        {stepMsg()}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        {[[T.ye, 'Comparing'], [T.pk, 'Swapping'], [T.gn, 'Sorted'], [T.or, 'Pivot'], [T.pu, 'Merging/Range'], [T.cy, 'Minimum']].map(([c, l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} /><span style={{ color: T.t2 }}>{l}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <SimControls sim={sim} color={color} />

      {/* Custom array input */}
      <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyCustom()} placeholder="Custom: 5,3,8,1,9 (max 20 values)"
          style={{ flex: 1, minWidth: 180, padding: '5px 10px', borderRadius: 8, border: `1px solid ${T.bd}`, background: T.s2, color: T.t0, fontSize: 11.5, fontFamily: 'inherit', outline: 'none' }} />
        <button onClick={applyCustom} style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${T.cy}50`, background: T.cy + '18', color: T.cy, fontSize: 11, cursor: 'pointer' }}>Apply</button>
        <button onClick={shuffle} style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${T.bd}`, background: T.s2, color: T.t1, fontSize: 11, cursor: 'pointer' }}>↺ Shuffle</button>
        <button onClick={() => setArr(DEFAULT_ARR)} style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${T.bd}`, background: T.s2, color: T.t2, fontSize: 11, cursor: 'pointer' }}>Reset</button>
      </div>
    </div>
  );
}
