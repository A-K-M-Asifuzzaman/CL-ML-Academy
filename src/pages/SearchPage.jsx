import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { T } from '../theme.js';
import { TOPICS } from '../data/topics.js';
import { CATEGORIES } from '../data/categories.js';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filter, setFilter] = useState('all');

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return TOPICS.filter(t => {
      const matchQ = !q || t.title.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)) || t.overview.toLowerCase().includes(q);
      const matchF = filter === 'all' || t.cat === filter;
      return matchQ && matchF;
    });
  }, [query, filter]);

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '28px 20px 90px' }}>
      <div className="kicker" style={{ marginBottom: 8 }}>Search</div>
      <h1 className="h-display" style={{ fontSize: 32, color: T.t0, marginBottom: 20 }}>Find a topic</h1>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: T.t3, fontSize: 16 }}>⌕</span>
        <input value={query} onChange={e => setSearchParams(e.target.value ? { q: e.target.value } : {})} placeholder="Search topics, tags, concepts…" autoFocus
          style={{ width: '100%', padding: '14px 16px 14px 42px', borderRadius: 13, border: `1px solid ${T.bd}`, background: T.s1, color: T.t0, fontSize: 15.5, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
          onFocus={e => e.currentTarget.style.borderColor = T.cy} onBlur={e => e.currentTarget.style.borderColor = T.bd} />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        {[{ id: 'all', label: 'All', color: T.t2 }, ...CATEGORIES].map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)}
            style={{ padding: '6px 13px', borderRadius: 999, border: `1px solid ${filter === c.id ? (c.color || T.cy) + '55' : T.bd}`, background: filter === c.id ? (c.color || T.cy) + '16' : 'transparent', color: filter === c.id ? (c.color || T.cy) : T.t2, cursor: 'pointer', fontSize: 12, fontWeight: filter === c.id ? 600 : 400, fontFamily: 'inherit', transition: 'all .15s' }}>
            {c.icon && <span style={{ marginRight: 4 }}>{c.icon}</span>}{c.label}
          </button>
        ))}
      </div>

      <div style={{ color: T.t3, fontSize: 12.5, marginBottom: 14 }}>{results.length} result{results.length !== 1 ? 's' : ''}{query ? ` for "${query}"` : ''}</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))', gap: 14 }}>
        {results.map(topic => (
          <Link key={topic.id} to={`/topic/${topic.id}`} className="card3 card3-ac" style={{ '--ac': topic.color, textDecoration: 'none', display: 'block', padding: 18, color: 'inherit' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: topic.color + '14', border: `1px solid ${topic.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{topic.icon}</div>
              {topic.viz && topic.viz !== 'none' && <span className="chip" style={{ color: T.gn, borderColor: T.gn + '30', fontSize: 10 }}>▶ live</span>}
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: T.t0, marginBottom: 5 }}>{topic.title}</div>
            <div style={{ fontSize: 12, color: T.t2, lineHeight: 1.55, marginBottom: 10 }}>{topic.overview.slice(0, 88)}…</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {topic.tags.slice(0, 3).map(tag => <span key={tag} className="chip" style={{ fontSize: 9.5 }}>{tag}</span>)}
            </div>
          </Link>
        ))}
        {results.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '70px 0', color: T.t3 }}>No topics found. Try a different term.</div>}
      </div>
    </div>
  );
}
