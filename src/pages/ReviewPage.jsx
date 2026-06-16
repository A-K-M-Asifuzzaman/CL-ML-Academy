import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext.jsx';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition.js';
import { TOPICS } from '../data/topics.js';
import { T } from '../theme.js';

const CAT_LABELS = {
  dsa: 'Data Structures & Algorithms',
  algo: 'Algorithms',
  ds: 'Data Structures',
  complex: 'Complexity',
  sys: 'Systems',
  net: 'Networking',
  db: 'Databases',
  math: 'Math',
  ml: 'Machine Learning',
  dl: 'Deep Learning',
  nlp: 'NLP',
  cv: 'Computer Vision',
  mlops: 'MLOps',
};

export default function ReviewPage() {
  const { user } = useAuth();
  const {
    cards, dueCards, addCard, reviewCard, removeCard, isDue, getCard
  } = useSpacedRepetition(user?.id);

  const [mobile, setMobile] = useState(window.innerWidth < 768);
  const [mode, setMode] = useState('browse'); // 'browse' | 'review'
  const [sessionQueue, setSessionQueue] = useState([]);
  const [sessionIdx, setSessionIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState([]);
  const [activeTab, setActiveTab] = useState('deck'); // 'deck' | 'all'

  const cardRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animate list entries on mount / tab switch
  useEffect(() => {
    if (listRef.current) {
      const items = listRef.current.querySelectorAll('[data-topic-item]');
      if (items.length) {
        gsap.fromTo(items,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.04, duration: 0.3, ease: 'power2.out' }
        );
      }
    }
  }, [activeTab, mode]);

  const currentCard = sessionQueue[sessionIdx] || null;
  const currentTopic = currentCard
    ? TOPICS.find(t => t.id === currentCard.topicId)
    : null;

  const startReview = useCallback(() => {
    if (!dueCards.length) return;
    setSessionQueue([...dueCards]);
    setSessionIdx(0);
    setSessionDone([]);
    setFlipped(false);
    setMode('review');
  }, [dueCards]);

  const flipCard = useCallback(() => {
    if (flipped || !cardRef.current) return;
    const front = frontRef.current;
    const back  = backRef.current;
    gsap.to(front, { rotateY: 90, duration: 0.2, ease: 'power2.in', onComplete: () => {
      front.style.display = 'none';
      back.style.display = 'flex';
      gsap.fromTo(back, { rotateY: -90 }, { rotateY: 0, duration: 0.2, ease: 'power2.out' });
    }});
    setFlipped(true);
  }, [flipped]);

  const rateCard = useCallback((quality) => {
    if (!currentCard) return;
    reviewCard(currentCard.topicId, quality);
    setSessionDone(d => [...d, currentCard.topicId]);

    const nextIdx = sessionIdx + 1;
    if (nextIdx >= sessionQueue.length) {
      // Session complete
      setMode('done');
      return;
    }

    // Animate out → next card
    gsap.to(cardRef.current, {
      x: quality >= 3 ? 120 : -120,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setSessionIdx(nextIdx);
        setFlipped(false);
        if (frontRef.current) frontRef.current.style.display = 'flex';
        if (backRef.current)  backRef.current.style.display  = 'none';
        gsap.fromTo(cardRef.current,
          { x: quality >= 3 ? -60 : 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }
        );
      }
    });
  }, [currentCard, reviewCard, sessionIdx, sessionQueue]);

  // ── styles ──────────────────────────────────────────────────────────────
  const page = {
    minHeight: '100vh',
    background: T.bg,
    color: T.t0,
    fontFamily: 'monospace',
    padding: mobile ? '16px 12px' : '32px 24px',
    maxWidth: 960,
    margin: '0 auto',
  };

  const pill = (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 700,
    background: color + '22',
    color,
    border: `1px solid ${color}55`,
  });

  const btn = (color, outlined) => ({
    padding: '10px 20px',
    borderRadius: 8,
    border: outlined ? `1px solid ${color}` : 'none',
    background: outlined ? 'transparent' : color,
    color: outlined ? color : T.bg,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'monospace',
    transition: 'opacity 0.15s',
  });

  const statBox = {
    background: T.s1,
    border: `1px solid ${T.bd}`,
    borderRadius: 10,
    padding: mobile ? '10px 14px' : '12px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    minWidth: 72,
  };

  // ── REVIEW MODE ──────────────────────────────────────────────────────────
  if (mode === 'review' && currentTopic) {
    const overview = currentTopic.overview || '';
    const descText = typeof overview === 'string'
      ? overview.split('.')[0] + '.'
      : (currentTopic.title + ' — review this topic.');

    return (
      <div style={page}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => setMode('browse')} style={{ ...btn(T.t2, true), padding: '6px 14px' }}>
            ← Back
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: T.t2 }}>
              Card {sessionIdx + 1} of {sessionQueue.length}
            </div>
            {/* Progress bar */}
            <div style={{ height: 4, background: T.s2, borderRadius: 99, marginTop: 6 }}>
              <div style={{
                height: '100%',
                width: `${((sessionIdx) / sessionQueue.length) * 100}%`,
                background: T.cy,
                borderRadius: 99,
                transition: 'width 0.3s',
              }} />
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div ref={cardRef} style={{ perspective: 1000 }}>
          {/* Front */}
          <div
            ref={frontRef}
            onClick={flipCard}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              minHeight: mobile ? 260 : 320,
              background: T.s1,
              border: `1px solid ${currentTopic.color}55`,
              borderRadius: 16,
              padding: 32,
              cursor: 'pointer',
              boxShadow: `0 0 32px ${currentTopic.color}22`,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: mobile ? 40 : 56 }}>{currentTopic.icon || '📖'}</div>
            <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 700, color: currentTopic.color }}>
              {currentTopic.title}
            </div>
            <div style={pill(currentTopic.color)}>
              {CAT_LABELS[currentTopic.cat] || currentTopic.cat}
            </div>
            {currentTopic.tags && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 8 }}>
                {currentTopic.tags.slice(0, 4).map(tag => (
                  <span key={tag} style={{ ...pill(T.t3), fontSize: 10 }}>{tag}</span>
                ))}
              </div>
            )}
            <div style={{ marginTop: 16, color: T.t3, fontSize: 13 }}>
              Tap to reveal
            </div>
          </div>

          {/* Back */}
          <div
            ref={backRef}
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: 20,
              minHeight: mobile ? 260 : 320,
              background: T.s2,
              border: `1px solid ${currentTopic.color}88`,
              borderRadius: 16,
              padding: 32,
              boxShadow: `0 0 32px ${currentTopic.color}33`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>{currentTopic.icon || '📖'}</span>
              <span style={{ fontWeight: 700, color: currentTopic.color, fontSize: 18 }}>
                {currentTopic.title}
              </span>
            </div>
            <div style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: T.t1,
              background: T.s1,
              borderRadius: 10,
              padding: 16,
              maxHeight: 160,
              overflowY: 'auto',
            }}>
              {descText}
            </div>
            {currentTopic.complexity && (
              <div style={{ fontSize: 11, color: T.t2, background: T.s1, borderRadius: 8, padding: '8px 12px' }}>
                <span style={{ color: T.cy, fontWeight: 700 }}>Complexity: </span>
                {currentTopic.complexity}
              </div>
            )}

            {/* Rating buttons */}
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: 12, color: T.t2, marginBottom: 10, textAlign: 'center' }}>
                How well did you know this?
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { q: 1, label: 'Again', color: T.rd },
                  { q: 3, label: 'Hard',  color: T.or },
                  { q: 4, label: 'Good',  color: T.gn },
                  { q: 5, label: 'Easy',  color: T.cy },
                ].map(({ q, label, color }) => (
                  <button
                    key={q}
                    onClick={() => rateCard(q)}
                    style={{
                      ...btn(color),
                      padding: mobile ? '10px 16px' : '12px 24px',
                      fontSize: mobile ? 13 : 15,
                      minWidth: mobile ? 72 : 90,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── SESSION DONE ─────────────────────────────────────────────────────────
  if (mode === 'done') {
    return (
      <div style={{ ...page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div style={{ fontSize: 72 }}>🎉</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>Session Complete!</div>
        <div style={{ color: T.t1, fontSize: 15 }}>
          You reviewed {sessionDone.length} card{sessionDone.length !== 1 ? 's' : ''}.
        </div>
        <button onClick={() => setMode('browse')} style={btn(T.cy)}>
          Back to Deck
        </button>
      </div>
    );
  }

  // ── BROWSE MODE ──────────────────────────────────────────────────────────
  const displayTopics = activeTab === 'deck'
    ? TOPICS.filter(t => cards.find(c => c.topicId === t.id))
    : TOPICS;

  return (
    <div style={page}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: mobile ? 22 : 28, fontWeight: 700, letterSpacing: -0.5 }}>
          📚 Spaced Review
        </h1>
        <div style={{ color: T.t2, fontSize: 13, marginTop: 4 }}>
          SM-2 spaced repetition — study smarter, not harder
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={statBox}>
          <div style={{ fontSize: 22, fontWeight: 700, color: dueCards.length > 0 ? T.rd : T.gn }}>
            {dueCards.length}
          </div>
          <div style={{ fontSize: 11, color: T.t2 }}>Due Today</div>
        </div>
        <div style={statBox}>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.cy }}>{cards.length}</div>
          <div style={{ fontSize: 11, color: T.t2 }}>Total Cards</div>
        </div>
        <div style={statBox}>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.or }}>
            {TOPICS.length}
          </div>
          <div style={{ fontSize: 11, color: T.t2 }}>Topics Available</div>
        </div>
        {dueCards.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
            <button onClick={startReview} style={{ ...btn(T.cy), fontSize: mobile ? 13 : 15 }}>
              ▶ Start Review ({dueCards.length})
            </button>
          </div>
        )}
      </div>

      {/* Empty state — no cards */}
      {cards.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: T.s1,
          borderRadius: 16,
          border: `1px solid ${T.bd}`,
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Your deck is empty</div>
          <div style={{ color: T.t2, fontSize: 14 }}>
            Add topics below to start reviewing them with spaced repetition.
          </div>
        </div>
      )}

      {/* All caught up */}
      {cards.length > 0 && dueCards.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '24px 20px',
          background: T.gn + '11',
          borderRadius: 16,
          border: `1px solid ${T.gn}44`,
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
          <div style={{ fontWeight: 700, fontSize: 18, color: T.gn }}>All caught up!</div>
          <div style={{ color: T.t2, fontSize: 14, marginTop: 4 }}>
            No cards due today. Come back tomorrow!
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: `1px solid ${T.bd}` }}>
        {[
          { key: 'deck', label: `My Deck (${cards.length})` },
          { key: 'all',  label: `All Topics (${TOPICS.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 18px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.key ? `2px solid ${T.cy}` : '2px solid transparent',
              color: activeTab === tab.key ? T.cy : T.t2,
              fontFamily: 'monospace',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Topic grid */}
      <div
        ref={listRef}
        style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}
      >
        {displayTopics.map(topic => {
          const card = getCard(topic.id);
          const inDeck = !!card;
          const due = isDue(topic.id);
          return (
            <div
              key={topic.id}
              data-topic-item
              style={{
                background: T.s1,
                border: `1px solid ${inDeck ? (due ? topic.color : T.bd) : T.bd}`,
                borderRadius: 12,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: inDeck && due ? `0 0 12px ${topic.color}22` : 'none',
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{topic.icon || '📖'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: topic.color,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {topic.title}
                </div>
                <div style={{ fontSize: 11, color: T.t3, marginTop: 2 }}>
                  {CAT_LABELS[topic.cat] || topic.cat}
                </div>
                {card && (
                  <div style={{ fontSize: 10, color: T.t2, marginTop: 4 }}>
                    Next: {card.nextReview} · EF: {card.ef.toFixed(1)}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                {due && inDeck && (
                  <span style={{ ...pill(T.rd), fontSize: 10 }}>DUE</span>
                )}
                {inDeck && !due && (
                  <span style={{ ...pill(T.gn), fontSize: 10 }}>IN DECK</span>
                )}
                <button
                  onClick={() => inDeck ? removeCard(topic.id) : addCard(topic.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: `1px solid ${inDeck ? T.rd : topic.color}`,
                    background: 'transparent',
                    color: inDeck ? T.rd : topic.color,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                  }}
                >
                  {inDeck ? '− Remove' : '+ Add'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
