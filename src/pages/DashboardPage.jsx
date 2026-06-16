import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { T } from '../theme.js';
import { useProgressCtx } from '../context/ProgressContext.jsx';
import { CHALLENGES, DIFFICULTY_COLOR } from '../data/challenges.js';
import { TOPICS } from '../data/topics.js';
import { CATEGORIES } from '../data/categories.js';
import { LEVELS } from '../hooks/useProgress.js';

function XpBar({ progress, level, nextLevel, xpProgress }) {
  const barRef = useRef(null);
  useEffect(() => {
    if (barRef.current && xpProgress) {
      gsap.fromTo(barRef.current, { width: '0%' }, { width: `${xpProgress.pct}%`, duration: 1.2, ease: 'power3.out', delay: 0.4 });
    }
  }, [xpProgress]);

  return (
    <div style={{ padding: '20px', background: `linear-gradient(135deg, ${T.s2}, ${T.s3})`, borderRadius: 14, border: `1px solid ${T.cy}25`, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${T.cy}, ${T.pu})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: T.bg, boxShadow: `0 0 20px ${T.cy}40`, flexShrink: 0 }}>
          {level.level}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: T.t0 }}>{level.name}</div>
          <div style={{ fontSize: 12, color: T.t2 }}>{progress.xp.toLocaleString()} XP total</div>
        </div>
        {nextLevel && (
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: T.t3 }}>Next: {nextLevel.name}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.cy }}>{xpProgress?.needed.toLocaleString()} XP to go</div>
          </div>
        )}
      </div>
      {xpProgress && (
        <div>
          <div style={{ height: 8, background: T.bd, borderRadius: 4, overflow: 'hidden' }}>
            <div ref={barRef} style={{ height: '100%', width: '0%', background: `linear-gradient(90deg, ${T.cy}, ${T.pu})`, borderRadius: 4 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 10, color: T.t3 }}>Level {level.level}</span>
            <span style={{ fontSize: 10, color: T.t3 }}>Level {nextLevel?.level}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, value, label, color, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)', delay });
    }
  }, [delay]);

  return (
    <div ref={ref} style={{ padding: '16px 18px', background: T.s1, borderRadius: 12, border: `1px solid ${color}20`, textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: T.t2 }}>{label}</div>
    </div>
  );
}

