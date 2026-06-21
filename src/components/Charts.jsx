import { useEffect, useRef, useState } from 'react';
import { T } from '../theme.js';

/* ── Animated radial progress ring ── */
export function RadialRing({ value = 0, size = 132, stroke = 11, color = T.cy, track = T.s3, children, gradient = true }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let raf; const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 900, 1);
      setShown(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const id = `rg-${color.replace('#', '')}`;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {gradient && (
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={T.pu} />
            </linearGradient>
          </defs>
        )}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={gradient ? `url(#${id})` : color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (shown / 100) * circ}
          style={{ filter: `drop-shadow(0 0 6px ${color}55)` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

/* ── Sparkline ── */
export function Sparkline({ data = [], color = T.cy, w = 120, h = 36, fill = true }) {
  if (!data.length) data = [0, 0];
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const rng = max - min || 1;
  const pts = data.map((v, i) => [ (i / (data.length - 1 || 1)) * w, h - ((v - min) / rng) * (h - 4) - 2 ]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;
  const id = `sp-${color.replace('#', '')}`;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      {fill && <path d={area} fill={`url(#${id})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r={2.5} fill={color} />
    </svg>
  );
}

/* ── Radar / spider chart ── */
export function Radar({ axes = [], size = 260, color = T.cy }) {
  // axes: [{ label, value(0-1), color }]
  const cx = size / 2, cy = size / 2, r = size / 2 - 38;
  const n = axes.length;
  const pt = (i, rad) => {
    const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad];
  };
  const rings = [0.25, 0.5, 0.75, 1];
  const poly = axes.map((a, i) => pt(i, r * a.value).join(',')).join(' ');
  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', maxWidth: size, margin: '0 auto' }}>
      {rings.map((rg, i) => (
        <polygon key={i} points={axes.map((_, j) => pt(j, r * rg).join(',')).join(' ')} fill="none" stroke={T.bd} strokeWidth={0.8} opacity={0.6} />
      ))}
      {axes.map((_, i) => { const [x, y] = pt(i, r); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={T.bd} strokeWidth={0.6} opacity={0.5} />; })}
      <polygon points={poly} fill={color + '22'} stroke={color} strokeWidth={2} style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}>
        <animate attributeName="opacity" dur="0.8s" values="0;1" fill="freeze" />
      </polygon>
      {axes.map((a, i) => { const [x, y] = pt(i, r * a.value); return <circle key={i} cx={x} cy={y} r={3} fill={a.color || color} />; })}
      {axes.map((a, i) => {
        const [x, y] = pt(i, r + 18);
        return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={T.t2} fontSize={9.5}>{a.label}</text>;
      })}
    </svg>
  );
}

/* ── Contribution heatmap (GitHub-style) ── */
export function Heatmap({ days = [], color = T.gn, weeks = 18 }) {
  // days: array of {date: Date, count} ; we render last `weeks` weeks
  const today = new Date();
  const cells = [];
  const total = weeks * 7;
  const map = {};
  days.forEach(d => { map[new Date(d.date).toDateString()] = d.count; });
  for (let i = total - 1; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    cells.push({ key: d.toDateString(), count: map[d.toDateString()] || 0, isToday: d.toDateString() === today.toDateString() });
  }
  const lvl = (c) => c === 0 ? 0 : c < 2 ? 1 : c < 4 ? 2 : c < 7 ? 3 : 4;
  const shade = ['#1a1b22', color + '33', color + '66', color + 'aa', color];
  const cols = [];
  for (let w = 0; w < weeks; w++) cols.push(cells.slice(w * 7, w * 7 + 7));
  return (
    <div style={{ display: 'flex', gap: 3, overflowX: 'auto' }}>
      {cols.map((col, ci) => (
        <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {col.map((c) => (
            <div key={c.key} title={`${c.key}: ${c.count}`} style={{ width: 12, height: 12, borderRadius: 3, background: shade[lvl(c.count)], border: c.isToday ? `1px solid ${color}` : '1px solid transparent' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Horizontal labeled bar ── */
export function BarRow({ label, value, max = 100, color = T.cy, sub }) {
  const pct = Math.min(100, (value / (max || 1)) * 100);
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.style.width = pct + '%'; }, [pct]);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12.5, color: T.t1 }}>{label}</span>
        <span style={{ fontSize: 11.5, color: T.t3 }}>{sub ?? `${Math.round(pct)}%`}</span>
      </div>
      <div style={{ height: 7, background: T.s3, borderRadius: 4, overflow: 'hidden' }}>
        <div ref={ref} style={{ width: 0, height: '100%', background: `linear-gradient(90deg, ${color}, ${color}aa)`, borderRadius: 4, transition: 'width 1s cubic-bezier(.16,1,.3,1)', boxShadow: `0 0 8px ${color}50` }} />
      </div>
    </div>
  );
}
