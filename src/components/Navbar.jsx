import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { T } from '../theme.js';
import { useProgressCtx } from '../context/ProgressContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { LEVELS } from '../hooks/useProgress.js';

function getLevelInfo(xp) {
  let lv = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.minXp) lv = l;
  return lv;
}

const NAV = [
  { to: '/',            label: 'Home' },
  { to: '/challenges',  label: 'Challenges' },
  { to: '/playground',  label: 'Playground' },
  { to: '/review',      label: 'Review' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/roadmap',     label: 'Roadmap' },
];

export default function Navbar() {
  const { pathname }   = useLocation();
  const navigate       = useNavigate();
  const [q, setQ]      = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const [mobile, setMobile]     = useState(false);
  const { progress }   = useProgressCtx();
  const { user, logout } = useAuth();
  const navRef    = useRef(null);
  const level     = getLevelInfo(progress.xp);
  const next      = LEVELS.find(l => l.minXp > progress.xp);
  const pct       = next ? Math.round(((progress.xp - level.minXp) / (next.minXp - level.minXp)) * 100) : 100;

  useEffect(() => {
    if (navRef.current) gsap.fromTo(navRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
  }, []);
  useEffect(() => { setMobile(false); setUserMenu(false); }, [pathname]);

  const isActive = (p) => p === '/' ? pathname === '/' : (pathname === p || pathname.startsWith(p + '/'));
  const search = (e) => { e.preventDefault(); if (q.trim()) { navigate(`/search?q=${encodeURIComponent(q.trim())}`); setQ(''); setMobile(false); } };

  return (
    <>
      <nav ref={navRef} style={{ position: 'sticky', top: 0, zIndex: 200 }}>
        <div className="glass-2" style={{ borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14, height: 60, padding: '0 20px' }}>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: T.t0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: T.bg }}>◆</div>
              <span className="hide-mobile h-display" style={{ fontSize: 16, fontWeight: 800, color: T.t0, letterSpacing: '-0.03em' }}>
                CS·ML <span style={{ color: T.t2, fontWeight: 600 }}>Academy</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 6 }}>
              {NAV.map(l => {
                const active = isActive(l.to);
                return (
                  <Link key={l.to} to={l.to}
                    style={{ padding: '7px 13px', borderRadius: 9, fontSize: 13.5, fontWeight: active ? 600 : 500, textDecoration: 'none', color: active ? T.t0 : T.t2, background: active ? T.s2 : 'transparent', transition: 'all .15s', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = T.t0; e.currentTarget.style.background = T.s2; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = T.t2; e.currentTarget.style.background = 'transparent'; } }}>
                    {l.label}
                  </Link>
                );
              })}
            </div>

            <div style={{ flex: 1 }} />

            {/* Search (desktop) */}
            <form className="nav-search-desktop" onSubmit={search} style={{ position: 'relative', flexShrink: 0 }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.t3, fontSize: 13, pointerEvents: 'none' }}>⌕</span>
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…"
                style={{ width: 160, padding: '8px 12px 8px 30px', borderRadius: 9, border: `1px solid ${T.bd}`, background: T.s1, color: T.t0, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => e.currentTarget.style.borderColor = T.s4}
                onBlur={e => e.currentTarget.style.borderColor = T.bd} />
            </form>

            {/* XP chip (desktop) */}
            <Link to="/dashboard" className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0, padding: '6px 12px', borderRadius: 9, background: T.s1, border: `1px solid ${T.bd}` }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: T.s3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: T.cy }}>{level.level}</div>
              <div>
                <div style={{ fontSize: 11.5, color: T.t1, fontWeight: 600, lineHeight: 1 }}>{progress.xp.toLocaleString()} XP</div>
                <div style={{ width: 54, height: 3, borderRadius: 2, background: T.s3, marginTop: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: T.cy, borderRadius: 2 }} />
                </div>
              </div>
            </Link>

            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button onClick={() => { setUserMenu(m => !m); setMobile(false); }}
                style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${userMenu ? T.s4 : T.bd}`, background: T.s1, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, overflow: 'hidden' }}>
                {user?.photoURL ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user?.avatar || '🧑‍💻')}
              </button>
              {userMenu && (
                <div className="surface" style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 210, padding: 8, zIndex: 300, boxShadow: '0 16px 50px rgba(0,0,0,.6)' }}
                  onMouseLeave={() => setUserMenu(false)}>
                  <div style={{ padding: '9px 10px', borderRadius: 10, background: T.s2, marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.t0 }}>{user?.username || user?.displayName || 'Student'}</div>
                    <div style={{ fontSize: 11, color: T.t3, marginTop: 1, wordBreak: 'break-all' }}>{user?.email}</div>
                    <div style={{ fontSize: 11, color: T.cy, marginTop: 3 }}>Lv {level.level} · {level.name}</div>
                  </div>
                  {[['/dashboard','Dashboard'],['/challenges','Challenges'],['/review','Review'],['/leaderboard','Leaderboard']].map(([to, label]) => (
                    <Link key={to} to={to} onClick={() => setUserMenu(false)} style={{ display: 'block', padding: '8px 10px', borderRadius: 8, textDecoration: 'none', color: T.t1, fontSize: 13, transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = T.s2}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>{label}</Link>
                  ))}
                  <div style={{ height: 1, background: T.bd, margin: '6px 0' }} />
                  <button onClick={() => { setUserMenu(false); logout(); }} style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8, border: 'none', background: 'transparent', color: T.rd, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.background = T.rd + '14'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Sign out</button>
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button className="nav-hamburger" onClick={() => { setMobile(m => !m); setUserMenu(false); }}
              style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${mobile ? T.s4 : T.bd}`, background: T.s1, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 0, flexShrink: 0 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 16, height: 1.5, background: T.t1, borderRadius: 2, transition: 'all .2s', transform: mobile ? (i===0?'rotate(45deg) translate(3.5px,3.5px)':i===2?'rotate(-45deg) translate(3.5px,-3.5px)':'scaleX(0)') : 'none' }} />)}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobile && (
        <div className="nav-mobile-menu glass-2" style={{ position: 'fixed', top: 60, left: 0, right: 0, zIndex: 190, borderLeft: 'none', borderRight: 'none', padding: '14px 16px 20px' }}>
          <div className="surface" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', marginBottom: 12, background: T.s2 }}>
            <span style={{ fontSize: 20 }}>{user?.avatar || '🧑‍💻'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.t0 }}>{user?.username || user?.displayName || 'Student'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <div style={{ flex: 1, height: 4, background: T.s3, borderRadius: 2, overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: T.cy, borderRadius: 2 }} /></div>
                <span style={{ fontSize: 11, color: T.cy, fontWeight: 700 }}>{progress.xp} XP · Lv{level.level}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 12 }}>
            {[...NAV, { to: '/dashboard', label: 'Dashboard' }].map(l => {
              const active = isActive(l.to);
              return (
                <Link key={l.to} to={l.to} onClick={() => setMobile(false)} style={{ padding: '12px 14px', borderRadius: 10, textDecoration: 'none', color: active ? T.t0 : T.t1, background: active ? T.s2 : 'transparent', fontWeight: active ? 600 : 500, fontSize: 15 }}>{l.label}</Link>
              );
            })}
          </div>
          <form onSubmit={search} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search topics…"
              style={{ flex: 1, padding: '11px 14px', borderRadius: 10, border: `1px solid ${T.bd}`, background: T.s1, color: T.t0, fontSize: 15, outline: 'none', fontFamily: 'inherit' }} />
            <button type="submit" className="btn3 btn3-line" style={{ height: 'auto', padding: '0 16px' }}>⌕</button>
          </form>
          <button onClick={() => { setMobile(false); logout(); }} className="btn3 btn3-line" style={{ width: '100%', color: T.rd, borderColor: T.rd + '40' }}>Sign out</button>
        </div>
      )}
    </>
  );
}
