import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { T } from '../theme.js';
import { CHALLENGES, DIFFICULTY_COLOR, DIFFICULTY_ORDER } from '../data/challenges.js';
import { useProgressCtx } from '../context/ProgressContext.jsx';
import { RadialRing } from '../components/Charts.jsx';

const DIFFS = ['all', 'easy', 'medium', 'hard'];

function ChallengeCard({ challenge, solved, index }) {
  const ref = useRef(null);
  const dc = DIFFICULTY_COLOR[challenge.difficulty];
  useEffect(() => { if (ref.current) gsap.fromTo(ref.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: Math.min(index * 0.03, 0.4) }); }, [index]);
  return (
    <Link ref={ref} to={`/challenge/${challenge.id}`} className="ring-card spotlight" style={{ '--ac': dc, textDecoration: 'none', display: 'block', padding: 18, color: 'inherit', position: 'relative' }}>
      {solved && <div style={{ position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderRadius: '50%', background: T.gn + '1e', border: `1px solid ${T.gn}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: T.gn, fontWeight: 700 }}>✓</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 10.5, padding: '3px 10px', borderRadius: 999, background: dc + '16', color: dc, border: `1px solid ${dc}30`, textTransform: 'capitalize', fontWeight: 600 }}>{challenge.difficulty}</span>
        <span className="chip" style={{ fontSize: 10.5 }}>+{challenge.xp} XP</span>
      </div>
      <div style={{ fontSize: 15.5, fontWeight: 700, color: solved ? T.gn : T.t0, marginBottom: 8 }}>{challenge.title}</div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
        {challenge.tags.slice(0, 3).map(tag => <span key={tag} className="chip" style={{ fontSize: 9.5 }}>{tag}</span>)}
      </div>
      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: T.t3, borderTop: `1px solid ${T.bd}`, paddingTop: 10 }}>
        <span>◇ {challenge.testCases.length} tests</span>
        <span>💡 {challenge.hints?.length || 0} hints</span>
      </div>
    </Link>
  );
}

export default function ChallengesPage() {
  const [diff, setDiff] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('difficulty');
  const { progress } = useProgressCtx();
  const headRef = useRef(null);

  useEffect(() => { if (headRef.current) gsap.fromTo(headRef.current.querySelectorAll('[data-h]'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out' }); }, []);

  const solved = progress.challengesSolved;
  const total = CHALLENGES.length;
  const byDiff = (d) => CHALLENGES.filter(c => c.difficulty === d);
  const solvedIn = (d) => byDiff(d).filter(c => solved.includes(c.id)).length;
  const pct = Math.round((solved.length / total) * 100);

  const filtered = CHALLENGES
    .filter(c => diff === 'all' || c.difficulty === diff)
    .filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sort === 'difficulty') return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
      if (sort === 'xp') return b.xp - a.xp;
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'unsolved') return (solved.includes(a.id) ? 1 : 0) - (solved.includes(b.id) ? 1 : 0);
      return 0;
    });

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 20px 90px' }}>
      <div ref={headRef} style={{ padding: '30px 0 22px' }}>
        <div data-h className="kicker" style={{ marginBottom: 8 }}>Practice</div>
        <h1 data-h className="h-display" style={{ fontSize: 34, color: T.t0, margin: '0 0 22px' }}>Coding Challenges</h1>

        <div data-h className="ring-card spotlight" style={{ '--ac': T.gn, padding: 24, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 28, alignItems: 'center' }}>
          <RadialRing value={pct} size={120} color={T.gn}>
            <div className="stat-num" style={{ fontSize: 26, color: T.t0 }}>{pct}%</div>
            <div style={{ fontSize: 9.5, color: T.t3, textTransform: 'uppercase', letterSpacing: '.08em' }}>solved</div>
          </RadialRing>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div><div className="stat-num" style={{ fontSize: 22, color: T.t0 }}>{solved.length}</div><div style={{ fontSize: 11, color: T.t3 }}>solved</div></div>
              <div><div className="stat-num" style={{ fontSize: 22, color: T.t0 }}>{total}</div><div style={{ fontSize: 11, color: T.t3 }}>total</div></div>
              <div><div className="stat-num" style={{ fontSize: 22, color: T.gn }}>{CHALLENGES.filter(c=>solved.includes(c.id)).reduce((s,c)=>s+c.xp,0)}</div><div style={{ fontSize: 11, color: T.t3 }}>XP earned</div></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['easy','medium','hard'].map(d => {
                const t = byDiff(d).length, s = solvedIn(d), p = t ? (s/t)*100 : 0;
                return (
                  <div key={d}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                      <span style={{ color: DIFFICULTY_COLOR[d], textTransform: 'capitalize', fontWeight: 600 }}>{d}</span>
                      <span style={{ color: T.t3 }}>{s}/{t}</span>
                    </div>
                    <div style={{ height: 6, background: T.s3, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${p}%`, height: '100%', background: DIFFICULTY_COLOR[d], borderRadius: 3, transition: 'width .8s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.t3 }}>⌕</span>
          <input placeholder="Search challenges…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 32px', borderRadius: 10, background: T.s1, border: `1px solid ${T.bd}`, color: T.t0, fontSize: 13.5, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, background: T.s1, border: `1px solid ${T.bd}`, borderRadius: 10, padding: 3 }}>
          {DIFFS.map(d => (
            <button key={d} onClick={() => setDiff(d)}
              style={{ padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, textTransform: 'capitalize', fontFamily: 'inherit', fontWeight: diff === d ? 600 : 400,
                background: diff === d ? (DIFFICULTY_COLOR[d] || T.cy) + '1e' : 'transparent', color: diff === d ? (DIFFICULTY_COLOR[d] || T.cy) : T.t2 }}>{d}</button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '9px 12px', borderRadius: 10, background: T.s1, border: `1px solid ${T.bd}`, color: T.t1, fontSize: 12.5, fontFamily: 'inherit', cursor: 'pointer' }}>
          <option value="difficulty">Difficulty</option>
          <option value="xp">Highest XP</option>
          <option value="title">A–Z</option>
          <option value="unsolved">Unsolved first</option>
        </select>
      </div>

      <div style={{ fontSize: 12.5, color: T.t3, marginBottom: 14 }}>{filtered.length} challenge{filtered.length !== 1 ? 's' : ''}{search && ` matching "${search}"`}</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {filtered.map((c, i) => <ChallengeCard key={c.id} challenge={c} solved={solved.includes(c.id)} index={i} />)}
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
