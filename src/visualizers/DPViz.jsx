import { useState } from 'react';
import { useSim } from '../hooks/useSim.js';
import { SimControls } from '../components/UI.jsx';
import { genLCS } from '../generators/index.js';
import { T } from '../theme.js';

// ── Edit Distance generator ──────────────────────────────────────────────────
function* genEditDistance(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  yield { dp: dp.map(r => [...r]), i: 0, j: 0, match: false, done: false };
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = s1[i - 1] === s2[j - 1];
      dp[i][j] = match ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      yield { dp: dp.map(r => [...r]), i, j, match, done: false };
    }
  }
  yield { dp: dp.map(r => [...r]), i: m, j: n, match: false, done: true, result: dp[m][n] };
}

// ── Coin Change generator ────────────────────────────────────────────────────
function* genCoinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  yield { dp: [...dp], i: 0, coin: null, done: false };
  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      if (dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
        yield { dp: [...dp], i, coin, done: false };
      }
    }
  }
  yield { dp: [...dp], i: amount, coin: null, done: true, result: dp[amount] === Infinity ? -1 : dp[amount] };
}

// ── 0/1 Knapsack generator ───────────────────────────────────────────────────
function* genKnapsack(weights, values, cap) {
  const n  = weights.length;
  const dp = Array.from({ length: n + 1 }, () => Array(cap + 1).fill(0));
  yield { dp: dp.map(r => [...r]), i: 0, w: 0, done: false };
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= cap; w++) {
      dp[i][w] = weights[i-1] <= w
        ? Math.max(dp[i-1][w], dp[i-1][w - weights[i-1]] + values[i-1])
        : dp[i-1][w];
      yield { dp: dp.map(r => [...r]), i, w, done: false };
    }
  }
  yield { dp: dp.map(r => [...r]), i: n, w: cap, done: true, result: dp[n][cap] };
}

const PROBLEMS = {
  lcs:      { label: 'LCS',         desc: 'Longest Common Subsequence. dp[i][j] = if chars match: dp[i-1][j-1]+1, else max(dp[i-1][j], dp[i][j-1]). O(mn) time/space.' },
  edit:     { label: 'Edit Distance',desc: 'Minimum insertions/deletions/substitutions to convert s1→s2. dp[i][j] = match? dp[i-1][j-1] : 1+min(insert,delete,replace). O(mn).' },
  coin:     { label: 'Coin Change',  desc: 'Min coins to make amount. Unbounded knapsack variant. dp[i] = min(dp[i], dp[i-coin]+1). O(amount × coins).' },
  knapsack: { label: '0/1 Knapsack', desc: 'Max value with capacity constraint. dp[i][w] = max(exclude item i, include item i). O(n×W) pseudo-polynomial.' },
};

