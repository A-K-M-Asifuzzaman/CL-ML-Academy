import { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { T } from '../theme.js';
import { getTopicById, TOPICS } from '../data/topics.js';
import { getCategoryById } from '../data/categories.js';
import { getChallengesByTopic } from '../data/challenges.js';
import { getQuizzesByTopic } from '../data/quizzes.js';
import { DIFFICULTY_COLOR } from '../data/challenges.js';
import { CodeBlock, Badge, PointCard } from '../components/UI.jsx';
import VizBlock from '../components/VizBlock.jsx';
import QuizBlock from '../components/QuizBlock.jsx';
import { useProgressCtx } from '../context/ProgressContext.jsx';

function NotesPanel({ topicId, color }) {
  const { progress, saveNote } = useProgressCtx();
  const [note, setNote] = useState(progress.notes[topicId] || '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    saveNote(topicId, note);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div style={{ padding: 16, background: T.s1, borderRadius: 10, border: `1px solid ${T.bd}` }}>
      <div style={{ fontSize: 11, color: T.t3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>📝 Personal Notes</div>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Write your own notes, observations, or memory tricks here..."
        style={{ width: '100%', minHeight: 120, background: T.s2, border: `1px solid ${T.bd}`, borderRadius: 8, padding: 12, color: T.t1, fontSize: 13, fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6 }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <span style={{ fontSize: 11, color: T.t3 }}>{note.length} chars</span>
        <button onClick={save} style={{ padding: '5px 14px', borderRadius: 7, background: saved ? T.gn + 'cc' : color + 'cc', color: T.bg, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit', transition: 'all .15s' }}>
          {saved ? '✓ Saved!' : 'Save Note'}
        </button>
      </div>
    </div>
  );
}

export default function TopicPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = getTopicById(topicId);
  const [tab, setTab] = useState('overview');
  const [quizDone, setQuizDone] = useState(false);

  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const { progress, markTopicRead, toggleBookmark, completeQuiz } = useProgressCtx();

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
    }
  }, [topicId]);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    }
  }, [tab]);

  if (!topic) return (
    <div style={{ color: T.t2, padding: 40, textAlign: 'center' }}>
      Topic not found. <Link to="/" style={{ color: T.cy }}>Go Home</Link>
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

  const handleMarkRead = () => {
    markTopicRead(topic.id);
    gsap.to('.read-btn', { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1 });
  };

  const tabs = [
    { id: 'overview',    label: '📖 Overview' },
    ...(topic.viz && topic.viz !== 'none' ? [{ id: 'visualizer', label: '▶ Visualizer' }] : []),
    { id: 'code',        label: '{ } Code' },
    ...(quizzes.length  > 0 ? [{ id: 'quiz',       label: `📝 Quiz (${quizzes.length})` }] : []),
    ...(challenges.length > 0 ? [{ id: 'challenges', label: `⚔️ Practice (${challenges.length})` }] : []),
    { id: 'notes',       label: '📝 Notes' },
  ];

  const handleQuizComplete = (score, total, xp) => {
    setQuizDone(true);
    quizzes.forEach((q, i) => {
      if (i < score) completeQuiz(q.id, q.xp, score, total);
    });
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px 60px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '18px 0 14px', fontSize: 12, color: T.t2 }}>
        <Link to="/" style={{ color: T.t2, textDecoration: 'none' }}>Home</Link>
        <span>›</span>
        <Link to={`/category/${cat?.id}`} style={{ color: cat?.color, textDecoration: 'none' }}>{cat?.label}</Link>
        <span>›</span>
        <span style={{ color: T.t0 }}>{topic.title}</span>
      </div>

      {/* Header */}
      <div ref={headerRef} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 36, flexShrink: 0 }}>{topic.icon}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: topic.color }}>{topic.title}</h1>
            {topic.tags.map(t => <Badge key={t} text={t} color={topic.color} />)}
          </div>
          <div style={{ fontSize: 11, color: T.t3 }}>{cat?.icon} {cat?.label}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={() => toggleBookmark(topic.id)} title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${isBookmarked ? T.ye : T.bd}`, background: isBookmarked ? T.ye + '15' : 'transparent', color: isBookmarked ? T.ye : T.t3, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isBookmarked ? '★' : '☆'}
          </button>
          <button className="read-btn" onClick={handleMarkRead} disabled={isRead}
            style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${isRead ? T.gn + '50' : T.bd}`, background: isRead ? T.gn + '15' : 'transparent', color: isRead ? T.gn : T.t2, cursor: isRead ? 'default' : 'pointer', fontSize: 11, fontWeight: isRead ? 700 : 400, fontFamily: 'inherit', transition: 'all .15s' }}>
            {isRead ? '✓ Read (+15 XP)' : 'Mark as Read'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `1px solid ${T.bd}`, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '8px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap',
              color: tab === t.id ? topic.color : T.t2,
              borderBottom: `2px solid ${tab === t.id ? topic.color : 'transparent'}`,
              fontWeight: tab === t.id ? 600 : 400, transition: 'all .15s', fontFamily: 'inherit' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div ref={contentRef}>
        {tab === 'overview' && (
          <div>
            <div style={{ padding: 16, background: T.s1, borderRadius: 10, border: `1px solid ${T.bd}`, marginBottom: 18 }}>
              <p style={{ margin: 0, fontSize: 14, color: T.t1, lineHeight: 1.8 }}>{topic.overview}</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: T.t2, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>⏱ Complexity</div>
              <div style={{ padding: '8px 14px', background: T.s2, borderRadius: 8, border: `1px solid ${T.bd}`, fontFamily: 'var(--font-mono)', fontSize: 12, color: topic.color }}>{topic.complexity}</div>
            </div>
            <div style={{ fontSize: 11, color: T.t2, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Key Concepts</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topic.points.map((pt, i) => <PointCard key={i} point={pt} index={i} color={topic.color} />)}
            </div>

            {challenges.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 11, color: T.t2, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>⚔️ Practice Challenges</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                  {challenges.map(c => (
                    <Link key={c.id} to={`/challenge/${c.id}`} style={{ textDecoration: 'none', padding: 14, borderRadius: 10, background: T.s1, border: `1px solid ${DIFFICULTY_COLOR[c.difficulty]}25`, display: 'block', transition: 'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = DIFFICULTY_COLOR[c.difficulty] + '60'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = DIFFICULTY_COLOR[c.difficulty] + '25'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: DIFFICULTY_COLOR[c.difficulty], textTransform: 'capitalize', fontWeight: 600 }}>{c.difficulty}</span>
                        <span style={{ fontSize: 10, color: T.t3 }}>+{c.xp} XP</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.t0 }}>{c.title}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'visualizer' && <div><VizBlock topic={topic} /></div>}

        {tab === 'code' && <div><CodeBlock code={topic.code} /></div>}

        {tab === 'quiz' && (
          <div>
            {quizDone ? (
              <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.gn, marginBottom: 8 }}>Quiz Complete!</div>
                <button onClick={() => setQuizDone(false)} style={{ padding: '9px 20px', borderRadius: 9, background: topic.color + 'cc', color: T.bg, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
                  Retake Quiz
                </button>
              </div>
            ) : (
              <QuizBlock questions={quizzes} topicColor={topic.color} onComplete={handleQuizComplete} />
            )}
          </div>
        )}

        {tab === 'challenges' && (
          <div>
            <p style={{ fontSize: 13, color: T.t2, marginTop: 0, marginBottom: 16 }}>Practice coding challenges for {topic.title}.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {challenges.map(c => (
                <Link key={c.id} to={`/challenge/${c.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 10, background: T.s1, border: `1px solid ${T.bd}`, transition: 'all .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = DIFFICULTY_COLOR[c.difficulty] + '50'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.bd; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: T.t0 }}>{c.title}</span>
                      <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 8, background: DIFFICULTY_COLOR[c.difficulty] + '15', color: DIFFICULTY_COLOR[c.difficulty], border: `1px solid ${DIFFICULTY_COLOR[c.difficulty]}25`, textTransform: 'capitalize' }}>{c.difficulty}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {c.tags.slice(0, 3).map(t => <span key={t} style={{ fontSize: 9, color: T.t3 }}>{t}</span>)}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: DIFFICULTY_COLOR[c.difficulty], fontWeight: 700 }}>+{c.xp} XP →</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {tab === 'notes' && <NotesPanel topicId={topic.id} color={topic.color} />}
      </div>

      {/* Prev / Next navigation */}
      <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
        {prevTopic ? (
          <button onClick={() => navigate(`/topic/${prevTopic.id}`)}
            style={{ flex: 1, padding: '10px 16px', borderRadius: 9, border: `1px solid ${T.bd}`, background: T.s1, color: T.t1, cursor: 'pointer', textAlign: 'left', fontSize: 12, fontFamily: 'inherit', transition: 'all .15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = prevTopic.color + '50'}
            onMouseLeave={e => e.currentTarget.style.borderColor = T.bd}>
            ← <span style={{ color: prevTopic.color, fontWeight: 600 }}>{prevTopic.title}</span>
          </button>
        ) : <div style={{ flex: 1 }} />}
        {nextTopic ? (
          <button onClick={() => navigate(`/topic/${nextTopic.id}`)}
            style={{ flex: 1, padding: '10px 16px', borderRadius: 9, border: `1px solid ${T.bd}`, background: T.s1, color: T.t1, cursor: 'pointer', textAlign: 'right', fontSize: 12, fontFamily: 'inherit', transition: 'all .15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = nextTopic.color + '50'}
            onMouseLeave={e => e.currentTarget.style.borderColor = T.bd}>
            <span style={{ color: nextTopic.color, fontWeight: 600 }}>{nextTopic.title}</span> →
          </button>
        ) : <div style={{ flex: 1 }} />}
      </div>
    </div>
  );
}
