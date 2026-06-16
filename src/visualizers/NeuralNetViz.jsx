import { useEffect, useRef, useState } from 'react';
import { T } from '../theme.js';

const ARCHS = {
  mlp:    { name:'MLP (3-layer)', layers:[{label:'Input',n:4,x:70},{label:'Hidden 1',n:6,x:210},{label:'Hidden 2',n:6,x:350},{label:'Output',n:3,x:490}], desc:'Multi-Layer Perceptron: fully connected layers with ReLU activations. Used for tabular data classification.' },
  cnn:    { name:'CNN-like',      layers:[{label:'Conv 1',n:4,x:70},{label:'Conv 2',n:6,x:185},{label:'Pool',n:4,x:295},{label:'FC',n:5,x:405},{label:'Softmax',n:3,x:500}], desc:'Convolutional architecture. Conv layers extract spatial features; pooling reduces dimensionality; FC classifies.' },
  autoenc:{ name:'Autoencoder',   layers:[{label:'Input',n:8,x:70},{label:'Enc 1',n:5,x:175},{label:'Latent',n:2,x:280},{label:'Dec 1',n:5,x:385},{label:'Output',n:8,x:490}], desc:'Encoder compresses to latent space; decoder reconstructs. Used for anomaly detection, denoising, generation.' },
};

const NY = (li, ni, layers) => {
  const L = layers[li];
  const top = 150 - ((L.n - 1) / 2) * 36;
  return top + ni * 36;
};