function CategoryProgress() {
  const { progress } = useProgressCtx();
  const refs = useRef([]);

  useEffect(() => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      const cat = CATEGORIES[i];
      const catTopics = TOPICS.filter(t => t.cat === cat.id);
      const done = catTopics.filter(t => progress.topicsRead.includes(t.id)).length;
      const pct = catTopics.length > 0 ? (done / catTopics.length) * 100 : 0;
      const bar = el.querySelector('.pbar');
      if (bar) gsap.fromTo(bar, { width: '0%' }, { width: `${pct}%`, duration: 0.8, ease: 'power2.out', delay: 0.1 + i * 0.05 });
    });
  }, [progress]);

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: T.t0, marginBottom: 14 }}>Category Progress</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CATEGORIES.map((cat, i) => {
          const catTopics = TOPICS.filter(t => t.cat === cat.id);
          const done = catTopics.filter(t => progress.topicsRead.includes(t.id)).length;
          const pct = catTopics.length > 0 ? (done / catTopics.length) * 100 : 0;
          return (
            <Link key={cat.id} to={`/category/${cat.id}`} style={{ textDecoration: 'none' }}>
              <div ref={el => refs.current[i] = el} style={{ padding: '10px 14px', background: T.s1, borderRadius: 9, border: `1px solid ${T.bd}`, transition: 'border-color .15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = cat.color + '50'}
                onMouseLeave={e => e.currentTarget.style.borderColor = T.bd}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: cat.color, fontWeight: 600 }}>{cat.icon} {cat.label}</span>
                  <span style={{ fontSize: 11, color: T.t3 }}>{done}/{catTopics.length}</span>
                </div>
                <div style={{ height: 4, background: T.bd, borderRadius: 2, overflow: 'hidden' }}>
                  <div className="pbar" style={{ height: '100%', width: '0%', background: cat.color, borderRadius: 2 }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function AchievementsGrid({ allAchievements }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current.children, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.04, ease: 'back.out(1.4)', delay: 0.5 });
    }
  }, []);

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: T.t0, marginBottom: 14 }}>Achievements</h3>
      <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
        {allAchievements.map(ach => (
          <div key={ach.id} style={{ padding: '12px', borderRadius: 10, background: ach.unlocked ? T.s2 : T.s1, border: `1px solid ${ach.unlocked ? T.ye + '40' : T.bd}`, opacity: ach.unlocked ? 1 : 0.4, transition: 'all .2s', textAlign: 'center' }}
            title={ach.desc}>
            <div style={{ fontSize: 24, marginBottom: 4, filter: ach.unlocked ? 'none' : 'grayscale(1)' }}>{ach.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: ach.unlocked ? T.ye : T.t3, marginBottom: 2 }}>{ach.label}</div>
            <div style={{ fontSize: 10, color: T.t3 }}>{ach.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivity({ progress }) {
  const recentTopics = [...progress.topicsRead].reverse().slice(0, 5);
  const recentSolved = [...progress.challengesSolved].reverse().slice(0, 5);

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: T.t0, marginBottom: 14 }}>Recent Activity</h3>
      {recentTopics.length === 0 && recentSolved.length === 0 ? (
        <div style={{ fontSize: 13, color: T.t3, textAlign: 'center', padding: '24px 0' }}>Start learning to see activity here!</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {recentSolved.map(id => {
            const c = CHALLENGES.find(ch => ch.id === id);
            if (!c) return null;
            return (
              <Link key={id} to={`/challenge/${c.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: T.s2, border: `1px solid ${T.gn}20` }}>
                <span style={{ fontSize: 14 }}>✓</span>
                <span style={{ fontSize: 12, color: T.gn, flex: 1, fontWeight: 600 }}>Solved: {c.title}</span>
                <span style={{ fontSize: 10, color: T.gn }}>+{c.xp} XP</span>
              </Link>
            );
          })}
          {recentTopics.map(id => {
            const t = TOPICS.find(tp => tp.id === id);
            if (!t) return null;
            return (
              <Link key={id} to={`/topic/${t.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: T.s1, border: `1px solid ${T.bd}` }}>
                <span style={{ fontSize: 14 }}>{t.icon}</span>
                <span style={{ fontSize: 12, color: T.t1, flex: 1 }}>Read: {t.title}</span>
                <span style={{ fontSize: 10, color: T.cy }}>+15 XP</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StreakCalendar({ progress }) {
  const days = ['S','M','T','W','T','F','S'];
  const today = new Date();
  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (34 - i));
    return d.toDateString();
  });

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: T.t0, marginBottom: 12 }}>
        Study Streak — <span style={{ color: T.or }}>{progress.currentStreak} 🔥</span>
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 6 }}>
        {days.map((d, i) => <div key={i} style={{ fontSize: 9, color: T.t3, textAlign: 'center' }}>{d}</div>)}
        {cells.map((d, i) => {
          const isToday = d === today.toDateString();
          const isLast  = d === progress.lastStudyDate;
          return (
            <div key={i} style={{ aspectRatio: '1', borderRadius: 3, background: isLast || isToday ? T.cy + '60' : T.s2, border: isToday ? `1px solid ${T.cy}` : '1px solid transparent', transition: 'all .2s' }} title={d} />
          );
        })}
      </div>
      <div style={{ fontSize: 11, color: T.t3 }}>Longest streak: {progress.longestStreak} days</div>
    </div>
  );
}

