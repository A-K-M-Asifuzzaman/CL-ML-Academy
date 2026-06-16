import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { T } from '../theme.js';
import { CATEGORIES } from '../data/categories.js';
import { TOPICS } from '../data/topics.js';
import { CHALLENGES, DIFFICULTY_COLOR } from '../data/challenges.js';
import { useProgressCtx } from '../context/ProgressContext.jsx';
import BigOViz from '../visualizers/BigOViz.jsx';

// Animated particle canvas
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: [T.cy, T.gn, T.pu, T.or][Math.floor(Math.random() * 4)],
      opacity: Math.random() * 0.6 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Draw connections
        particles.forEach(p2 => {
          const d = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = T.cy + Math.round((1 - d / 120) * 30).toString(16).padStart(2, '0');
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

// Animated counter
function AnimatedCounter({ value, suffix = '', color = T.cy }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const obj = { val: 0 };
    gsap.to(obj, { val: parseInt(value) || 0, duration: 1.5, ease: 'power2.out', delay: 0.3,
      onUpdate: () => { if (ref.current) ref.current.textContent = Math.round(obj.val) + suffix; }
    });
  }, [value, suffix]);
  return <span ref={ref} style={{ color }}>0{suffix}</span>;
}

// Category card with GSAP hover
function CategoryCard({ cat, index }) {
  const ref = useRef(null);
  const glowRef = useRef(null);
  const catTopics = TOPICS.filter(t => t.cat === cat.id);
  const vizCount = catTopics.filter(t => t.viz && t.viz !== 'none').length;

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current,
        { opacity: 0, y: 40, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', delay: 0.05 * index }
      );
    }
  }, [index]);

  const onEnter = () => {
    gsap.to(ref.current, { y: -6, scale: 1.02, duration: 0.25, ease: 'power2.out' });
    if (glowRef.current) gsap.to(glowRef.current, { opacity: 1, duration: 0.3 });
  };
  const onLeave = () => {
    gsap.to(ref.current, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
    if (glowRef.current) gsap.to(glowRef.current, { opacity: 0, duration: 0.3 });
  };

  return (
    <Link ref={ref} to={`/category/${cat.id}`} style={{ textDecoration: 'none', display: 'block', position: 'relative', borderRadius: 16, overflow: 'hidden', opacity: 0 }}
      onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {/* Glow effect */}
      <div ref={glowRef} style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 0%, ${cat.color}30, transparent 70%)`, opacity: 0, pointerEvents: 'none', borderRadius: 16 }} />

      <div style={{ padding: 20, background: T.s1, border: `1px solid ${cat.color}20`, borderRadius: 16, color: 'inherit', height: '100%', boxSizing: 'border-box', position: 'relative' }}>
        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${cat.color}, transparent)`, borderRadius: '16px 16px 0 0' }} />

        <div style={{ fontSize: 28, marginBottom: 10 }}>{cat.icon}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: cat.color, marginBottom: 5 }}>{cat.label}</div>
        <div style={{ fontSize: 11, color: T.t2, lineHeight: 1.6, marginBottom: 12 }}>{cat.description}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: cat.color, fontWeight: 600 }}>{catTopics.length} topics</span>
          {vizCount > 0 && (
            <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10, background: T.gn + '15', color: T.gn, border: `1px solid ${T.gn}25` }}>
              ▶ {vizCount} viz
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Featured topic card
function FeaturedCard({ topic, index }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', delay: 0.04 * index }
      );
    }
  }, [index]);

  return (
    <Link ref={ref} to={`/topic/${topic.id}`} style={{ textDecoration: 'none', display: 'block', padding: 14, borderRadius: 12, background: T.s1, border: `1px solid ${topic.color}20`, transition: 'all .2s', color: 'inherit', opacity: 0 }}
      onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${topic.color}60`; e.currentTarget.style.background = T.s2; e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)'; e.currentTarget.style.boxShadow = `0 8px 24px ${topic.color}15`; }}
      onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${topic.color}20`; e.currentTarget.style.background = T.s1; e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ fontSize: 20 }}>{topic.icon}</span>
        <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: T.gn + '15', color: T.gn, border: `1px solid ${T.gn}25` }}>▶ Live</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: topic.color, marginBottom: 3 }}>{topic.title}</div>
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {topic.tags.slice(0, 2).map(tag => (
          <span key={tag} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 6, background: topic.color + '12', color: topic.color, border: `1px solid ${topic.color}20` }}>{tag}</span>
        ))}
      </div>
    </Link>
  );
}

