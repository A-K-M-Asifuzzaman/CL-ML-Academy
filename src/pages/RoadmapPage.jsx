import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { T } from '../theme.js';
import { useProgressCtx } from '../context/ProgressContext.jsx';
import { RadialRing } from '../components/Charts.jsx';

const ROADMAP = [
  { phase: 'Phase 1', title: 'Foundations', weeks: 'Weeks 1–4', color: T.cy, topics: [
    {id:'arrays',title:'Arrays',icon:'▦'},{id:'strings',title:'Strings',icon:'≡'},{id:'linked-lists',title:'Linked Lists',icon:'◈'},
    {id:'stacks',title:'Stacks',icon:'⧉'},{id:'queues',title:'Queues',icon:'≋'},{id:'recursion',title:'Recursion',icon:'↺'},
    {id:'bit-manipulation',title:'Bit Manipulation',icon:'⊻'},{id:'big-o',title:'Big-O Notation',icon:'Ω'},
  ]},
  { phase: 'Phase 2', title: 'Core Algorithms', weeks: 'Weeks 5–8', color: T.gn, topics: [
    {id:'sorting',title:'Sorting',icon:'⊞'},{id:'searching',title:'Searching',icon:'⌕'},
    {id:'sliding-window',title:'Sliding Window',icon:'⊓'},{id:'backtracking',title:'Backtracking',icon:'↩'},
    {id:'greedy',title:'Greedy',icon:'↑'},{id:'shortest-paths',title:'Shortest Paths',icon:'⤳'},{id:'string-matching',title:'String Matching',icon:'⌕'},
  ]},
  { phase: 'Phase 3', title: 'Data Structures', weeks: 'Weeks 9–12', color: T.pu, topics: [
    {id:'hash-tables',title:'Hash Tables',icon:'⊞'},{id:'trees',title:'Trees & BST',icon:'⊠'},{id:'balanced-trees',title:'Balanced BSTs',icon:'⚖'},
    {id:'graphs',title:'Graphs',icon:'◎'},{id:'heaps',title:'Heaps',icon:'△'},{id:'union-find',title:'Union-Find',icon:'⊍'},
    {id:'segment-tree',title:'Segment Trees',icon:'⊿'},{id:'dp',title:'Dynamic Programming',icon:'▣'},
  ]},
  { phase: 'Phase 4', title: 'Systems, DB & Networks', weeks: 'Weeks 13–17', color: T.or, topics: [
    {id:'operating-systems',title:'Operating Systems',icon:'⊙'},{id:'memory-management',title:'Memory',icon:'▤'},{id:'caching-systems',title:'Caching',icon:'⚡'},
    {id:'tcp-ip',title:'TCP/IP',icon:'⇄'},{id:'http-protocols',title:'HTTP/TLS',icon:'⊕'},{id:'sql-mastery',title:'SQL',icon:'⊞'},{id:'database-indexing',title:'Indexing & ACID',icon:'⊟'},
  ]},
  { phase: 'Phase 5', title: 'Math & Machine Learning', weeks: 'Weeks 18–23', color: T.rd, topics: [
    {id:'calculus-ml',title:'Calculus',icon:'∂'},{id:'statistics-ml',title:'Statistics',icon:'∫'},{id:'ml-basics',title:'ML Fundamentals',icon:'◑'},
    {id:'ensemble-methods',title:'Ensembles',icon:'🌲'},{id:'svm',title:'SVM',icon:'◑'},{id:'clustering',title:'Clustering',icon:'◓'},{id:'model-evaluation',title:'Evaluation',icon:'◑'},
  ]},
  { phase: 'Phase 6', title: 'Deep Learning & LLMs', weeks: 'Weeks 24–30', color: T.mg, topics: [
    {id:'neural-nets',title:'Neural Networks',icon:'◉'},{id:'cnn',title:'CNNs',icon:'⊟'},{id:'rnn-lstm',title:'RNN / LSTM',icon:'↻'},
    {id:'transformers',title:'Transformers',icon:'⊛'},{id:'generative-models',title:'GAN / Diffusion',icon:'◎'},{id:'rag-systems',title:'RAG',icon:'⊛'},{id:'prompt-engineering',title:'Prompting & Agents',icon:'⊛'},{id:'ml-deployment',title:'Deployment',icon:'⚙'},
  ]},
];