export default function DashboardPage() {
  const { progress, level, nextLevel, xpProgress, allAchievements, resetProgress } = useProgressCtx();
  const [showReset, setShowReset] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    }
  }, []);

  const solvedChallenges = progress.challengesSolved.length;
  const totalXpFromChallenges = CHALLENGES.filter(c => progress.challengesSolved.includes(c.id)).reduce((s, c) => s + c.xp, 0);

  return (
    <div ref={pageRef} style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 60px' }}>
      {/* Header */}
      <div style={{ padding: '28px 0 20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 11, color: T.cy, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Your Learning Journey</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: T.t0, margin: 0, letterSpacing: -1 }}>Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: T.gn, fontWeight: 700 }}>{progress.currentStreak} day streak 🔥</span>
          <button onClick={() => setShowReset(true)} style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${T.rd}30`, background: T.rd + '10', color: T.rd, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>
            Reset
          </button>
        </div>
      </div>

      {/* XP Level bar */}
      <XpBar progress={progress} level={level} nextLevel={nextLevel} xpProgress={xpProgress} />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        <StatCard icon="📚" value={progress.topicsRead.length}   label="Topics Read"       color={T.cy}  delay={0}    />
        <StatCard icon="⚔️" value={solvedChallenges}            label="Challenges Solved"  color={T.gn}  delay={0.05} />
        <StatCard icon="📝" value={progress.quizzesDone.length}  label="Quizzes Done"       color={T.pu}  delay={0.1}  />
        <StatCard icon="🏆" value={progress.achievements.length} label="Achievements"       color={T.ye}  delay={0.15} />
        <StatCard icon="💻" value={progress.playgroundRuns}      label="Code Runs"          color={T.or}  delay={0.2}  />
        <StatCard icon="⭐" value={progress.perfectQuizzes}      label="Perfect Quizzes"    color={T.pk}  delay={0.25} />
      </div>

      {/* Main 3-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <AchievementsGrid allAchievements={allAchievements} />
          <RecentActivity progress={progress} />
          <StreakCalendar progress={progress} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <CategoryProgress />

          {/* Quick actions */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: T.t0, marginBottom: 12 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: '▶ Code Playground', to: '/playground', color: T.cy },
                { label: '⚔️ Browse Challenges', to: '/challenges', color: T.gn },
                { label: '🗺️ Roadmap', to: '/roadmap', color: T.pu },
                { label: '📊 Big-O Reference', to: '/bigo', color: T.ye },
              ].map(a => (
                <Link key={a.to} to={a.to} style={{ textDecoration: 'none', padding: '10px 14px', borderRadius: 9, background: T.s1, border: `1px solid ${a.color}25`, color: a.color, fontSize: 13, fontWeight: 600, display: 'block', transition: 'all .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = a.color + '10'; e.currentTarget.style.borderColor = a.color + '60'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.s1; e.currentTarget.style.borderColor = a.color + '25'; }}>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bookmarks */}
          {progress.bookmarks.length > 0 && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: T.t0, marginBottom: 12 }}>Bookmarks</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {progress.bookmarks.slice(0, 5).map(id => {
                  const t = TOPICS.find(tp => tp.id === id);
                  if (!t) return null;
                  return (
                    <Link key={id} to={`/topic/${t.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: T.s1, border: `1px solid ${T.bd}`, fontSize: 12, color: t.color }}>
                      {t.icon} {t.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset confirmation */}
      {showReset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ padding: '32px', borderRadius: 16, background: T.s1, border: `1px solid ${T.rd}50`, textAlign: 'center', maxWidth: 360 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ color: T.rd, marginBottom: 8 }}>Reset All Progress?</h3>
            <p style={{ color: T.t2, fontSize: 13, marginBottom: 20 }}>This will delete all your XP, solved challenges, quiz history, and achievements. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setShowReset(false)} style={{ padding: '9px 20px', borderRadius: 9, border: `1px solid ${T.bd}`, background: T.s2, color: T.t1, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={() => { resetProgress(); setShowReset(false); }} style={{ padding: '9px 20px', borderRadius: 9, border: 'none', background: T.rd, color: '#fff', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>Reset Everything</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
