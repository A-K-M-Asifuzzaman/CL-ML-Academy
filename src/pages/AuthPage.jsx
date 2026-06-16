import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth, AVATARS } from '../context/AuthContext.jsx';
import { T } from '../theme.js';

export default function AuthPage() {
  const [tab, setTab]         = useState('login');
  const [form, setForm]       = useState({ username: '', email: '', password: '', avatar: AVATARS[0] });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, loginWithGoogle, loginWithGitHub, isConfigured } = useAuth();
  const navigate              = useNavigate();
  const cardRef               = useRef(null);
  const canvasRef             = useRef(null);
  const animRef               = useRef(null);

  // Particle canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const pts = Array.from({ length: 70 }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.4 + 0.4 }));
    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = T.cy + '60'; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 110) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = T.cy + Math.round((1 - d / 110) * 38).toString(16).padStart(2, '0'); ctx.lineWidth = 0.5; ctx.stroke(); }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  useEffect(() => {
    if (cardRef.current) gsap.fromTo(cardRef.current, { y: 36, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    if (cardRef.current) gsap.fromTo(cardRef.current, { x: tab === 'login' ? -16 : 16, opacity: 0.5 }, { x: 0, opacity: 1, duration: 0.28, ease: 'power2.out' });
    setError('');
  }, [tab]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    const res = tab === 'login'
      ? await login({ email: form.email, password: form.password })
      : await register({ username: form.username, email: form.email, password: form.password, avatar: form.avatar });
    setLoading(false);
    if (res.error) { setError(res.error); shake(); }
    else navigate('/');
  };

  const handleOAuth = async (fn) => {
    setError(''); setLoading(true);
    const res = await fn();
    setLoading(false);
    if (res?.error) { setError(res.error); shake(); }
    else navigate('/');
  };

  const shake = () => {
    if (cardRef.current) gsap.to(cardRef.current, { x: -9, duration: 0.07, yoyo: true, repeat: 5, ease: 'power1.inOut', onComplete: () => gsap.set(cardRef.current, { x: 0 }) });
  };

  const inp = {
    width: '100%', padding: '11px 14px', borderRadius: 10, border: `1px solid ${T.bd}`,
    background: T.s2, color: T.t0, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  };
  const focus = e => { e.currentTarget.style.borderColor = T.cy + '80'; e.currentTarget.style.boxShadow = `0 0 0 3px ${T.cy}18`; };
  const blur  = e => { e.currentTarget.style.borderColor = T.bd; e.currentTarget.style.boxShadow = 'none'; };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.bg, overflow: 'hidden', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${T.cy}07 0%, transparent 70%)`, zIndex: 0, pointerEvents: 'none' }} />

      <div ref={cardRef} style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 430, margin: '24px 16px', background: T.s1, border: `1px solid ${T.cy}20`, borderRadius: 22, padding: '36px 32px', boxShadow: `0 40px 80px rgba(0,0,0,.65), 0 0 0 1px ${T.cy}12, inset 0 1px 0 ${T.cy}15` }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{ width: 58, height: 58, borderRadius: 18, background: `linear-gradient(135deg, ${T.cy}, ${T.pu})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 12px', boxShadow: `0 0 28px ${T.cy}45` }}>🧠</div>
          <div style={{ fontSize: 22, fontWeight: 900, background: `linear-gradient(90deg, ${T.cy}, ${T.gn})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -0.5 }}>CS & ML Academy</div>
          <div style={{ fontSize: 12, color: T.t3, marginTop: 3 }}>Your personalized CS & ML journey</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: T.s2, borderRadius: 12, padding: 4, marginBottom: 24, border: `1px solid ${T.bd}` }}>
          {[['login', '→ Sign In'], ['register', '✦ Create Account']].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '8px 0', borderRadius: 9, border: 'none', background: tab === t ? T.cy + '22' : 'transparent', color: tab === t ? T.cy : T.t3, fontWeight: tab === t ? 700 : 400, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s', boxShadow: tab === t ? `inset 0 0 0 1px ${T.cy}45` : 'none' }}>{label}</button>
          ))}
        </div>

        {/* OAuth buttons (only shown when Firebase is configured) */}
        {isConfigured && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {[
              { label: 'Google', icon: '🌐', fn: loginWithGoogle, color: '#4285F4' },
              { label: 'GitHub', icon: '⚙️', fn: loginWithGitHub, color: '#6e5494' },
            ].map(({ label, icon, fn, color }) => (
              <button key={label} onClick={() => handleOAuth(fn)} disabled={loading} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px 0', borderRadius: 10, border: `1px solid ${T.bd}`, background: T.s2, color: T.t1, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = color + '15'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.bd; e.currentTarget.style.background = T.s2; }}>
                <span style={{ fontSize: 16 }}>{icon}</span> {label}
              </button>
            ))}
          </div>
        )}

        {isConfigured && <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}><div style={{ flex: 1, height: 1, background: T.bd }} /><span style={{ fontSize: 11, color: T.t3 }}>or with email</span><div style={{ flex: 1, height: 1, background: T.bd }} /></div>}

        {/* Demo mode notice */}
        {!isConfigured && (
          <div style={{ padding: '8px 12px', borderRadius: 9, background: T.or + '15', border: `1px solid ${T.or}35`, color: T.or, fontSize: 11, marginBottom: 16 }}>
            ⚠️ Demo mode — Firebase not configured. Add your credentials to <code style={{ background: T.s2, padding: '1px 4px', borderRadius: 4 }}>.env</code> to enable Google/GitHub login.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {tab === 'register' && (
            <>
              <div>
                <label style={{ fontSize: 10.5, color: T.t3, fontWeight: 700, marginBottom: 5, display: 'block', letterSpacing: 0.8 }}>USERNAME</label>
                <input value={form.username} onChange={set('username')} placeholder="your_handle" style={inp} onFocus={focus} onBlur={blur} required />
              </div>
              <div>
                <label style={{ fontSize: 10.5, color: T.t3, fontWeight: 700, marginBottom: 7, display: 'block', letterSpacing: 0.8 }}>PICK YOUR AVATAR</label>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {AVATARS.map(av => (
                    <button key={av} type="button" onClick={() => setForm(f => ({ ...f, avatar: av }))} style={{ width: 40, height: 40, borderRadius: 11, border: `2px solid ${form.avatar === av ? T.cy : T.bd}`, background: form.avatar === av ? T.cy + '20' : T.s2, fontSize: 18, cursor: 'pointer', transition: 'all .15s', boxShadow: form.avatar === av ? `0 0 12px ${T.cy}50` : 'none', transform: form.avatar === av ? 'scale(1.12)' : 'scale(1)' }}>{av}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: 10.5, color: T.t3, fontWeight: 700, marginBottom: 5, display: 'block', letterSpacing: 0.8 }}>EMAIL</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" style={inp} onFocus={focus} onBlur={blur} required />
          </div>
          <div>
            <label style={{ fontSize: 10.5, color: T.t3, fontWeight: 700, marginBottom: 5, display: 'block', letterSpacing: 0.8 }}>PASSWORD</label>
            <input type="password" value={form.password} onChange={set('password')} placeholder={tab === 'register' ? 'Min 6 characters' : '••••••••'} style={inp} onFocus={focus} onBlur={blur} required />
          </div>

          {error && <div style={{ padding: '9px 12px', borderRadius: 9, background: T.rd + '18', border: `1px solid ${T.rd}40`, color: T.rd, fontSize: 12 }}>⚠️ {error}</div>}

          <button type="submit" disabled={loading} style={{ padding: '12px 0', borderRadius: 12, border: 'none', background: loading ? T.s2 : `linear-gradient(135deg, ${T.cy}, ${T.pu})`, color: loading ? T.t3 : T.bg, fontWeight: 800, fontSize: 14, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', marginTop: 2, boxShadow: loading ? 'none' : `0 0 24px ${T.cy}35`, transition: 'all .2s', letterSpacing: 0.3 }}>
            {loading ? '⏳ Please wait…' : tab === 'login' ? 'Sign In →' : 'Create Account ✦'}
          </button>
        </form>

        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 12, color: T.t3 }}>
          {tab === 'login' ? <>Don't have an account? <button onClick={() => setTab('register')} style={{ background: 'none', border: 'none', color: T.cy, fontWeight: 700, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Create one free</button></> : <>Already have an account? <button onClick={() => setTab('login')} style={{ background: 'none', border: 'none', color: T.cy, fontWeight: 700, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Sign In</button></>}
        </div>

        {tab === 'register' && (
          <div style={{ marginTop: 18, padding: '12px 14px', borderRadius: 11, background: T.cy + '08', border: `1px solid ${T.cy}20` }}>
            <div style={{ fontSize: 11, color: T.cy, fontWeight: 700, marginBottom: 6, letterSpacing: 0.5 }}>✦ WHAT YOU GET</div>
            {['XP & levels saved to your account', '18 achievements + study streaks', 'Notes & bookmarks per topic', 'Personal progress dashboard', 'Daily challenges & coding IDE'].map(item => (
              <div key={item} style={{ fontSize: 11, color: T.t2, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}><span style={{ color: T.gn, fontSize: 8 }}>◆</span>{item}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
