import { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { T } from '../theme.js';
import { getTopicById, TOPICS } from '../data/topics.js';
import { getCategoryById } from '../data/categories.js';
import { getChallengesByTopic, DIFFICULTY_COLOR } from '../data/challenges.js';
import { getQuizzesByTopic } from '../data/quizzes.js';
import { CodeBlock } from '../components/UI.jsx';
import ConceptViz from '../components/ConceptViz.jsx';
import QuizBlock from '../components/QuizBlock.jsx';
import { useProgressCtx } from '../context/ProgressContext.jsx';

/* ── reading-time estimate ── */
function readingTime(topic) {
  const words = (topic.overview || '').split(/\s+/).length +
    (topic.points || []).reduce((s, p) => s + (p.t + ' ' + p.d).split(/\s+/).length, 0);
  return Math.max(2, Math.round(words / 200));
}

/* ── section heading with anchor ── */
function SectionTitle({ kicker, title, color }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {kicker && <div className="kicker" style={{ marginBottom: 8, color: T.t2 }}>{kicker}</div>}
      <h2 className="h-display" style={{ fontSize: 22, color: T.t0, margin: 0 }}>{title}</h2>
      <div style={{ width: 36, height: 3, borderRadius: 2, background: color, marginTop: 10 }} />
    </div>
  );
}

