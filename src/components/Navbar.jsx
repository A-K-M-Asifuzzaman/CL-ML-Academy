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

export default function Navbar() {
  const { pathname }             = useLocation();
  const navigate                 = useNavigate();
  const [q, setQ]                = useState('');
  const [userMenu, setUserMenu]  = useState(false);
  const [mobileMenu, setMobile]  = useState(false);
  const { progress }             = useProgressCtx();
  const { user, logout }         = useAuth();
  const navRef                   = useRef(null);
  const mobileRef                = useRef(null);
  const level                    = getLevelInfo(progress.xp);
  const next                     = LEVELS.find(l => l.minXp > progress.xp);
  const pct                      = next ? Math.round(((progress.xp - level.minXp) / (next.minXp - level.minXp)) * 100) : 100;

  useEffect(() => {
    if (navRef.current) gsap.fromTo(navRef.current, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    if (mobileRef.current) {
      if (mobileMenu) gsap.fromTo(mobileRef.current, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22, ease: 'power2.out' });
    }
  }, [mobileMenu]);

  // Close mobile menu on route change
  useEffect(() => { setMobile(false); setUserMenu(false); }, [pathname]);

  const handleSearch = e => {
    e.preventDefault();
    if (q.trim()) { navigate(`/search?q=${encodeURIComponent(q.trim())}`); setQ(''); setMobile(false); }
  };

  const isActive = path => pathname === path || pathname.startsWith(path + '/');

  const navLinks = [
    { to: '/challenges', label: '⚔️ Challenges', color: T.gn },
    { to: '/playground', label: '▶ Playground',  color: T.cy },
    { to: '/roadmap',    label: '🗺️ Roadmap',    color: T.pu },
    { to: '/dashboard',  label: '📊 Dashboard',  color: T.or },
  ];

  const linkStyle = (l) => ({
    padding: '4px 10px', borderRadius: 14, fontSize: 11, whiteSpace: 'nowrap',
    fontWeight: isActive(l.to) ? 700 : 400, textDecoration: 'none',
    color: isActive(l.to) ? l.color : T.t2,
    background: isActive(l.to) ? l.color + '15' : 'transparent',
    border: `1px solid ${isActive(l.to) ? l.color + '50' : 'transparent'}`,
    transition: 'all .15s',
  });

  return (
    <>
      <nav ref={navRef} style={{ position: 'sticky', top: 0, zIndex: 200, background: T.bg + 'ea', backdropFilter: 'blur(18px)', borderBottom: `1px solid ${T.bd}`, padding: '0 16px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 6, height: 54 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${T.cy}, ${T.pu})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: `0 0 12px ${T.cy}40` }}>🧠</div>
            <div className="hide-mobile">
              <div style={{ fontWeight: 900, fontSize: 13, background: `linear-gradient(90deg, ${T.cy}, ${T.gn})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1, whiteSpace: 'nowrap' }}>CS & ML Academy</div>
              <div style={{ fontSize: 9, color: T.t3, letterSpacing: 1 }}>LEARN · CODE · MASTER</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-links-desktop" style={{ display: 'flex', gap: 2, flex: 1, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={linkStyle(l)}
                onMouseEnter={e => { if (!isActive(l.to)) { e.currentTarget.style.color = l.color; e.currentTarget.style.background = l.color + '10'; } }}
                onMouseLeave={e => { if (!isActive(l.to)) { e.currentTarget.style.color = T.t2; e.currentTarget.style.background = 'transparent'; } }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop search */}
          <form className="nav-search-desktop" onSubmit={handleSearch} style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…"
              style={{ width: 120, padding: '5px 12px', borderRadius: 18, border: `1px solid ${T.bd}`, background: T.s2, color: T.t0, fontSize: 12, outline: 'none', fontFamily: 'inherit' }}
              onFocus={e => e.currentTarget.style.border = `1px solid ${T.cy}50`}
              onBlur={e => e.currentTarget.style.border = `1px solid ${T.bd}`} />
            <button type="submit" style={{ padding: '5px 11px', borderRadius: 18, border: `1px solid ${T.cy}40`, background: T.cy + '15', color: T.cy, fontSize: 13, cursor: 'pointer' }}>⌕</button>
          </form>

          {/* XP pill — desktop only */}
          <Link to="/dashboard" className="hide-mobile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', flexShrink: 0, padding: '3px 10px', borderRadius: 12, background: T.cy + '10', border: `1px solid ${T.cy}25` }}>
            <div style={{ fontSize: 10, color: T.cy, fontWeight: 700, lineHeight: 1 }}>{progress.xp.toLocaleString()} XP</div>
            <div style={{ width: 50, height: 3, borderRadius: 2, background: T.s3, marginTop: 3, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: T.cy, borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 9, color: T.t3, lineHeight: 1, marginTop: 2 }}>Lv{level.level} {level.name}</div>
          </Link>

          {/* Right side: user avatar + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {/* User avatar */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => { setUserMenu(m => !m); setMobile(false); }}
                style={{ width: 34, height: 34, borderRadius: '50%', border: `2px solid ${userMenu ? T.cy : T.bd}`, background: T.s2, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border .2s', boxShadow: userMenu ? `0 0 12px ${T.cy}40` : 'none', padding: 0, overflow: 'hidden' }}>
                {user?.photoURL
                  ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (user?.avatar || '🧑‍💻')}
              </button>
              {userMenu && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 190, background: T.s1, border: `1px solid ${T.bd}`, borderRadius: 14, padding: 10, zIndex: 300, boxShadow: '0 20px 50px rgba(0,0,0,.7)' }}
                  onMouseLeave={() => setUserMenu(false)}>
                  <div style={{ padding: '7px 9px', borderRadius: 9, background: T.s2, border: `1px solid ${T.bd}`, marginBottom: 7 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.t0 }}>{user?.username || user?.displayName || 'Student'}</div>
                    <div style={{ fontSize: 10, color: T.t3, marginTop: 1, wordBreak: 'break-all' }}>{user?.email}</div>
                    <div style={{ fontSize: 10, color: T.cy, marginTop: 2 }}>Lv{level.level} · {level.name}</div>
                  </div>
                  {[{ to: '/dashboard', icon: '📊', label: 'Dashboard' }, { to: '/challenges', icon: '⚔️', label: 'Challenges' }, { to: '/roadmap', icon: '🗺️', label: 'Roadmap' }].map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setUserMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 9px', borderRadius: 7, textDecoration: 'none', color: T.t1, fontSize: 12, transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = T.s2}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <span>{item.icon}</span>{item.label}
                    </Link>
                  ))}
                  <div style={{ height: 1, background: T.bd, margin: '7px 0' }} />
                  <button onClick={() => { setUserMenu(false); logout(); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 9px', borderRadius: 7, border: 'none', background: 'transparent', color: T.rd, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.background = T.rd + '15'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span>→</span> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button className="nav-hamburger" onClick={() => { setMobile(m => !m); setUserMenu(false); }}
              style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${mobileMenu ? T.cy : T.bd}`, background: mobileMenu ? T.cy + '18' : T.s2, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 0 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 16, height: 1.5, background: mobileMenu ? T.cy : T.t2, borderRadius: 2, transition: 'all .2s', transform: mobileMenu ? (i===0?'rotate(45deg) translate(3.5px,3.5px)':i===2?'rotate(-45deg) translate(3.5px,-3.5px)':'scaleX(0)') : 'none' }} />)}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileMenu && (
        <div ref={mobileRef} className="nav-mobile-menu" style={{ position: 'fixed', top: 54, left: 0, right: 0, zIndex: 190, background: T.s1 + 'f8', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${T.bd}`, padding: '12px 16px 20px' }}>
          {/* XP bar mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: T.s2, borderRadius: 12, border: `1px solid ${T.bd}`, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>{user?.avatar || '🧑‍💻'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.t0 }}>{user?.username || user?.displayName || 'Student'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <div style={{ flex: 1, height: 4, background: T.s3, borderRadius: 2, overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: T.cy, borderRadius: 2 }} /></div>
                <span style={{ fontSize: 10, color: T.cy, fontWeight: 700 }}>{progress.xp} XP · Lv{level.level}</span>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobile(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 11, textDecoration: 'none', color: isActive(l.to) ? l.color : T.t1, background: isActive(l.to) ? l.color + '15' : 'transparent', border: `1px solid ${isActive(l.to) ? l.color + '40' : 'transparent'}`, fontWeight: isActive(l.to) ? 700 : 400, fontSize: 14 }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search topics…"
              style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: `1px solid ${T.bd}`, background: T.s2, color: T.t0, fontSize: 15, outline: 'none', fontFamily: 'inherit' }} />
            <button type="submit" style={{ padding: '10px 16px', borderRadius: 12, border: `1px solid ${T.cy}40`, background: T.cy + '15', color: T.cy, fontSize: 15, cursor: 'pointer' }}>⌕</button>
          </form>

          <button onClick={() => { setMobile(false); logout(); }} style={{ width: '100%', padding: '10px 14px', borderRadius: 11, border: `1px solid ${T.rd}30`, background: T.rd + '12', color: T.rd, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>→ Sign Out</button>
        </div>
      )}
    </>
  );
}
