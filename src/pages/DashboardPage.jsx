import { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { T } from '../theme.js';
import { useProgressCtx } from '../context/ProgressContext.jsx';
import { CHALLENGES } from '../data/challenges.js';
import { TOPICS } from '../data/topics.js';
import { CATEGORIES } from '../data/categories.js';
import { LEVELS } from '../hooks/useProgress.js';
import { RadialRing, Sparkline, Radar, Heatmap, BarRow } from '../components/Charts.jsx';

function useIsMobile(bp = 768) {
  const [m, setM] = useState(() => typeof window !== 'undefined' ? window.innerWidth < bp : false);
  useEffect(() => { const h = () => setM(window.innerWidth < bp); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, [bp]);
  return m;
}

function Count({ to, dur = 1.1, suffix = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const o = { v: 0 };
    gsap.to(o, { v: to, duration: dur, ease: 'power2.out', onUpdate: () => { if (ref.current) ref.current.textContent = Math.round(o.v).toLocaleString() + suffix; } });
  }, [to, dur, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

export default function DashboardPage() {
  const isMobile = useIsMobile(900);
  const { progress, level, nextLevel, xpProgress, allAchievements, resetProgress } = useProgressCtx();
  const [showReset, setShowReset] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => { if (pageRef.current) gsap.fromTo(pageRef.current.querySelectorAll('[data-r]'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }); }, []);

  const solvedXp = CHALLENGES.filter(c => progress.challengesSolved.includes(c.id)).reduce((s, c) => s + c.xp, 0);
  const unlocked = allAchievements.filter(a => a.unlocked).length;

  // Category mastery (for radar + bars)
  const mastery = useMemo(() => CATEGORIES.map(cat => {
    const ts = TOPICS.filter(t => t.cat === cat.id);
    const done = ts.filter(t => progress.topicsRead.includes(t.id)).length;
    return { id: cat.id, label: cat.label, color: cat.color, done, total: ts.length, value: ts.length ? done / ts.length : 0 };
  }), [progress.topicsRead]);

  // top 8 categories by size for radar
  const radarAxes = mastery.slice(0, 8).map(m => ({ label: m.label.split(' ')[0], value: Math.max(0.04, m.value), color: m.color }));

  // fake-but-deterministic activity series from progress for sparklines
  const xpSeries = useMemo(() => {
    const n = 14; const arr = [];
    let base = Math.max(0, progress.xp - n * 30);
    for (let i = 0; i < n; i++) { base += (progress.xp / n) * (0.5 + (Math.sin(i) + 1) / 2); arr.push(Math.round(base)); }
    arr[n - 1] = progress.xp; return arr;
  }, [progress.xp]);

  // heatmap from lastStudyDate + streak (approximate)
  const heatDays = useMemo(() => {
    const days = []; const today = new Date();
    for (let i = 0; i < progress.currentStreak; i++) { const d = new Date(today); d.setDate(today.getDate() - i); days.push({ date: d, count: 1 + (i % 4) }); }
    // sprinkle topicsRead as past activity
    progress.topicsRead.forEach((_, idx) => { const d = new Date(today); d.setDate(today.getDate() - (idx * 2 + 1)); days.push({ date: d, count: 2 }); });
    return days;
  }, [progress.currentStreak, progress.topicsRead]);

  const statCards = [
    { label: 'Topics read', value: progress.topicsRead.length, color: T.cy, series: xpSeries.map(v => v / 30) },
    { label: 'Challenges', value: progress.challengesSolved.length, color: T.gn, series: [1,2,2,3,3,4,5,5,6,7,8,8,9, progress.challengesSolved.length] },
    { label: 'Quizzes', value: progress.quizzesDone.length, color: T.pu, series: [0,1,1,2,2,3,3,4,4,5,6,6,7, progress.quizzesDone.length] },
    { label: 'Code runs', value: progress.playgroundRuns, color: T.or, series: [0,0,1,2,2,3,5,6,8,9,11,12,14, progress.playgroundRuns] },
  ];

  const panel = { borderRadius: 18 };

  return (
    <div ref={pageRef} style={{ maxWidth: 1240, margin: '0 auto', padding: isMobile ? '0 14px 80px' : '0 20px 90px' }}>
      {/* Header */}
      <div data-r style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: isMobile ? '20px 0 18px' : '30px 0 22px' }}>
        <div>
          <div className="kicker" style={{ marginBottom: 8 }}>Your progress</div>
          <h1 className="h-display" style={{ fontSize: isMobile ? 26 : 34, color: T.t0, margin: 0 }}>Dashboard</h1>
        </div>
        <button onClick={() => setShowReset(true)} className="btn3 btn3-line" style={{ height: 38, padding: '0 16px', fontSize: 12.5, color: T.rd, borderColor: T.rd + '33' }}>Reset progress</button>
      </div>

      {/* Top row: level ring + sparkline stat cards */}
      <div data-r style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '320px 1fr', gap: 16, marginBottom: 16 }}>
        {/* Level ring panel */}
        <div className="ring-card spotlight" style={{ '--ac': T.cy, ...panel, padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
          <RadialRing value={xpProgress?.pct || (nextLevel ? 0 : 100)} size={128} color={T.cy}>
            <div className="stat-num" style={{ fontSize: 30, color: T.t0 }}>{level.level}</div>
            <div style={{ fontSize: 10, color: T.t3, letterSpacing: '.1em', textTransform: 'uppercase' }}>level</div>
          </RadialRing>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: T.t0, fontFamily: 'var(--font-display)' }}>{level.name}</div>
            <div className="stat-num" style={{ fontSize: 24, color: T.cy, marginTop: 2 }}><Count to={progress.xp} suffix=" XP" /></div>
            {nextLevel ? (
              <div style={{ fontSize: 12, color: T.t2, marginTop: 6 }}>{xpProgress?.needed.toLocaleString()} XP to <span style={{ color: T.t1 }}>{nextLevel.name}</span></div>
            ) : <div style={{ fontSize: 12, color: T.gn, marginTop: 6 }}>Max level reached 🏆</div>}
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <span className="chip" style={{ color: T.or, borderColor: T.or + '30' }}>🔥 {progress.currentStreak}d streak</span>
              <span className="chip">{unlocked}/{allAchievements.length} badges</span>
            </div>
          </div>
        </div>

        {/* Stat cards with sparklines */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 16 }}>
          {statCards.map(s => (
            <div key={s.label} className="card3" style={{ padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="stat-num" style={{ fontSize: 26, color: T.t0 }}><Count to={s.value} /></div>
                  <div style={{ fontSize: 11.5, color: T.t3, marginTop: 2 }}>{s.label}</div>
                </div>
                <span className="dot" style={{ background: s.color, marginTop: 6, boxShadow: `0 0 8px ${s.color}` }} />
              </div>
              <div style={{ marginTop: 12 }}><Sparkline data={s.series} color={s.color} w={140} h={32} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Mid row: radar + category bars */}
      <div data-r style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr', gap: 16, marginBottom: 16 }}>
        <div className="card3" style={{ padding: 22 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.t0, marginBottom: 4 }}>Skill coverage</div>
          <div style={{ fontSize: 12, color: T.t3, marginBottom: 8 }}>Mastery across the 8 largest tracks</div>
          <Radar axes={radarAxes} color={T.cy} size={isMobile ? 240 : 280} />
        </div>
        <div className="card3" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.t0 }}>Category mastery</div>
            <Link to="/" className="link-underline" style={{ fontSize: 12, color: T.t2, textDecoration: 'none' }}>Browse →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {mastery.map(m => (
              <Link key={m.id} to={`/category/${m.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <BarRow label={m.label} value={m.done} max={m.total} color={m.color} sub={`${m.done}/${m.total}`} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Activity heatmap */}
      <div data-r className="card3" style={{ padding: 22, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.t0 }}>Activity</div>
            <div style={{ fontSize: 12, color: T.t3, marginTop: 2 }}>Longest streak {progress.longestStreak} days · current {progress.currentStreak} 🔥</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: T.t3 }}>
            less <span style={{ display: 'inline-flex', gap: 3 }}>{['#1a1b22', T.gn+'33', T.gn+'66', T.gn+'aa', T.gn].map((c,i)=><span key={i} style={{ width:11,height:11,borderRadius:3,background:c }} />)}</span> more
          </div>
        </div>
        <Heatmap days={heatDays} color={T.gn} weeks={isMobile ? 10 : 18} />
      </div>

      {/* Bottom: achievements + activity feed */}
      <div data-r style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: 16 }}>
        {/* Achievements */}
        <div className="card3" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.t0 }}>Achievements</div>
            <span style={{ fontSize: 12, color: T.t3 }}>{unlocked}/{allAchievements.length}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3,1fr)' : 'repeat(6,1fr)', gap: 10 }}>
            {allAchievements.map(a => (
              <div key={a.id} title={`${a.label} — ${a.desc}`} style={{ aspectRatio: '1', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: a.unlocked ? T.s2 : T.s1, border: `1px solid ${a.unlocked ? T.ye + '40' : T.bd}`, opacity: a.unlocked ? 1 : 0.45, transition: 'transform .2s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <span style={{ fontSize: 22, filter: a.unlocked ? 'none' : 'grayscale(1)' }}>{a.icon}</span>
                <span style={{ fontSize: 8.5, color: a.unlocked ? T.ye : T.t3, textAlign: 'center', lineHeight: 1.1, padding: '0 2px' }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="card3" style={{ padding: 22 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.t0, marginBottom: 16 }}>Recent activity</div>
          {(() => {
            const items = [
              ...[...progress.challengesSolved].reverse().slice(0, 4).map(id => { const c = CHALLENGES.find(x => x.id === id); return c && { icon: '⚔', color: T.gn, text: `Solved ${c.title}`, xp: `+${c.xp}`, to: `/challenge/${c.id}` }; }),
              ...[...progress.topicsRead].reverse().slice(0, 5).map(id => { const t = TOPICS.find(x => x.id === id); return t && { icon: t.icon, color: T.cy, text: `Read ${t.title}`, xp: '+15', to: `/topic/${t.id}` }; }),
            ].filter(Boolean).slice(0, 8);
            if (!items.length) return <div style={{ fontSize: 13, color: T.t3, textAlign: 'center', padding: '24px 0' }}>Start learning to populate your feed.</div>;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {items.map((it, i) => (
                  <Link key={i} to={it.to} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 8px', borderRadius: 9, textDecoration: 'none', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = T.s2}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: it.color + '16', color: it.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{it.icon}</div>
                    <span style={{ flex: 1, fontSize: 12.5, color: T.t1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.text}</span>
                    <span style={{ fontSize: 11, color: it.color, fontWeight: 600 }}>{it.xp}</span>
                  </Link>
                ))}
              </div>
            );
          })()}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.bd}`, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link to="/playground" className="btn3 btn3-line" style={{ height: 34, padding: '0 12px', fontSize: 12, flex: 1, textDecoration: 'none' }}>Playground</Link>
            <Link to="/challenges" className="btn3 btn3-line" style={{ height: 34, padding: '0 12px', fontSize: 12, flex: 1, textDecoration: 'none' }}>Challenges</Link>
          </div>
        </div>
      </div>

      {/* Reset modal */}
      {showReset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.72)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={() => setShowReset(false)}>
          <div className="surface" style={{ padding: 30, textAlign: 'center', maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3 className="h-display" style={{ color: T.t0, marginBottom: 8, fontSize: 20 }}>Reset all progress?</h3>
            <p style={{ color: T.t2, fontSize: 13.5, marginBottom: 22, lineHeight: 1.6 }}>This permanently deletes your XP, solved challenges, quizzes, and achievements. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setShowReset(false)} className="btn3 btn3-line" style={{ height: 40 }}>Cancel</button>
              <button onClick={() => { resetProgress(); setShowReset(false); }} className="btn3 btn3-solid" style={{ height: 40, background: T.rd, color: '#fff' }}>Reset everything</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
