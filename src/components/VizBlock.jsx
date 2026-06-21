import { T } from '../theme.js';
import SortingViz from '../visualizers/SortingViz.jsx';
import BSearchViz from '../visualizers/BSearchViz.jsx';
import LinkedListViz from '../visualizers/LinkedListViz.jsx';
import StackViz from '../visualizers/StackViz.jsx';
import QueueViz from '../visualizers/QueueViz.jsx';
import RecursionViz from '../visualizers/RecursionViz.jsx';
import NQueensViz from '../visualizers/NQueensViz.jsx';
import BSTViz from '../visualizers/BSTViz.jsx';
import GraphViz from '../visualizers/GraphViz.jsx';
import DPViz from '../visualizers/DPViz.jsx';
import HashViz from '../visualizers/HashViz.jsx';
import BigOViz from '../visualizers/BigOViz.jsx';
import NeuralNetViz from '../visualizers/NeuralNetViz.jsx';
import AttentionViz from '../visualizers/AttentionViz.jsx';
import GradDescentViz from '../visualizers/GradDescentViz.jsx';

const MAP = {
  sorting:    (c) => <SortingViz color={c} />,
  bsearch:    (c) => <BSearchViz color={c} />,
  linkedlist: (c) => <LinkedListViz color={c} />,
  stack:      (c) => <StackViz color={c} />,
  queue:      (c) => <QueueViz color={c} />,
  recursion:  (c) => <RecursionViz color={c} />,
  nqueens:    (c) => <NQueensViz color={c} />,
  bst:        (c) => <BSTViz color={c} />,
  graph:      (c) => <GraphViz color={c} />,
  dp:         (c) => <DPViz color={c} />,
  hash:       (c) => <HashViz color={c} />,
  bigo:       ()  => <BigOViz />,
  neuralnet:  (c) => <NeuralNetViz color={c} />,
  attention:  (c) => <AttentionViz color={c} />,
  gd:         (c) => <GradDescentViz color={c} />,
};

const VIZ_LABEL = {
  sorting: 'Sorting Engine', bsearch: 'Binary Search', linkedlist: 'Linked List',
  stack: 'Stack (LIFO)', queue: 'Queue (FIFO)', recursion: 'Recursion Tree',
  nqueens: 'N-Queens Solver', bst: 'Binary Search Tree', graph: 'Graph Algorithms',
  dp: 'Dynamic Programming', hash: 'Hash Table', bigo: 'Complexity Analyzer',
  neuralnet: 'Neural Network', attention: 'Attention Mechanism', gd: 'Gradient Descent',
};

export default function VizBlock({ topic }) {
  if (!topic.viz || topic.viz === 'none') return null;
  const render = MAP[topic.viz];
  if (!render) return null;
  const c = topic.color;
  return (
    <div className="viz-frame" style={{ padding: 0, borderColor: c + '33' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: `1px solid ${c}22`, background: `linear-gradient(90deg, ${c}12, transparent)`, position: 'relative', zIndex: 1 }}>
        <span style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: c, boxShadow: `0 0 8px ${c}` }} />
          <span style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: `1.5px solid ${c}`, animation: 'pulse 1.6s ease-in-out infinite' }} />
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: c, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {VIZ_LABEL[topic.viz] || 'Interactive'}
        </span>
        <span className="hide-mobile" style={{ fontSize: 10, color: 'var(--t3)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#28c840' }} /> Live Simulation
        </span>
      </div>
      {/* Body */}
      <div style={{ padding: '16px', position: 'relative', zIndex: 1 }}>
        {render(c)}
      </div>
    </div>
  );
}