// Daily challenge widget
function DailyChallenge() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const idx = seed % CHALLENGES.length;
  const challenge = CHALLENGES[idx];
  const { progress } = useProgressCtx();
  const done = progress.challengesSolved.includes(challenge.id);
  const diffColor = DIFFICULTY_COLOR[challenge.difficulty];

  return (
    <div style={{ padding: 20, borderRadius: 16, background: `linear-gradient(135deg, ${T.s2}, ${T.s3})`, border: `1px solid ${T.or}25`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: T.or + '08' }} />
      <div style={{ fontSize: 11, color: T.or, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>🌟 Daily Challenge</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: T.t0, marginBottom: 6 }}>{challenge.title}</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 8, background: diffColor + '20', color: diffColor, border: `1px solid ${diffColor}30`, textTransform: 'capitalize' }}>{challenge.difficulty}</span>
        <span style={{ fontSize: 11, color: T.t3 }}>+{challenge.xp} XP</span>
      </div>
      <Link to={`/challenge/${challenge.id}`}
        style={{ display: 'inline-block', padding: '8px 18px', borderRadius: 9, background: done ? T.gn : T.or, color: T.bg, textDecoration: 'none', fontWeight: 700, fontSize: 12, transition: 'opacity .15s' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
        {done ? '✓ Solved Today!' : 'Start Challenge →'}
      </Link>
    </div>
  );
}