function NotesPanel({ topicId, color }) {
  const { progress, saveNote } = useProgressCtx();
  const [note, setNote] = useState(progress.notes[topicId] || '');
  const [saved, setSaved] = useState(false);
  const save = () => { saveNote(topicId, note); setSaved(true); setTimeout(() => setSaved(false), 1500); };
  return (
    <div className="surface" style={{ padding: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: T.t0, marginBottom: 10 }}>📝 Your notes</div>
      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Jot down observations, mnemonics, or questions…"
        style={{ width: '100%', minHeight: 110, background: T.s2, border: `1px solid ${T.bd}`, borderRadius: 10, padding: 12, color: T.t1, fontSize: 13.5, fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <span style={{ fontSize: 11, color: T.t3 }}>{note.length} chars · saved locally</span>
        <button onClick={save} className="btn3 btn3-solid" style={{ height: 36, padding: '0 16px', fontSize: 13, background: saved ? T.gn : T.t0 }}>{saved ? '✓ Saved' : 'Save note'}</button>
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'visual',   label: 'Visual' },
  { id: 'concepts', label: 'Key concepts' },
  { id: 'code',     label: 'Code' },
  { id: 'quiz',     label: 'Quiz' },
  { id: 'practice', label: 'Practice' },
  { id: 'notes',    label: 'Notes' },
];

export default function TopicPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = getTopicById(topicId);
  const [active, setActive] = useState('overview');
  const [quizDone, setQuizDone] = useState(false);
  const bodyRef = useRef(null);
  const { progress, markTopicRead, toggleBookmark, completeQuiz } = useProgressCtx();

  useEffect(() => { window.scrollTo(0, 0); setQuizDone(false); }, [topicId]);

  useEffect(() => {
    if (bodyRef.current) gsap.fromTo(bodyRef.current.children, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' });
  }, [topicId]);

  // scroll-spy
  useEffect(() => {
    const ids = SECTIONS.map(s => s.id);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [topicId]);

  if (!topic) return (
    <div style={{ color: T.t2, padding: 60, textAlign: 'center' }}>
      Topic not found. <Link to="/" style={{ color: T.cy }}>Go home</Link>
    </div>
  );

  const cat = getCategoryById(topic.cat);
  const catTopics = TOPICS.filter(t => t.cat === topic.cat);
  const curIdx = catTopics.findIndex(t => t.id === topic.id);
  const prevTopic = catTopics[curIdx - 1];
  const nextTopic = catTopics[curIdx + 1];
  const challenges = getChallengesByTopic(topic.id);
  const quizzes = getQuizzesByTopic(topic.id);
  const isRead = progress.topicsRead.includes(topic.id);
  const isBookmarked = progress.bookmarks.includes(topic.id);
  const c = topic.color;
  const mins = readingTime(topic);

  const handleQuizComplete = (score, total) => {
    setQuizDone(true);
    quizzes.forEach((q, i) => { if (i < score) completeQuiz(q.id, q.xp, score, total); });
  };

  const jump = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  const availableSections = SECTIONS.filter(s =>
    !(s.id === 'quiz' && quizzes.length === 0) && !(s.id === 'practice' && challenges.length === 0));

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 20px 80px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 7, alignItems: 'center', padding: '18px 0 16px', fontSize: 12.5, color: T.t2, flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: T.t2, textDecoration: 'none' }} className="link-underline">Home</Link>
        <span style={{ color: T.t3 }}>/</span>
        <Link to={`/category/${cat?.id}`} style={{ color: T.t2, textDecoration: 'none' }} className="link-underline">{cat?.label}</Link>
        <span style={{ color: T.t3 }}>/</span>
        <span style={{ color: T.t1 }}>{topic.title}</span>
      </div>

      {/* Two-column layout: sticky nav + content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 28 }} className="topic-grid">
        <div style={{ display: 'grid', gridTemplateColumns: '220px minmax(0,1fr)', gap: 36 }} className="topic-inner">

          {/* Sticky chapter / section nav */}
          <aside className="hide-mobile" style={{ position: 'sticky', top: 80, alignSelf: 'start', height: 'fit-content' }}>
            <div style={{ fontSize: 11, color: T.t3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>On this page</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 22 }}>
              {availableSections.map(s => (
                <button key={s.id} onClick={() => jump(s.id)}
                  style={{ textAlign: 'left', padding: '6px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                    background: active === s.id ? T.s2 : 'transparent', color: active === s.id ? T.t0 : T.t2,
                    borderLeft: `2px solid ${active === s.id ? c : 'transparent'}`, transition: 'all .15s' }}>
                  {s.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 11, color: T.t3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>{cat?.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 280, overflowY: 'auto' }}>
              {catTopics.map(t => (
                <Link key={t.id} to={`/topic/${t.id}`} style={{ padding: '5px 10px', borderRadius: 7, fontSize: 12.5, textDecoration: 'none',
                  color: t.id === topic.id ? c : T.t2, background: t.id === topic.id ? c + '14' : 'transparent', fontWeight: t.id === topic.id ? 600 : 400 }}>
                  {progress.topicsRead.includes(t.id) ? '✓ ' : ''}{t.title}
                </Link>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <article ref={bodyRef} style={{ minWidth: 0 }}>
            {/* Header */}
            <header style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <span className="chip" style={{ color: c, borderColor: c + '33' }}>{cat?.icon} {cat?.label}</span>
                <span className="chip">⏱ {mins} min read</span>
                {topic.viz && topic.viz !== 'none' && <span className="chip" style={{ color: T.gn, borderColor: T.gn + '33' }}>▶ interactive</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: c + '14', border: `1px solid ${c}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{topic.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h1 className="h-display" style={{ margin: 0, fontSize: 'clamp(26px, 4vw, 38px)', color: T.t0 }}>{topic.title}</h1>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                    {topic.tags.map(t => <span key={t} className="chip" style={{ fontSize: 10.5 }}>{t}</span>)}
                  </div>
                </div>
              </div>
              {/* Action row */}
              <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
                <button onClick={() => markTopicRead(topic.id)} disabled={isRead} className={`btn3 ${isRead ? 'btn3-line' : 'btn3-solid'}`}
                  style={{ height: 40, padding: '0 18px', fontSize: 13, color: isRead ? T.gn : undefined, borderColor: isRead ? T.gn + '40' : undefined, cursor: isRead ? 'default' : 'pointer' }}>
                  {isRead ? '✓ Completed' : 'Mark complete · +15 XP'}
                </button>
                <button onClick={() => toggleBookmark(topic.id)} className="btn3 btn3-line" style={{ height: 40, padding: '0 16px', fontSize: 13, color: isBookmarked ? T.ye : T.t1, borderColor: isBookmarked ? T.ye + '40' : T.bd }}>
                  {isBookmarked ? '★ Saved' : '☆ Save'}
                </button>
              </div>
            </header>

            {/* OVERVIEW */}
            <section id="overview" style={{ marginBottom: 40, scrollMarginTop: 80 }}>
              <p style={{ fontSize: 17, lineHeight: 1.75, color: T.t1, margin: 0, fontWeight: 400 }}>{topic.overview}</p>
              <div className="surface" style={{ marginTop: 18, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: T.t3, textTransform: 'uppercase', letterSpacing: '.08em' }}>Complexity</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: c }}>{topic.complexity}</span>
              </div>
            </section>

            {/* VISUAL */}
            <section id="visual" style={{ marginBottom: 40, scrollMarginTop: 80 }}>
              <SectionTitle kicker="See it move" title="Visual learning" color={c} />
              <ConceptViz topic={topic} />
            </section>

            {/* KEY CONCEPTS */}
            <section id="concepts" style={{ marginBottom: 40, scrollMarginTop: 80 }}>
              <SectionTitle kicker={`${topic.points.length} ideas`} title="Key concepts" color={c} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {topic.points.map((pt, i) => (
                  <div key={i} className="card3" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{ width: 30, height: 30, borderRadius: 9, background: c + '14', border: `1px solid ${c}30`, color: c, fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-display)' }}>{i + 1}</div>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ margin: '3px 0 7px', fontSize: 15.5, fontWeight: 700, color: T.t0 }}>{pt.t}</h3>
                        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.72, color: T.t2 }}>{pt.d}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CODE */}
            <section id="code" style={{ marginBottom: 40, scrollMarginTop: 80 }}>
              <SectionTitle kicker="Reference implementation" title="Code" color={c} />
              <CodeBlock code={topic.code} />
            </section>

            {/* QUIZ */}
            {quizzes.length > 0 && (
              <section id="quiz" style={{ marginBottom: 40, scrollMarginTop: 80 }}>
                <SectionTitle kicker="Check yourself" title={`Quiz · ${quizzes.length} questions`} color={c} />
                {quizDone ? (
                  <div className="surface" style={{ textAlign: 'center', padding: '32px 20px' }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: T.gn, marginBottom: 12 }}>Quiz complete!</div>
                    <button onClick={() => setQuizDone(false)} className="btn3 btn3-line" style={{ height: 38 }}>Retake</button>
                  </div>
                ) : <QuizBlock questions={quizzes} topicColor={c} onComplete={handleQuizComplete} />}
              </section>
            )}

            {/* PRACTICE */}
            {challenges.length > 0 && (
              <section id="practice" style={{ marginBottom: 40, scrollMarginTop: 80 }}>
                <SectionTitle kicker="Apply it" title="Practice challenges" color={c} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                  {challenges.map(ch => (
                    <Link key={ch.id} to={`/challenge/${ch.id}`} className="card3 card3-ac" style={{ '--ac': DIFFICULTY_COLOR[ch.difficulty], textDecoration: 'none', padding: 16, color: 'inherit' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: DIFFICULTY_COLOR[ch.difficulty], textTransform: 'capitalize', fontWeight: 600 }}>{ch.difficulty}</span>
                        <span style={{ fontSize: 10.5, color: T.t3 }}>+{ch.xp} XP</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.t0 }}>{ch.title}</div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* NOTES */}
            <section id="notes" style={{ marginBottom: 8, scrollMarginTop: 80 }}>
              <SectionTitle kicker="Make it yours" title="Notes" color={c} />
              <NotesPanel topicId={topic.id} color={c} />
            </section>

            {/* Prev / Next */}
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              {prevTopic ? (
                <button onClick={() => navigate(`/topic/${prevTopic.id}`)} className="card3" style={{ flex: 1, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', border: `1px solid ${T.bd}`, background: T.s1, fontFamily: 'inherit' }}>
                  <div style={{ fontSize: 11, color: T.t3, marginBottom: 3 }}>← Previous</div>
                  <div style={{ fontSize: 13.5, color: T.t0, fontWeight: 600 }}>{prevTopic.title}</div>
                </button>
              ) : <div style={{ flex: 1 }} />}
              {nextTopic ? (
                <button onClick={() => navigate(`/topic/${nextTopic.id}`)} className="card3" style={{ flex: 1, padding: '14px 16px', cursor: 'pointer', textAlign: 'right', border: `1px solid ${T.bd}`, background: T.s1, fontFamily: 'inherit' }}>
                  <div style={{ fontSize: 11, color: T.t3, marginBottom: 3 }}>Next →</div>
                  <div style={{ fontSize: 13.5, color: T.t0, fontWeight: 600 }}>{nextTopic.title}</div>
                </button>
              ) : <div style={{ flex: 1 }} />}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
