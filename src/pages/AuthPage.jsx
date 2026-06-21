import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth, AVATARS } from '../context/AuthContext.jsx';
import { T } from '../theme.js';

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '', avatar: AVATARS[0] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, loginWithGoogle, loginWithGitHub, isConfigured } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => { if (cardRef.current) gsap.fromTo(cardRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }); }, []);
  useEffect(() => { setError(''); }, [tab]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const shake = () => { if (cardRef.current) gsap.fromTo(cardRef.current, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' }); };

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    const res = tab === 'login'
      ? await login({ email: form.email, password: form.password })
      : await register({ username: form.username, email: form.email, password: form.password, avatar: form.avatar });
    setLoading(false);
    if (res.error) { setError(res.error); shake(); } else navigate('/');
  };
  const handleOAuth = async (fn) => { setError(''); setLoading(true); const res = await fn(); setLoading(false); if (res?.error) { setError(res.error); shake(); } else navigate('/'); };

  const inp = { width: '100%', padding: '12px 14px', borderRadius: 11, border: `1px solid ${T.bd}`, background: T.s2, color: T.t0, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s, box-shadow .15s' };
  const focus = e => { e.currentTarget.style.borderColor = T.cy; e.currentTarget.style.boxShadow = `0 0 0 3px ${T.cy}1e`; };
  const blur = e => { e.currentTarget.style.borderColor = T.bd; e.currentTarget.style.boxShadow = 'none'; };
  const label = { fontSize: 10.5, color: T.t3, fontWeight: 600, marginBottom: 6, display: 'block', letterSpacing: '.08em', textTransform: 'uppercase' };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr', placeItems: 'center', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      {/* backdrop */}
      <div className="orb" style={{ width: 420, height: 420, background: T.cy, top: -120, left: -100, opacity: .12 }} />
      <div className="orb" style={{ width: 380, height: 380, background: T.pu, bottom: -120, right: -80, opacity: .1 }} />
      <div className="grid-panel" style={{ position: 'absolute', inset: 0, opacity: .2, maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000, transparent 75%)' }} />

      <div ref={cardRef} className="auth-split" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1.05fr 1fr', width: '100%', maxWidth: 960, margin: 20, borderRadius: 24, overflow: 'hidden', border: `1px solid ${T.bd}`, background: T.s1, boxShadow: '0 50px 120px -40px rgba(0,0,0,.9)' }}>

        {/* Left: brand showcase */}
        <div className="auth-brand spotlight" style={{ position: 'relative', padding: '44px 40px', background: `linear-gradient(160deg, ${T.s2}, ${T.s1})`, borderRight: `1px solid ${T.bd}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
          <div className="orb" style={{ width: 220, height: 220, background: T.cy, top: -60, right: -40, opacity: .16 }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 30 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: T.t0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: T.bg }}>◆</div>
              <span className="h-display" style={{ fontSize: 17, fontWeight: 800, color: T.t0 }}>CS·ML Academy</span>
            </div>
            <h1 className="h-display" style={{ fontSize: 30, color: T.t0, lineHeight: 1.1, margin: 0 }}>Master CS &amp; ML,<br /><span className="text-grad">interactively.</span></h1>
            <p style={{ color: T.t2, fontSize: 14, lineHeight: 1.6, marginTop: 14, maxWidth: 320 }}>79 deep topics, hands-on visualizers, in-browser code, and adaptive practice — all tracked to your account.</p>
          </div>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
            {['Run JavaScript & Python in your browser', 'Step-through visualizers for every concept', 'XP, levels, streaks & a global leaderboard', 'Spaced-repetition review built in'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: T.t1 }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, background: T.gn + '1c', color: T.gn, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>✓</span>{f}
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div style={{ padding: '40px 36px' }}>
          <div style={{ display: 'flex', background: T.s2, borderRadius: 12, padding: 4, marginBottom: 24, border: `1px solid ${T.bd}` }}>
            {[['login', 'Sign in'], ['register', 'Create account']].map(([t, l]) => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', background: tab === t ? T.s4 : 'transparent', color: tab === t ? T.t0 : T.t3, fontWeight: tab === t ? 600 : 500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}>{l}</button>
            ))}
          </div>

          {isConfigured && (
            <>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[{ label: 'Google', icon: '🌐', fn: loginWithGoogle }, { label: 'GitHub', icon: '⌥', fn: loginWithGitHub }].map(({ label: l, icon, fn }) => (
                  <button key={l} onClick={() => handleOAuth(fn)} disabled={loading} className="btn3 btn3-line" style={{ flex: 1, height: 42, fontSize: 13 }}><span style={{ fontSize: 15 }}>{icon}</span> {l}</button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}><div style={{ flex: 1, height: 1, background: T.bd }} /><span style={{ fontSize: 11, color: T.t3 }}>or email</span><div style={{ flex: 1, height: 1, background: T.bd }} /></div>
            </>
          )}

          {!isConfigured && (
            <div style={{ padding: '9px 12px', borderRadius: 10, background: T.or + '14', border: `1px solid ${T.or}33`, color: T.or, fontSize: 11.5, marginBottom: 16, lineHeight: 1.5 }}>
              Demo mode — add Firebase keys to <code style={{ background: T.s2, padding: '1px 5px', borderRadius: 4 }}>.env</code> for Google/GitHub login.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {tab === 'register' && (
              <>
                <div><label style={label}>Username</label><input value={form.username} onChange={set('username')} placeholder="your_handle" style={inp} onFocus={focus} onBlur={blur} required /></div>
                <div>
                  <label style={label}>Pick an avatar</label>
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                    {AVATARS.map(av => (
                      <button key={av} type="button" onClick={() => setForm(f => ({ ...f, avatar: av }))} style={{ width: 40, height: 40, borderRadius: 11, border: `1px solid ${form.avatar === av ? T.cy : T.bd}`, background: form.avatar === av ? T.cy + '1c' : T.s2, fontSize: 18, cursor: 'pointer', transition: 'all .15s', transform: form.avatar === av ? 'scale(1.08)' : 'none' }}>{av}</button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div><label style={label}>Email</label><input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" style={inp} onFocus={focus} onBlur={blur} required /></div>
            <div><label style={label}>Password</label><input type="password" value={form.password} onChange={set('password')} placeholder={tab === 'register' ? 'Min 6 characters' : '••••••••'} style={inp} onFocus={focus} onBlur={blur} required /></div>

            {error && <div style={{ padding: '10px 12px', borderRadius: 10, background: T.rd + '16', border: `1px solid ${T.rd}38`, color: T.rd, fontSize: 12.5 }}>⚠ {error}</div>}

            <button type="submit" disabled={loading} className="btn3 btn3-solid" style={{ height: 46, marginTop: 2, fontSize: 14.5 }}>{loading ? 'Please wait…' : tab === 'login' ? 'Sign in →' : 'Create account →'}</button>
          </form>

          <div style={{ marginTop: 18, textAlign: 'center', fontSize: 12.5, color: T.t3 }}>
            {tab === 'login'
              ? <>New here? <button onClick={() => setTab('register')} style={{ background: 'none', border: 'none', color: T.cy, fontWeight: 600, cursor: 'pointer', fontSize: 12.5, fontFamily: 'inherit' }}>Create a free account</button></>
              : <>Already a member? <button onClick={() => setTab('login')} style={{ background: 'none', border: 'none', color: T.cy, fontWeight: 600, cursor: 'pointer', fontSize: 12.5, fontFamily: 'inherit' }}>Sign in</button></>}
          </div>
        </div>
      </div>
    </div>
  );
}