export default function HomePage() {
  const heroRef     = useRef(null);
  const titleRef    = useRef(null);
  const subtitleRef = useRef(null);
  const statsRef    = useRef(null);
  const { progress, level } = useProgressCtx();

  useEffect(() => {
    const tl = gsap.timeline();
    if (titleRef.current) {
      tl.fromTo(titleRef.current,   { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
    }
    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4');
    }
    if (statsRef.current) {
      tl.fromTo(statsRef.current.children, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.2');
    }
  }, []);

  const totalTopics = TOPICS.length;
  const vizTopics   = TOPICS.filter(t => t.viz && t.viz !== 'none').length;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 80px' }}>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <div ref={heroRef} style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', marginBottom: 60, minHeight: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        {/* Background gradient */}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 50%, ${T.cy}12, transparent 50%), radial-gradient(ellipse at 70% 50%, ${T.pu}12, transparent 50%), radial-gradient(ellipse at 50% 0%, ${T.gn}08, transparent 40%), ${T.s1}`, borderRadius: 24 }} />
        {/* Grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${T.bd}25 1px, transparent 1px), linear-gradient(90deg, ${T.bd}25 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.4 }} />
        {/* Particles */}
        <ParticleCanvas />

        <div style={{ position: 'relative', textAlign: 'center', zIndex: 1 }}>
          <div style={{ display: 'inline-block', fontSize: 10, letterSpacing: 5, color: T.cy, textTransform: 'uppercase', marginBottom: 16, padding: '4px 16px', borderRadius: 20, background: T.cy + '12', border: `1px solid ${T.cy}30` }}>
            Complete Interactive Learning Platform
          </div>

          <div ref={titleRef} style={{ marginBottom: 18, opacity: 0 }}>
            <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, margin: 0, letterSpacing: -2, lineHeight: 1.05, color: T.t0 }}>
              Master Computer Science
            </h1>
            <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, margin: 0, letterSpacing: -2, lineHeight: 1.05, background: `linear-gradient(135deg, ${T.cy} 0%, ${T.gn} 40%, ${T.pu} 80%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              From Arrays to LLMs
            </h1>
          </div>

          <div ref={subtitleRef} style={{ opacity: 0, marginBottom: 32 }}>
            <p style={{ color: T.t2, fontSize: 16, margin: '0 auto', maxWidth: 560, lineHeight: 1.7 }}>
              Interactive visualizations · Live code execution · Multi-type quizzes · Coding challenges · XP system · 13 categories, {totalTopics}+ topics
            </p>
          </div>

          <div ref={statsRef} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
            {[
              { value: totalTopics, label: 'Topics',      suffix: '+', color: T.cy },
              { value: vizTopics,   label: 'Visualizers', suffix: '+', color: T.gn },
              { value: 13,          label: 'Categories',  suffix: '',  color: T.pu },
              { value: CHALLENGES.length, label: 'Challenges', suffix: '', color: T.or },
            ].map(s => (
              <div key={s.label} style={{ padding: '12px 22px', background: T.s2 + 'cc', backdropFilter: 'blur(10px)', borderRadius: 14, border: `1px solid ${s.color}25`, textAlign: 'center', minWidth: 90, opacity: 0 }}>
                <div style={{ fontSize: 24, fontWeight: 800 }}>
                  <AnimatedCounter value={s.value} suffix={s.suffix} color={s.color} />
                </div>
                <div style={{ fontSize: 11, color: T.t2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { to: '/challenges', label: '⚔️ Start Coding', bg: `linear-gradient(135deg, ${T.cy}, ${T.gn})`, color: T.bg },
              { to: '/playground', label: '▶ Playground',   bg: 'transparent', color: T.cy, border: `1px solid ${T.cy}50` },
              { to: '/dashboard',  label: '📊 Dashboard',   bg: 'transparent', color: T.pu, border: `1px solid ${T.pu}50` },
            ].map(btn => (
              <Link key={btn.to} to={btn.to}
                style={{ padding: '11px 26px', borderRadius: 12, background: btn.bg, color: btn.color, textDecoration: 'none', fontWeight: 700, fontSize: 14, border: btn.border || 'none', transition: 'all .2s', display: 'inline-block' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)'; e.currentTarget.style.boxShadow = `0 8px 20px ${btn.color}30`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
                {btn.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── PROGRESS SNAPSHOT (if user has progress) ─────────────────────── */}
      {progress.xp > 0 && (
        <div style={{ padding: '18px 24px', borderRadius: 16, background: `linear-gradient(135deg, ${T.s2}, ${T.s1})`, border: `1px solid ${T.cy}20`, marginBottom: 40, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${T.cy}, ${T.pu})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: T.bg, flexShrink: 0, boxShadow: `0 0 16px ${T.cy}40` }}>
            {level.level}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.t0, marginBottom: 2 }}>Welcome back, {level.name}!</div>
            <div style={{ fontSize: 12, color: T.t2 }}>{progress.xp} XP · {progress.topicsRead.length} topics read · {progress.challengesSolved.length} challenges solved · {progress.currentStreak} day streak 🔥</div>
          </div>
          <Link to="/dashboard" style={{ padding: '7px 16px', borderRadius: 9, background: T.cy + '15', border: `1px solid ${T.cy}30`, color: T.cy, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
            View Dashboard →
          </Link>
        </div>
      )}

      {/* ─── DAILY CHALLENGE ──────────────────────────────────────────────── */}
      <div style={{ marginBottom: 50 }}>
        <DailyChallenge />
      </div>

      {/* ─── CATEGORIES ───────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: T.t0, margin: 0 }}>Browse All Topics</h2>
          <Link to="/roadmap" style={{ fontSize: 12, color: T.cy, textDecoration: 'none' }}>View Roadmap →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 14 }}>
          {CATEGORIES.map((cat, i) => <CategoryCard key={cat.id} cat={cat} index={i} />)}
        </div>
      </div>

      {/* ─── BIG-O CHART ──────────────────────────────────────────────────── */}
      <div style={{ padding: '20px', background: T.s1, borderRadius: 18, border: `1px solid ${T.bd}`, marginBottom: 50 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: T.t0, margin: 0 }}>Big-O Complexity Reference</h3>
          <Link to="/bigo" style={{ fontSize: 12, color: T.ye, textDecoration: 'none' }}>Full Page →</Link>
        </div>
        <BigOViz />
      </div>

      {/* ─── FEATURED VISUALIZERS ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: T.t0, margin: 0 }}>Interactive Visualizers</h2>
          <span style={{ fontSize: 12, color: T.t3 }}>{vizTopics} animated topics</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {TOPICS.filter(t => t.viz && t.viz !== 'none').slice(0, 12).map((topic, i) => (
            <FeaturedCard key={topic.id} topic={topic} index={i} />
          ))}
        </div>
      </div>

      {/* ─── QUICK STATS STRIP ────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {[
          { icon: '⚡', title: 'Live Code Execution', desc: 'Run JavaScript directly in your browser with our Monaco-powered IDE', color: T.cy, to: '/playground' },
          { icon: '⚔️', title: 'Coding Challenges',   desc: '25+ problems with test cases, hints, and reference solutions', color: T.gn, to: '/challenges' },
          { icon: '📝', title: 'Multi-Type Quizzes',  desc: 'MCQ, true/false, fill-in, output prediction — test every concept', color: T.pu, to: '/' },
          { icon: '🏆', title: 'XP & Achievements',   desc: 'Earn XP, unlock badges, maintain streaks, track your progress', color: T.ye, to: '/dashboard' },
        ].map(item => (
          <Link key={item.title} to={item.to} style={{ textDecoration: 'none', padding: '18px 20px', borderRadius: 14, background: T.s1, border: `1px solid ${item.color}15`, transition: 'all .2s', display: 'block' }}
            onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${item.color}50`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${item.color}15`; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: T.t2, lineHeight: 1.6 }}>{item.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
