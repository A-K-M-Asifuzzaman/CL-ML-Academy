import { Link, useParams } from 'react-router-dom';
import { T } from '../theme.js';
import { getCategoryById } from '../data/categories.js';
import { getTopicsByCategory } from '../data/topics.js';
import { useProgressCtx } from '../context/ProgressContext.jsx';

export default function CategoryPage() {
  const { catId } = useParams();
  const cat = getCategoryById(catId);
  const topics = getTopicsByCategory(catId);
  const { progress } = useProgressCtx();
  if (!cat) return <div style={{ color: T.t2, padding: 60, textAlign: 'center' }}>Category not found.</div>;

  const readCount = topics.filter(t => progress.topicsRead.includes(t.id)).length;
  const vizCount = topics.filter(t => t.viz && t.viz !== 'none').length;
  const pct = topics.length ? Math.round((readCount / topics.length) * 100) : 0;

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 20px 80px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 7, alignItems: 'center', padding: '18px 0 18px', fontSize: 12.5, color: T.t2 }}>
        <Link to="/" className="link-underline" style={{ color: T.t2, textDecoration: 'none' }}>Home</Link>
        <span style={{ color: T.t3 }}>/</span>
        <span style={{ color: T.t1 }}>{cat.label}</span>
      </div>

      {/* Header */}
      <div className="surface" style={{ padding: 26, marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -20, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${cat.color}12, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, position: 'relative' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: cat.color + '14', border: `1px solid ${cat.color}30`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{cat.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="h-display" style={{ margin: 0, fontSize: 'clamp(24px,4vw,34px)', color: T.t0 }}>{cat.label}</h1>
            <p style={{ margin: '8px 0 0', color: T.t2, fontSize: 14, lineHeight: 1.6, maxWidth: 640 }}>{cat.description}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
              <span className="chip">{topics.length} topics</span>
              {vizCount > 0 && <span className="chip" style={{ color: cat.color, borderColor: cat.color + '30' }}>{vizCount} interactive</span>}
              <span className="chip" style={{ color: readCount ? T.gn : T.t2, borderColor: readCount ? T.gn + '30' : T.bd }}>{readCount}/{topics.length} completed</span>
            </div>
          </div>
        </div>
        {/* progress */}
        <div style={{ marginTop: 18, height: 5, background: T.s3, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: cat.color, borderRadius: 3, transition: 'width .6s ease' }} />
        </div>
      </div>

      {/* Topic grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 14 }}>
        {topics.map((topic, i) => {
          const read = progress.topicsRead.includes(topic.id);
          return (
            <Link key={topic.id} to={`/topic/${topic.id}`} className="card3 card3-ac" style={{ '--ac': topic.color, textDecoration: 'none', padding: 18, color: 'inherit', display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: topic.color + '14', border: `1px solid ${topic.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>{topic.icon}</div>
                <span style={{ fontSize: 11, color: T.t3, fontFamily: 'var(--font-mono)' }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: T.t0 }}>{topic.title}</span>
                {read && <span style={{ fontSize: 11, color: T.gn }}>✓</span>}
              </div>
              <div style={{ fontSize: 12.5, color: T.t2, lineHeight: 1.6, marginBottom: 12, minHeight: 40 }}>{topic.overview.slice(0, 96)}…</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {topic.tags.slice(0, 3).map(tag => <span key={tag} className="chip" style={{ fontSize: 10 }}>{tag}</span>)}
                {topic.viz && topic.viz !== 'none' && <span className="chip" style={{ fontSize: 10, color: T.gn, borderColor: T.gn + '30' }}>▶ live</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