export default function RoadmapPage() {
  const { progress } = useProgressCtx();
  const ref = useRef(null);
  const read = progress.topicsRead;

  useEffect(() => { if (ref.current) gsap.fromTo(ref.current.querySelectorAll('[data-p]'), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out' }); }, []);

  const allTopics = ROADMAP.flatMap(p => p.topics);
  const doneCount = allTopics.filter(t => read.includes(t.id)).length;
  const overall = Math.round((doneCount / allTopics.length) * 100);

  return (
    <div ref={ref} style={{ maxWidth: 1080, margin: '0 auto', padding: '0 20px 90px' }}>
      {/* Header */}
      <div style={{ padding: '30px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 18 }}>
        <div>
          <div className="kicker" style={{ marginBottom: 8 }}>30-week structured path</div>
          <h1 className="h-display" style={{ fontSize: 34, color: T.t0, margin: 0 }}>Learning Roadmap</h1>
          <p style={{ color: T.t2, fontSize: 14, marginTop: 8, maxWidth: 560, lineHeight: 1.6 }}>From CS fundamentals to deploying LLMs. Six phases, {allTopics.length} milestones — follow in order or jump to any track.</p>
        </div>
        <RadialRing value={overall} size={104} color={T.cy}>
          <div className="stat-num" style={{ fontSize: 22, color: T.t0 }}>{overall}%</div>
          <div style={{ fontSize: 9, color: T.t3, textTransform: 'uppercase', letterSpacing: '.08em' }}>complete</div>
        </RadialRing>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 8 }}>
        {/* vertical spine */}
        <div style={{ position: 'absolute', left: 27, top: 20, bottom: 30, width: 2, background: `linear-gradient(180deg, ${T.cy}, ${T.gn}, ${T.pu}, ${T.or}, ${T.rd}, ${T.mg})`, opacity: 0.4, borderRadius: 2 }} />

        {ROADMAP.map((phase, pi) => {
          const done = phase.topics.filter(t => read.includes(t.id)).length;
          const pct = Math.round((done / phase.topics.length) * 100);
          const complete = pct === 100;
          return (
            <div key={phase.phase} data-p style={{ display: 'flex', gap: 20, marginBottom: 30, position: 'relative' }}>
              {/* node */}
              <div style={{ flexShrink: 0, zIndex: 1 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: T.bg, border: `2px solid ${phase.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: phase.color, fontSize: 15, boxShadow: complete ? `0 0 16px ${phase.color}70` : 'none', fontFamily: 'var(--font-display)' }}>
                  {complete ? '✓' : pi + 1}
                </div>
              </div>
              {/* phase card */}
              <div className="ring-card spotlight" style={{ '--ac': phase.color, flex: 1, padding: 20, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, color: phase.color, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' }}>{phase.phase} · {phase.weeks}</div>
                    <div className="h-display" style={{ fontSize: 19, color: T.t0, marginTop: 3 }}>{phase.title}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: phase.color }}>{done}/{phase.topics.length}</div>
                    <div style={{ fontSize: 10.5, color: T.t3 }}>{pct}% done</div>
                  </div>
                </div>
                {/* progress bar */}
                <div style={{ height: 5, background: T.s3, borderRadius: 3, overflow: 'hidden', marginBottom: 16 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: phase.color, borderRadius: 3, transition: 'width 1s cubic-bezier(.16,1,.3,1)', boxShadow: `0 0 8px ${phase.color}60` }} />
                </div>
                {/* topics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                  {phase.topics.map(t => {
                    const isDone = read.includes(t.id);
                    return (
                      <Link key={t.id} to={`/topic/${t.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 9, background: isDone ? phase.color + '12' : T.s2, border: `1px solid ${isDone ? phase.color + '40' : T.bd}`, color: T.t1, transition: 'all .15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = phase.color + '70'; e.currentTarget.style.transform = 'translateX(3px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = isDone ? phase.color + '40' : T.bd; e.currentTarget.style.transform = 'none'; }}>
                        <span style={{ fontSize: 15 }}>{t.icon}</span>
                        <span style={{ fontSize: 12, fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                        {isDone && <span style={{ fontSize: 11, color: phase.color }}>✓</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