export default function NeuralNetViz({ color }) {
  const cvs     = useRef(null);
  const anim    = useRef(null);
  const t       = useRef(0);
  const parts   = useRef([]);
  const lossHist= useRef([]);
  const epoch   = useRef(0);
  const [playing, setPlaying]  = useState(true);
  const [mode,    setMode]     = useState('forward');
  const [arch,    setArch]     = useState('mlp');
  const [lossArr, setLossArr]  = useState([]);
  const [curEpoch,setCurEpoch] = useState(0);

  useEffect(() => {
    const canvas = cvs.current;
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    canvas.width  = 560;
    canvas.height = 300;
    const layers  = ARCHS[arch].layers;

    const draw = () => {
      ctx.clearRect(0, 0, 560, 300);
      t.current += 0.018;

      // Simulate loss decay
      if (playing && Math.floor(t.current * 2) > epoch.current) {
        epoch.current++;
        const loss = Math.max(0.05, 2.4 * Math.exp(-epoch.current * 0.07) + (Math.random() - 0.5) * 0.06);
        lossHist.current.push(loss);
        if (lossHist.current.length > 60) lossHist.current.shift();
        setLossArr([...lossHist.current]);
        setCurEpoch(epoch.current);
      }

      // Draw weights (connections)
      for (let li = 0; li < layers.length - 1; li++) {
        for (let ni = 0; ni < layers[li].n; ni++) {
          for (let nj = 0; nj < layers[li + 1].n; nj++) {
            const w = Math.abs(Math.sin(t.current * 0.4 + ni * nj * 0.7)) * 0.35 + 0.04;
            ctx.beginPath();
            ctx.moveTo(layers[li].x, NY(li, ni, layers));
            ctx.lineTo(layers[li + 1].x, NY(li + 1, nj, layers));
            ctx.strokeStyle = mode === 'backward' ? `rgba(255,68,68,${w * 0.4})` : `rgba(100,150,255,${w * 0.45})`;
            ctx.lineWidth = w * 2;
            ctx.stroke();
          }
        }
      }

      // Emit particles
      if (playing && t.current % 0.09 < 0.02) {
        const fl = mode === 'backward' ? Math.floor(Math.random() * (layers.length - 1)) + 1 : Math.floor(Math.random() * (layers.length - 1));
        const tl = mode === 'backward' ? fl - 1 : fl + 1;
        if (tl >= 0 && tl < layers.length) {
          const ni = Math.floor(Math.random() * layers[fl].n);
          const nj = Math.floor(Math.random() * layers[tl].n);
          parts.current.push({
            x1: layers[fl].x, y1: NY(fl, ni, layers),
            x2: layers[tl].x, y2: NY(tl, nj, layers),
            tt: 0, speed: 0.016 + Math.random() * 0.01,
            col: mode === 'backward' ? T.rd : color,
          });
        }
      }

      // Draw particles
      parts.current = parts.current.filter(p => {
        p.tt += p.speed;
        if (p.tt > 1) return false;
        const ease = p.tt < 0.5 ? 2 * p.tt * p.tt : 1 - Math.pow(-2 * p.tt + 2, 2) / 2;
        const x = p.x1 + (p.x2 - p.x1) * ease;
        const y = p.y1 + (p.y2 - p.y1) * ease;
        ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = p.col + Math.round((1 - p.tt * 0.3) * 255).toString(16).padStart(2, '0');
        ctx.fill();
        return true;
      });

      // Draw nodes
      layers.forEach((layer, li) => {
        for (let ni = 0; ni < layer.n; ni++) {
          const x = layer.x, y = NY(li, ni, layers);
          const act = Math.max(0, Math.sin(t.current * 0.6 + li + ni * 1.5));
          const baseColor = li === 0 ? T.cy : li === layers.length - 1 ? T.gn : li === Math.floor(layers.length / 2) && arch === 'autoenc' ? T.pk : T.pu;
          const grd = ctx.createRadialGradient(x, y, 0, x, y, 13);
          grd.addColorStop(0, baseColor + 'ff');
          grd.addColorStop(1, baseColor + '33');
          ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2);
          ctx.fillStyle = grd; ctx.fill();
          ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2);
          ctx.strokeStyle = baseColor; ctx.lineWidth = 1.5; ctx.stroke();
          if (act > 0.7) { ctx.beginPath(); ctx.arc(x, y, 19, 0, Math.PI * 2); ctx.fillStyle = baseColor + '20'; ctx.fill(); }
        }
        ctx.fillStyle = T.t3; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
        const ly = NY(li, layers[li].n - 1, layers) + 22;
        ctx.fillText(layer.label, layer.x, ly);
        ctx.fillStyle = T.t3 + '80'; ctx.font = '8px system-ui';
        ctx.fillText(`n=${layer.n}`, layer.x, ly + 11);
      });

      anim.current = requestAnimationFrame(draw);
    };
    anim.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(anim.current);
  }, [playing, mode, arch, color]);

  // Loss mini-chart
  const LossChart = () => {
    if (lossArr.length < 2) return <div style={{ color: T.t3, fontSize: 11, textAlign: 'center', paddingTop: 24 }}>Training…</div>;
    const max = Math.max(...lossArr);
    const min = Math.min(...lossArr);
    const range = max - min || 0.01;
    const W = 120, H = 60;
    const pts = lossArr.map((v, i) => `${(i / (lossArr.length - 1)) * W},${H - ((v - min) / range) * (H - 4)}`).join(' ');
    return (
      <svg width={W} height={H} style={{ display: 'block' }}>
        <polyline points={pts} fill="none" stroke={T.cy} strokeWidth={1.5} />
        <line x1={0} y1={H} x2={W} y2={H} stroke={T.bd} strokeWidth={0.5} />
        <text x={0} y={10} fill={T.t3} fontSize={7}>loss={lossArr[lossArr.length - 1]?.toFixed(3)}</text>
        <text x={0} y={H - 2} fill={T.t3} fontSize={7}>ep={curEpoch}</text>
      </svg>
    );
  };

  return (
    <div>
      {/* Architecture selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.entries(ARCHS).map(([k, v]) => (
          <button key={k} onClick={() => { setArch(k); lossHist.current = []; epoch.current = 0; setLossArr([]); setCurEpoch(0); }}
            style={{ padding: '4px 11px', borderRadius: 20, border: `1px solid ${arch === k ? color : T.bd}`, background: arch === k ? color + '20' : 'transparent', color: arch === k ? color : T.t2, cursor: 'pointer', fontSize: 11 }}>
            {v.name}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['forward', 'backward'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ padding: '3px 10px', borderRadius: 14, border: `1px solid ${mode === m ? color : T.bd}`, background: mode === m ? color + '20' : 'transparent', color: mode === m ? color : T.t2, cursor: 'pointer', fontSize: 10.5 }}>
              {m === 'forward' ? '→ Forward' : '← Backprop'}
            </button>
          ))}
          <button onClick={() => setPlaying(p => !p)} style={{ padding: '3px 10px', borderRadius: 14, border: `1px solid ${T.bd}`, background: T.s2, color: T.t1, cursor: 'pointer', fontSize: 10.5 }}>{playing ? '⏸' : '▶'}</button>
        </div>
      </div>

      {/* Arch description */}
      <div style={{ padding: '7px 12px', background: T.s2, border: `1px solid ${T.bd}`, borderRadius: 8, fontSize: 11, color: T.t2, marginBottom: 10 }}>
        {ARCHS[arch].desc}
      </div>

      {/* Canvas + Loss side-by-side */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
        <canvas ref={cvs} style={{ flex: 1, display: 'block', borderRadius: 12, border: `1px solid ${T.bd}`, background: T.s1, maxWidth: '100%' }} />
        <div style={{ width: 130, padding: '10px', background: T.s2, borderRadius: 10, border: `1px solid ${T.bd}`, flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: T.t3, fontWeight: 700, marginBottom: 6, letterSpacing: 0.5 }}>LOSS CURVE</div>
          <LossChart />
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[[T.cy,'Input','Raw features'],[T.pu,'Hidden','Feature maps'],[T.pk,'Latent','Compressed'],[T.gn,'Output','Predictions']].map(([c,l,d]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: c, flexShrink: 0 }} />
                <div><div style={{ fontSize: 9, color: c, fontWeight: 700 }}>{l}</div><div style={{ fontSize: 8, color: T.t3 }}>{d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Layer info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px,1fr))', gap: 5 }}>
        {ARCHS[arch].layers.map((l, i) => (
          <div key={i} style={{ padding: '6px 9px', borderRadius: 8, background: T.s2, border: `1px solid ${T.bd}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: i === 0 ? T.cy : i === ARCHS[arch].layers.length - 1 ? T.gn : T.pu }}>{l.label}</div>
            <div style={{ fontSize: 9, color: T.t3 }}>{l.n} neurons</div>
          </div>
        ))}
      </div>
    </div>
  );
}
