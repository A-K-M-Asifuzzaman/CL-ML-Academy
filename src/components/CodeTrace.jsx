import { T } from '../theme.js';
import { VIZ_CODE } from '../data/vizCode.js';

/*  Live, line-by-line code panel shown next to a running visualizer.
    The active line (driven by the simulation state) is highlighted and
    animated so you can see exactly which statement produced the current
    change in the animation.                                              */

const KW = /\b(const|let|var|function|return|if|else|for|while|of|in|break|continue|true|false|null|new|swap|min|max)\b/g;

function hl(line) {
  const e = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return e
    .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g, '<span style="color:#9ecbff">$1</span>')
    .replace(KW, '<span style="color:#ff7b72">$&</span>')
    .replace(/\b(\d+)\b/g, '<span style="color:#79c0ff">$&</span>');
}

export default function CodeTrace({ codeKey, state, color = T.cy }) {
  const entry = VIZ_CODE[codeKey];
  if (!entry) return null;

  let active = -1;
  if (state) { try { active = entry.lineOf(state); } catch { active = -1; } }

  return (
    <div className="code-trace" style={{ '--ct': color }}>
      <div className="code-trace-head">
        <span className="ct-pulse" />
        <span className="ct-title">{entry.title}</span>
        <span className="ct-tag">{active >= 0 ? `executing · line ${active + 1}` : 'idle'}</span>
      </div>
      <div className="code-trace-body">
        {entry.code.map((ln, i) => (
          <div key={i} className={'ct-line' + (i === active ? ' ct-active' : '')}>
            <span className="ct-num">{i + 1}</span>
            <span className="ct-arrow">{i === active ? '▶' : ''}</span>
            <code className="ct-code" dangerouslySetInnerHTML={{ __html: hl(ln) || '&nbsp;' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
