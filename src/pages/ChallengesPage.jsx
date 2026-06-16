import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { T } from '../theme.js';
import { CHALLENGES, DIFFICULTY_COLOR, DIFFICULTY_ORDER } from '../data/challenges.js';
import { CATEGORIES } from '../data/categories.js';
import { useProgressCtx } from '../context/ProgressContext.jsx';

const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'];

function ChallengeCard({ challenge, solved, index }) {
  const ref = useRef(null);
  const diffColor = DIFFICULTY_COLOR[challenge.difficulty];

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: index * 0.05 }
      );
    }
  }, [index]);

  return (
    <Link ref={ref} to={`/challenge/${challenge.id}`}
      style={{ textDecoration: 'none', display: 'block', padding: 18, borderRadius: 12, background: T.s1, border: `1px solid ${solved ? T.gn + '30' : T.bd}`, transition: 'all .2s', color: 'inherit', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${diffColor}60`; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${diffColor}10`; }}
      onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${solved ? T.gn + '30' : T.bd}`; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

      {/* Solved badge */}
      {solved && (
        <div style={{ position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: '50%', background: T.gn + '20', border: `1px solid ${T.gn}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: T.gn, fontWeight: 700 }}>✓</div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 8, background: diffColor + '15', color: diffColor, border: `1px solid ${diffColor}25`, textTransform: 'capitalize', fontWeight: 600 }}>
          {challenge.difficulty}
        </span>
        <span style={{ fontSize: 11, color: T.t3 }}>+{challenge.xp} XP</span>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: solved ? T.gn : T.t0, marginBottom: 6 }}>{challenge.title}</div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
        {challenge.tags.slice(0, 3).map(tag => (
          <span key={tag} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 6, background: T.s2, color: T.t3, border: `1px solid ${T.bd}` }}>{tag}</span>
        ))}
      </div>

      <div style={{ fontSize: 11, color: T.t3 }}>
        {challenge.testCases.length} test cases · {challenge.hints?.length || 0} hints
      </div>
    </Link>
  );
}

export default function ChallengesPage() {
  const [diff, setDiff] = useState('all');
  const [topic, setTopic] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('difficulty');
  const { progress } = useProgressCtx();
  const headerRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    }
    if (statsRef.current) {
      gsap.fromTo(statsRef.current.children, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.5)', delay: 0.3 });
    }
  }, []);

  const solved = progress.challengesSolved;
  const total = CHALLENGES.length;
  const solvedCount = solved.length;
  const easyCount    = CHALLENGES.filter(c => c.difficulty === 'easy').length;
  const mediumCount  = CHALLENGES.filter(c => c.difficulty === 'medium').length;
  const hardCount    = CHALLENGES.filter(c => c.difficulty === 'hard').length;

  const filtered = CHALLENGES
    .filter(c => diff   === 'all' || c.difficulty === diff)
    .filter(c => topic  === 'all' || c.topicId === topic)
    .filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sort === 'difficulty') return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
      if (sort === 'xp')        return b.xp - a.xp;
      if (sort === 'title')     return a.title.localeCompare(b.title);
      if (sort === 'solved')    return (solved.includes(b.id) ? 1 : 0) - (solved.includes(a.id) ? 1 : 0);
      return 0;
    });

  const topics = [...new Set(CHALLENGES.map(c => c.topicId))];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 60px' }}>
      {/* Header */}
      <div ref={headerRef} style={{ padding: '32px 0 24px' }}>
        <div style={{ fontSize: 11, color: T.cy, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Practice</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: T.t0, margin: '0 0 8px', letterSpacing: -1 }}>Coding Challenges</h1>
        <p style={{ color: T.t2, fontSize: 13, margin: 0 }}>Sharpen your skills with {total} hand-crafted problems. Each problem has hints, test cases, and solutions.</p>
      </div>

      {/* Stats */}
      <div ref={statsRef} style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total', value: total, color: T.cy },
          { label: 'Solved', value: solvedCount, color: T.gn },
          { label: `Easy (${easyCount})`, value: CHALLENGES.filter(c => c.difficulty === 'easy' && solved.includes(c.id)).length, color: DIFFICULTY_COLOR.easy },
          { label: `Medium (${mediumCount})`, value: CHALLENGES.filter(c => c.difficulty === 'medium' && solved.includes(c.id)).length, color: DIFFICULTY_COLOR.medium },
          { label: `Hard (${hardCount})`, value: CHALLENGES.filter(c => c.difficulty === 'hard' && solved.includes(c.id)).length, color: DIFFICULTY_COLOR.hard },
        ].map(s => (
          <div key={s.label} style={{ padding: '12px 18px', background: T.s1, borderRadius: 10, border: `1px solid ${s.color}25`, textAlign: 'center', minWidth: 100 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: T.t2 }}>{s.label}</div>
          </div>
        ))}

        {/* Progress bar */}
        <div style={{ flex: 1, minWidth: 200, padding: '12px 18px', background: T.s1, borderRadius: 10, border: `1px solid ${T.bd}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: T.t2 }}>Overall Progress</span>
            <span style={{ fontSize: 11, color: T.gn, fontWeight: 600 }}>{Math.round((solvedCount / total) * 100)}%</span>
          </div>
          <div style={{ height: 6, background: T.bd, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(solvedCount / total) * 100}%`, background: `linear-gradient(90deg, ${T.gn}, ${T.cy})`, borderRadius: 3, transition: 'width .6s ease' }} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="Search challenges..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '8px 14px', borderRadius: 9, background: T.s2, border: `1px solid ${T.bd}`, color: T.t0, fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
        />

        <div style={{ display: 'flex', gap: 4 }}>
          {DIFFICULTIES.map(d => (
            <button key={d} onClick={() => setDiff(d)}
              style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${diff === d ? DIFFICULTY_COLOR[d] || T.cy : T.bd}`, background: diff === d ? (DIFFICULTY_COLOR[d] || T.cy) + '15' : 'transparent', color: diff === d ? DIFFICULTY_COLOR[d] || T.cy : T.t2, cursor: 'pointer', fontSize: 11, textTransform: 'capitalize', fontFamily: 'inherit', transition: 'all .15s' }}>
              {d}
            </button>
          ))}
        </div>

        <select value={topic} onChange={e => setTopic(e.target.value)}
          style={{ padding: '7px 12px', borderRadius: 9, background: T.s2, border: `1px solid ${T.bd}`, color: T.t1, fontSize: 12, fontFamily: 'inherit' }}>
          <option value="all">All Topics</option>
          {topics.map(t => <option key={t} value={t}>{t.replace(/-/g, ' ')}</option>)}
        </select>

        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding: '7px 12px', borderRadius: 9, background: T.s2, border: `1px solid ${T.bd}`, color: T.t1, fontSize: 12, fontFamily: 'inherit' }}>
          <option value="difficulty">Sort: Difficulty</option>
          <option value="xp">Sort: XP</option>
          <option value="title">Sort: Title</option>
          <option value="solved">Sort: Unsolved first</option>
        </select>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: T.t3, marginBottom: 12 }}>
        {filtered.length} challenge{filtered.length !== 1 ? 's' : ''} found
        {search && ` for "${search}"`}
      </div>

      {/* Challenge grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {filtered.map((c, i) => (
          <ChallengeCard key={c.id} challenge={c} solved={solved.includes(c.id)} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: T.t2 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.t1, marginBottom: 6 }}>No challenges found</div>
          <div style={{ fontSize: 13 }}>Try different filters or search terms.</div>
        </div>
      )}
    </div>
  );
}