export default function DPViz({ color }) {
  const [prob, setProb] = useState('lcs');

  const S1_LCS = 'ABCBDAB', S2_LCS = 'BDCAB';
  const S1_ED  = 'SATURDAY', S2_ED = 'SUNDAY';
  const COINS  = [1, 3, 4], AMOUNT = 12;
  const KS_W   = [2, 3, 4, 5], KS_V = [3, 4, 5, 7], KS_CAP = 8;

  const simLCS  = useSim(() => genLCS(S1_LCS, S2_LCS), []);
  const simEdit  = useSim(() => genEditDistance(S1_ED, S2_ED), []);
  const simCoin  = useSim(() => genCoinChange(COINS, AMOUNT), []);
  const simKnap  = useSim(() => genKnapsack(KS_W, KS_V, KS_CAP), []);

  const simMap = { lcs: simLCS, edit: simEdit, coin: simCoin, knapsack: simKnap };
  const sim = simMap[prob];
  const st  = sim.state;

  const renderGrid = (dp, rowLabels, colLabels, hiI, hiJ, matchI, matchJ) => (
    <div style={{ overflowX: 'auto', marginBottom: 10 }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
        <thead>
          <tr>
            <td style={{ padding: '3px 6px', color: T.t3 }}>dp</td>
            {colLabels.map((c, j) => <td key={j} style={{ padding: '3px 6px', color: T.gn, fontWeight: 700, textAlign: 'center' }}>{c}</td>)}
          </tr>
        </thead>
        <tbody>
          {dp.map((row, i) => (
            <tr key={i}>
              <td style={{ padding: '3px 6px', color, fontWeight: 700 }}>{rowLabels[i]}</td>
              {row.map((v, j) => {
                const isCur   = hiI === i && hiJ === j;
                const isMatch = isCur && matchI === i && matchJ === j;
                const isFin   = v > 0 && typeof v === 'number' && v !== Infinity;
                return (
                  <td key={j} style={{ padding: '3px 5px', textAlign: 'center', width: 28, height: 26, fontSize: 11, borderRadius: 4, border: `1px solid ${T.bd}`,
                    background: isCur ? (isMatch ? T.gn + '40' : T.ye + '30') : isFin ? color + '14' : 'transparent',
                    color: isCur ? (isMatch ? T.gn : T.ye) : isFin ? color : T.t3,
                    fontWeight: isCur || isFin ? 700 : 400, transition: 'all .18s',
                    boxShadow: isCur ? `0 0 0 2px ${isMatch ? T.gn : T.ye}60` : 'none',
                  }}>
                    {v === Infinity ? '∞' : v}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    if (prob === 'lcs') {
      const dp = st?.dp ?? Array.from({ length: S1_LCS.length + 1 }, () => Array(S2_LCS.length + 1).fill(0));
      return (
        <>
          <div style={{ display: 'flex', gap: 16, marginBottom: 10, fontSize: 12, flexWrap: 'wrap' }}>
            <span>s1: <code style={{ color, fontFamily: 'var(--font-mono)' }}>"{S1_LCS}"</code></span>
            <span>s2: <code style={{ color: T.gn, fontFamily: 'var(--font-mono)' }}>"{S2_LCS}"</code></span>
            {st?.done && <span style={{ color: T.gn }}>✓ LCS length = <strong>{st.lcs}</strong></span>}
          </div>
          {renderGrid(dp, ['""', ...S1_LCS.split('')], ['""', ...S2_LCS.split('')], st?.i, st?.j, st?.match ? st?.i : -1, st?.match ? st?.j : -1)}
        </>
      );
    }
    if (prob === 'edit') {
      const dp = st?.dp ?? Array.from({ length: S1_ED.length + 1 }, (_, i) => Array.from({ length: S2_ED.length + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
      return (
        <>
          <div style={{ display: 'flex', gap: 16, marginBottom: 10, fontSize: 12, flexWrap: 'wrap' }}>
            <span>s1: <code style={{ color, fontFamily: 'var(--font-mono)' }}>"{S1_ED}"</code></span>
            <span>s2: <code style={{ color: T.gn, fontFamily: 'var(--font-mono)' }}>"{S2_ED}"</code></span>
            {st?.done && <span style={{ color: T.gn }}>✓ Edit distance = <strong>{st.result}</strong></span>}
          </div>
          {renderGrid(dp, ['""', ...S1_ED.split('')], ['""', ...S2_ED.split('')], st?.i, st?.j, st?.match ? st?.i : -1, st?.match ? st?.j : -1)}
        </>
      );
    }
    if (prob === 'coin') {
      const dp = st?.dp ?? Array(AMOUNT + 1).fill(Infinity);
      return (
        <>
          <div style={{ fontSize: 12, marginBottom: 10, color: T.t2 }}>
            Coins: <code style={{ color, fontFamily: 'var(--font-mono)' }}>[{COINS.join(', ')}]</code> · Amount: <strong style={{ color: T.gn }}>{AMOUNT}</strong>
            {st?.done && <span style={{ color: T.gn, marginLeft: 12 }}>✓ Min coins = <strong>{st.result}</strong></span>}
          </div>
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: 8 }}>
            {dp.map((v, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ fontSize: 9, color: T.t3 }}>[{i}]</div>
                <div style={{ width: 32, height: 32, borderRadius: 7, background: st?.i === i ? color + '35' : v !== Infinity && v > 0 ? color + '18' : T.s2, border: `1px solid ${st?.i === i ? color : T.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 700, color: st?.i === i ? color : v === Infinity ? T.t3 : T.t1, transition: 'all .2s' }}>
                  {v === Infinity ? '∞' : v}
                </div>
                {i % (COINS[0]) === 0 && <div style={{ fontSize: 8, color: T.t3 }}></div>}
              </div>
            ))}
          </div>
          {st?.coin && <div style={{ fontSize: 11, color: T.t2, padding: '5px 10px', background: T.s2, borderRadius: 7, border: `1px solid ${T.bd}` }}>Using coin = <strong style={{ color }}>{st.coin}</strong></div>}
        </>
      );
    }
    if (prob === 'knapsack') {
      const dp   = st?.dp ?? Array.from({ length: KS_W.length + 1 }, () => Array(KS_CAP + 1).fill(0));
      const rowL = ['—', ...KS_W.map((w, i) => `item${i+1}(w=${w},v=${KS_V[i]})`)];
      const colL = Array.from({ length: KS_CAP + 1 }, (_, i) => i);
      return (
        <>
          <div style={{ fontSize: 11, marginBottom: 8, color: T.t2 }}>
            Items: {KS_W.map((w, i) => <span key={i} style={{ marginRight: 8 }}><span style={{ color }}>w={w}</span>/<span style={{ color: T.gn }}>v={KS_V[i]}</span></span>)} · Capacity: <strong style={{ color: T.or }}>{KS_CAP}</strong>
            {st?.done && <span style={{ color: T.gn, marginLeft: 8 }}>✓ Max value = <strong>{st.result}</strong></span>}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', fontSize: 10 }}>
              <thead><tr><td style={{ padding: '2px 5px', color: T.t3, fontSize: 9 }}>item\cap</td>{colL.map(c => <td key={c} style={{ padding: '2px 5px', color: T.cy, textAlign: 'center', fontSize: 9 }}>{c}</td>)}</tr></thead>
              <tbody>{dp.map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: '2px 5px', color, fontSize: 9, whiteSpace: 'nowrap' }}>{rowL[i]}</td>
                  {row.map((v, j) => {
                    const isCur = st?.i === i && st?.w === j;
                    return <td key={j} style={{ padding: '2px 4px', width: 24, height: 22, textAlign: 'center', border: `1px solid ${T.bd}`, borderRadius: 3, background: isCur ? color + '35' : v > 0 ? color + '12' : 'transparent', color: isCur ? color : v > 0 ? T.t1 : T.t3, fontWeight: isCur ? 700 : 400, fontSize: 10, transition: 'all .15s' }}>{v}</td>;
                  })}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      );
    }
  };

  return (
    <div>
      {/* Problem selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {Object.entries(PROBLEMS).map(([k, v]) => (
          <button key={k} onClick={() => setProb(k)}
            style={{ padding: '4px 12px', borderRadius: 20, border: `1px solid ${prob === k ? color : T.bd}`, background: prob === k ? color + '20' : 'transparent', color: prob === k ? color : T.t2, cursor: 'pointer', fontSize: 11, fontWeight: prob === k ? 700 : 400 }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <div style={{ padding: '8px 12px', background: T.s2, borderRadius: 8, border: `1px solid ${T.bd}`, fontSize: 11, color: T.t2, marginBottom: 10 }}>
        {PROBLEMS[prob].desc}
      </div>

      {renderContent()}

      <SimControls sim={sim} color={color} codeKey={prob} />
    </div>
  );
}
