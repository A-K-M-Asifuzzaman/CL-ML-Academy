import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { T } from '../theme.js';
import { CATEGORIES } from '../data/categories.js';
import { TOPICS } from '../data/topics.js';
import { CHALLENGES, DIFFICULTY_COLOR } from '../data/challenges.js';
import { useProgressCtx } from '../context/ProgressContext.jsx';
import BigOViz from '../visualizers/BigOViz.jsx';
import HeroShowcase from '../components/HeroShowcase.jsx';

// Animated counter
function Counter({ value, suffix = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const obj = { v: 0 };
    gsap.to(obj, { v: parseInt(value) || 0, duration: 1.4, ease: 'power2.out', delay: 0.2,
      onUpdate: () => { if (ref.current) ref.current.textContent = Math.round(obj.v) + suffix; } });
  }, [value, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal');
    if (!els?.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

function CategoryCard({ cat }) {
  const topics = TOPICS.filter(t => t.cat === cat.id);
  const viz = topics.filter(t => t.viz && t.viz !== 'none').length;
  return (
    <Link to={`/category/${cat.id}`} className="card3 card3-ac reveal" style={{ '--ac': cat.color, textDecoration: 'none', padding: 18, display: 'block', color: 'inherit' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, background: cat.color + '14', color: cat.color, border: `1px solid ${cat.color}25` }}>{cat.icon}</div>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: T.t0 }}>{cat.label}</div>
      </div>
      <div style={{ fontSize: 12, color: T.t2, lineHeight: 1.6, marginBottom: 14, minHeight: 38 }}>{cat.description}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span className="chip">{topics.length} topics</span>
        {viz > 0 && <span className="chip" style={{ color: cat.color, borderColor: cat.color + '30' }}>{viz} interactive</span>}
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { progress, level } = useProgressCtx();
  const heroRef = useRef(null);
  const pageRef = useReveal();

  const totalTopics = TOPICS.length;
  const vizTopics = TOPICS.filter(t => t.viz && t.viz !== 'none').length;

  useEffect(() => {
    if (!heroRef.current) return;
    const els = heroRef.current.querySelectorAll('[data-h]');
    gsap.fromTo(els, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
  }, []);

  // Daily challenge
  const today = new Date();
  const seed = today.getFullYear() * 1e4 + (today.getMonth() + 1) * 100 + today.getDate();
  const daily = CHALLENGES[seed % CHALLENGES.length];
  const dailyDone = progress.challengesSolved.includes(daily.id);

  const stats = [
    { v: totalTopics, s: '+', label: 'Topics' },
    { v: vizTopics, s: '+', label: 'Visualizers' },
    { v: 13, s: '', label: 'Categories' },
    { v: CHALLENGES.length, s: '', label: 'Challenges' },
  ];

  const features = [
    { icon: '⌨', title: 'Run code in-browser', desc: 'JavaScript runs instantly; Python executes via WebAssembly (Pyodide). 25+ languages, zero setup.', to: '/playground', span: 2, ac: T.cy },
    { icon: '⚔', title: 'Adaptive challenges', desc: 'Test cases, progressive hints, and a hint engine that reads your failures.', to: '/challenges', span: 1, ac: T.gn },
    { icon: '◳', title: 'Interactive visualizers', desc: 'Step through sorting, graphs, trees, hashing, attention, gradient descent — frame by frame.', to: '/roadmap', span: 1, ac: T.pu },
    { icon: '↻', title: 'Spaced repetition', desc: 'An SM-2 review deck schedules topics right before you forget them.', to: '/review', span: 1, ac: T.or },
    { icon: '◈', title: 'XP, levels & leaderboard', desc: 'Earn XP, keep streaks, unlock achievements, and climb a global board.', to: '/leaderboard', span: 1, ac: T.ye },
  ];

  return (
    <div ref={pageRef} style={{ maxWidth: 1240, margin: '0 auto', padding: '0 20px 100px' }}>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position: 'relative', padding: '56px 0 40px' }}>
        {/* layered background */}
        <div className="orb" style={{ width: 360, height: 360, background: T.cy, top: -80, left: -80, opacity: .14 }} />
        <div className="orb" style={{ width: 320, height: 320, background: T.pu, top: -40, right: -60, opacity: .12 }} />
        <div className="grid-panel" aria-hidden style={{ position: 'absolute', inset: 0, opacity: .25, maskImage: 'radial-gradient(ellipse 60% 60% at 30% 30%, #000, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 30% 30%, #000, transparent 75%)' }} />

        <div className="hero-2col" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 48, alignItems: 'center', zIndex: 1 }}>
          {/* Left: copy */}
          <div>
            <div data-h style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px 5px 6px', borderRadius: 999, background: T.s1, border: `1px solid ${T.bd}`, marginBottom: 22 }}>
              <span className="badge-grad" style={{ '--ac': T.cy, fontSize: 10, padding: '2px 8px', borderRadius: 999 }}>NEW</span>
              <span style={{ fontSize: 12, color: T.t2 }}>{totalTopics} topics · Python runs in your browser</span>
            </div>
            <h1 data-h className="h-display" style={{ fontSize: 'clamp(36px, 5.5vw, 60px)', color: T.t0, margin: 0, lineHeight: 1.03 }}>
              Master CS &amp; ML,<br /><span className="text-grad">visually and interactively.</span>
            </h1>
            <p data-h style={{ color: T.t2, fontSize: 'clamp(15px, 1.6vw, 18px)', lineHeight: 1.65, maxWidth: 520, marginTop: 20 }}>
              {totalTopics} deep topics · {vizTopics} hands-on visualizers · in-browser code execution · adaptive challenges · spaced repetition — from arrays to large language models.
            </p>
            <div data-h style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30 }}>
              <Link to="/challenges" className="btn3 btn3-solid" style={{ textDecoration: 'none' }}>Start practicing →</Link>
              <Link to="/playground" className="btn3 btn3-line" style={{ textDecoration: 'none' }}>Open playground</Link>
            </div>
            <div data-h style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: 440, marginTop: 34, borderTop: `1px solid ${T.bd}`, paddingTop: 18 }}>
              {stats.map((s, i) => (
                <div key={s.label} style={{ borderLeft: i ? `1px solid ${T.bd}` : 'none', paddingLeft: i ? 12 : 0 }}>
                  <div className="stat-num" style={{ fontSize: 22 }}><Counter value={s.v} suffix={s.s} /></div>
                  <div style={{ fontSize: 10.5, color: T.t3, marginTop: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: animated showcase */}
          <div data-h className="hero-showcase" style={{ paddingRight: 8 }}>
            <HeroShowcase />
          </div>
        </div>
      </section>

      {/* ── Marquee strip ── */}
      <section style={{ margin: '8px 0 56px', borderTop: `1px solid ${T.bd}`, borderBottom: `1px solid ${T.bd}`, padding: '14px 0', overflow: 'hidden', position: 'relative' }}>
        <div className="marquee">
          {[...CATEGORIES, ...CATEGORIES].map((cat, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 18px', color: T.t2, fontSize: 13.5, whiteSpace: 'nowrap', borderRight: `1px solid ${T.bd}` }}>
              <span style={{ color: cat.color }}>{cat.icon}</span> {cat.label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Resume / Daily strip ── */}
      <section className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 56 }}>
        {progress.xp > 0 && (
          <div className="surface" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: T.s3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: T.cy, fontSize: 16 }}>{level.level}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.t0 }}>Welcome back, {level.name}</div>
              <div style={{ fontSize: 12, color: T.t2, marginTop: 2 }}>{progress.xp} XP · {progress.topicsRead.length} read · {progress.currentStreak}-day streak</div>
            </div>
            <Link to="/dashboard" className="btn3 btn3-line" style={{ textDecoration: 'none', height: 38, padding: '0 16px', fontSize: 13 }}>Dashboard</Link>
          </div>
        )}
        <div className="surface" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: DIFFICULTY_COLOR[daily.difficulty] + '18', color: DIFFICULTY_COLOR[daily.difficulty], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>◆</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10.5, color: T.t3, letterSpacing: '.1em', textTransform: 'uppercase' }}>Daily challenge</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: T.t0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{daily.title}</div>
          </div>
          <Link to={`/challenge/${daily.id}`} className="btn3 btn3-line" style={{ textDecoration: 'none', height: 38, padding: '0 16px', fontSize: 13, color: dailyDone ? T.gn : T.t1, borderColor: dailyDone ? T.gn + '40' : T.bd }}>{dailyDone ? '✓ Done' : 'Solve'}</Link>
        </div>
      </section>

      {/* ── Bento features ── */}
      <section style={{ marginBottom: 64 }}>
        <div className="reveal" style={{ marginBottom: 20 }}>
          <div className="kicker" style={{ marginBottom: 10 }}>Everything in one place</div>
          <h2 className="h-display" style={{ fontSize: 28, color: T.t0, margin: 0 }}>A complete learning workspace</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {features.map((f) => (
            <Link key={f.title} to={f.to} className="ring-card reveal spotlight" style={{ '--ac': f.ac, gridColumn: `span ${f.span}`, textDecoration: 'none', padding: 22, color: 'inherit', minWidth: 0, display: 'block' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, background: `linear-gradient(135deg, ${f.ac}24, ${f.ac}08)`, color: f.ac, border: `1px solid ${f.ac}30` }}>{f.icon}</div>
                {f.span === 2 && <div style={{ flex: 1 }} />}
                {f.span === 2 && <span className="chip" style={{ color: f.ac, borderColor: f.ac + '30' }}>featured</span>}
              </div>
              <div style={{ fontSize: 16.5, fontWeight: 700, color: T.t0, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: T.t2, lineHeight: 1.6 }}>{f.desc}</div>
              <div style={{ marginTop: 14, fontSize: 12.5, color: f.ac, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                Explore <span style={{ transition: 'transform .2s' }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ marginBottom: 64 }}>
        <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div className="kicker" style={{ marginBottom: 10 }}>13 categories · {totalTopics} topics</div>
            <h2 className="h-display" style={{ fontSize: 28, color: T.t0, margin: 0 }}>Browse the curriculum</h2>
          </div>
          <Link to="/roadmap" className="link-underline" style={{ fontSize: 13.5, color: T.t1, textDecoration: 'none', fontWeight: 600 }}>View roadmap →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 14 }}>
          {CATEGORIES.map(cat => <CategoryCard key={cat.id} cat={cat} />)}
        </div>
      </section>

      {/* ── Big-O analyzer ── */}
      <section className="reveal" style={{ marginBottom: 64 }}>
        <div className="surface" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div className="kicker" style={{ marginBottom: 8 }}>Live tool</div>
              <h3 className="h-display" style={{ fontSize: 20, color: T.t0, margin: 0 }}>Big-O complexity analyzer</h3>
            </div>
          </div>
          <BigOViz />
        </div>
      </section>

      {/* ── Featured visualizers ── */}
      <section>
        <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div className="kicker" style={{ marginBottom: 10 }}>Step through them frame by frame</div>
            <h2 className="h-display" style={{ fontSize: 28, color: T.t0, margin: 0 }}>Interactive visualizers</h2>
          </div>
          <span style={{ fontSize: 12.5, color: T.t3 }}>{vizTopics} animated topics</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
          {TOPICS.filter(t => t.viz && t.viz !== 'none').slice(0, 12).map(topic => (
            <Link key={topic.id} to={`/topic/${topic.id}`} className="card3 card3-ac reveal" style={{ '--ac': topic.color, textDecoration: 'none', padding: 16, color: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{topic.icon}</span>
                <span className="chip" style={{ color: topic.color, borderColor: topic.color + '30', fontSize: 10 }}>live</span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.t0 }}>{topic.title}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
