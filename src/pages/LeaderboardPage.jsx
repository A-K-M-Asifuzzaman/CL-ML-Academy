import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { db } from '../firebase.js';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.jsx';
import { useProgressCtx } from '../context/ProgressContext.jsx';
import { T } from '../theme.js';

const MEDAL_COLORS = ['#ffd700', '#c0c0c0', '#cd7f32'];
const MEDAL_LABELS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { progress, level } = useProgressCtx();
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const listRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    if (!db) {
      setError('Leaderboard requires internet connection');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, 'leaderboard'),
        orderBy('xp', 'desc'),
        limit(50)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((d, i) => ({
        id: d.id,
        rank: i + 1,
        ...d.data(),
      }));
      setEntries(data);
    } catch (err) {
      setError('Could not load leaderboard. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard, refreshKey]);

  // Animate entries after they load
  useEffect(() => {
    if (!loading && entries.length && listRef.current) {
      const rows = listRef.current.querySelectorAll('[data-lb-row]');
      gsap.fromTo(rows,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.04, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [loading, entries]);

  // Find current user's rank
  const myEntry = entries.find(e => e.id === user?.id);
  const myRank = myEntry?.rank ?? null;

  // ── styles ────────────────────────────────────────────────────────────────
  const page = {
    minHeight: '100vh',
    color: T.t0,
    fontFamily: 'var(--font-sans)',
    padding: mobile ? '16px 14px 80px' : '30px 24px 90px',
    maxWidth: 820,
    margin: '0 auto',
  };

  const pill = (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: 99,
    fontSize: 10,
    fontWeight: 700,
    background: color + '22',
    color,
    border: `1px solid ${color}55`,
  });

  const btn = (color) => ({
    padding: '8px 18px',
    borderRadius: 8,
    border: 'none',
    background: color,
    color: T.bg,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'monospace',
  });

  const SkeletonRow = ({ i }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 16px',
      background: T.s1,
      borderRadius: 10,
      marginBottom: 8,
      opacity: 1 - i * 0.12,
    }}>
      <div style={{ width: 28, height: 14, background: T.bd, borderRadius: 4 }} />
      <div style={{ width: 36, height: 36, background: T.bd, borderRadius: '50%' }} />
      <div style={{ flex: 1 }}>
        <div style={{ width: '40%', height: 12, background: T.bd, borderRadius: 4, marginBottom: 6 }} />
        <div style={{ width: '25%', height: 10, background: T.s2, borderRadius: 4 }} />
      </div>
      <div style={{ width: 60, height: 14, background: T.bd, borderRadius: 4 }} />
    </div>
  );

  return (
    <div style={page}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: mobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 24, flexDirection: mobile ? 'column' : 'row' }}>
        <div>
          <div className="kicker" style={{ marginBottom: 8 }}>Global ranking</div>
          <h1 className="h-display" style={{ margin: 0, fontSize: mobile ? 26 : 34, color: T.t0 }}>Leaderboard</h1>
          <div style={{ color: T.t2, fontSize: 13.5, marginTop: 6 }}>Top learners ranked by XP</div>
        </div>
        <button onClick={() => setRefreshKey(k => k + 1)} className="btn3 btn3-line" style={{ height: 40 }} disabled={loading}>
          {loading ? '⟳ Loading…' : '⟳ Refresh'}
        </button>
      </div>

      {/* My rank banner */}
      {user && myEntry && (
        <div className="ring-card spotlight" style={{ '--ac': T.cy, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: T.cy + '16', color: T.cy, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontFamily: 'var(--font-display)' }}>#{myRank}</div>
          <div>
            <div style={{ color: T.t0, fontWeight: 700, fontSize: 14 }}>Your rank</div>
            <div style={{ color: T.t2, fontSize: 12.5, marginTop: 1 }}>{progress.xp.toLocaleString()} XP · {level.name}</div>
          </div>
        </div>
      )}

      {/* Error / no-db state */}
      {error && (
        <div style={{
          background: T.rd + '11',
          border: `1px solid ${T.rd}44`,
          borderRadius: 12,
          padding: '20px 24px',
          textAlign: 'center',
          color: T.rd,
          fontSize: 14,
        }}>
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && !error && (
        <div>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonRow key={i} i={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && entries.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          background: T.s1,
          borderRadius: 16,
          border: `1px solid ${T.bd}`,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No entries yet</div>
          <div style={{ color: T.t2, fontSize: 14 }}>
            Be the first to earn XP and appear here!
          </div>
        </div>
      )}

      {/* Leaderboard list */}
      {!loading && !error && entries.length > 0 && (
        <div ref={listRef}>
          {entries.map((entry) => {
            const isMe = entry.id === user?.id;
            const isTop3 = entry.rank <= 3;
            const medalColor = isTop3 ? MEDAL_COLORS[entry.rank - 1] : null;

            return (
              <div
                key={entry.id}
                data-lb-row
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: mobile ? '12px 12px' : '14px 18px',
                  background: isMe ? T.cy + '11' : (isTop3 ? T.s2 : T.s1),
                  border: `1px solid ${isMe ? T.cy + '66' : (isTop3 ? medalColor + '44' : T.bd)}`,
                  borderRadius: 10,
                  marginBottom: 8,
                  boxShadow: isTop3 ? `0 0 16px ${medalColor}22` : 'none',
                  position: 'relative',
                }}
              >
                {/* Rank */}
                <div style={{
                  width: 32,
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: isTop3 ? 20 : 15,
                  color: medalColor || T.t2,
                  flexShrink: 0,
                }}>
                  {isTop3 ? MEDAL_LABELS[entry.rank - 1] : `#${entry.rank}`}
                </div>

                {/* Avatar */}
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: T.s3,
                  border: `2px solid ${isMe ? T.cy : (medalColor || T.bd)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                  overflow: 'hidden',
                }}>
                  {entry.avatar && entry.avatar.startsWith('http') ? (
                    <img src={entry.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>{entry.avatar || '🧑‍💻'}</span>
                  )}
                </div>

                {/* Name + level */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: mobile ? 13 : 15,
                    color: isMe ? T.cy : T.t0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {entry.displayName || 'Anonymous'}
                  </div>
                  <div style={{ fontSize: 11, color: T.t2, marginTop: 2 }}>
                    Level {entry.level || 1}
                  </div>
                </div>

                {/* XP */}
                <div style={{
                  textAlign: 'right',
                  flexShrink: 0,
                }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: mobile ? 14 : 16,
                    color: medalColor || (isMe ? T.cy : T.t0),
                  }}>
                    {(entry.xp || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 10, color: T.t3 }}>XP</div>
                </div>

                {/* YOU badge */}
                {isMe && (
                  <span style={{ ...pill(T.cy), marginLeft: 4 }}>YOU</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
