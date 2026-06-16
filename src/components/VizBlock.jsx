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

export default function VizBlock({ topic }) {
  if (!topic.viz || topic.viz === 'none') return null;
  const render = MAP[topic.viz];
  if (!render) return null;
  return (
    <div style={{ padding: '12px 16px', background: '#0b1120', borderRadius: 10, border: `1px solid ${topic.color}30` }}>
      <div style={{ fontSize: 11, color: topic.color, marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
        ▶ Interactive Simulation
      </div>
      {render(topic.color)}
    </div>
  );
}
