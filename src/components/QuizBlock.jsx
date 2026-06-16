import { useState, useCallback } from 'react';
import { T } from '../theme.js';
import { CodeBlock } from './UI.jsx';
import { QUIZ_TYPE_LABELS } from '../data/quizzes.js';

const TYPE_ICON = { mcq: '📋', truefalse: '⚡', fill: '✏️', output: '💻', order: '🔢' };

function McqQuestion({ q, onAnswer, answered }) {
  const [selected, setSelected] = useState(null);

  const choose = (i) => {
    if (answered) return;
    setSelected(i);
    onAnswer(i === q.answer, i);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {q.options.map((opt, i) => {
        let bg = T.s2, border = T.bd, color = T.t1;
        if (answered || selected !== null) {
          if (i === q.answer)  { bg = T.gn + '15'; border = T.gn; color = T.gn; }
          else if (i === selected && selected !== q.answer) { bg = T.rd + '15'; border = T.rd; color = T.rd; }
        }
        return (
          <button key={i} onClick={() => choose(i)} disabled={answered}
            style={{ padding: '10px 16px', borderRadius: 9, border: `1px solid ${border}`, background: bg, color, cursor: answered ? 'default' : 'pointer', textAlign: 'left', fontSize: 13, transition: 'all .15s', fontFamily: 'inherit' }}>
            <span style={{ color: T.t3, marginRight: 10, fontSize: 11 }}>{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function TrueFalseQuestion({ q, onAnswer, answered }) {
  const [selected, setSelected] = useState(null);

  const choose = (val) => {
    if (answered) return;
    setSelected(val);
    onAnswer(val === q.answer, val);
  };

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {[true, false].map(val => {
        let bg = T.s2, border = T.bd, color = T.t1;
        if (answered || selected !== null) {
          if (val === q.answer)  { bg = T.gn + '15'; border = T.gn; color = T.gn; }
          else if (val === selected && selected !== q.answer) { bg = T.rd + '15'; border = T.rd; color = T.rd; }
        }
        return (
          <button key={String(val)} onClick={() => choose(val)} disabled={answered}
            style={{ flex: 1, padding: '14px', borderRadius: 10, border: `1px solid ${border}`, background: bg, color, cursor: answered ? 'default' : 'pointer', fontSize: 15, fontWeight: 700, transition: 'all .15s', fontFamily: 'inherit' }}>
            {val ? '✓ True' : '✗ False'}
          </button>
        );
      })}
    </div>
  );
}

function FillQuestion({ q, onAnswer, answered }) {
  const [val, setVal] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const check = () => {
    if (submitted) return;
    setSubmitted(true);
    const userAns = q.caseSensitive ? val.trim() : val.trim().toLowerCase();
    const correct  = q.caseSensitive ? q.answer.trim() : q.answer.trim().toLowerCase();
    onAnswer(userAns === correct, val);
  };

  const isRight = submitted && (q.caseSensitive ? val.trim() === q.answer.trim() : val.trim().toLowerCase() === q.answer.trim().toLowerCase());
  const isWrong = submitted && !isRight;

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'stretch' }}>
      <input
        value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && check()}
        disabled={submitted}
        placeholder="Type your answer..."
        style={{
          flex: 1, padding: '10px 14px', borderRadius: 9, background: T.s2, color: T.t0, fontFamily: 'var(--font-mono)', fontSize: 13,
          border: `1px solid ${isRight ? T.gn : isWrong ? T.rd : T.bd}`,
          outline: 'none', minWidth: 200,
        }}
      />
      {!submitted && (
        <button onClick={check} disabled={!val.trim()}
          style={{ padding: '10px 20px', borderRadius: 9, background: T.cy + 'cc', color: T.bg, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
          Check
        </button>
      )}
      {submitted && (
        <div style={{ padding: '10px 14px', borderRadius: 9, background: isRight ? T.gn + '15' : T.rd + '15', border: `1px solid ${isRight ? T.gn : T.rd}`, color: isRight ? T.gn : T.rd, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
          {isRight ? '✓ Correct!' : `✗ Answer: ${q.answer}`}
        </div>
      )}
    </div>
  );
}

function OutputQuestion({ q, onAnswer, answered }) {
  return <McqQuestion q={q} onAnswer={onAnswer} answered={answered} />;
}

function OrderQuestion({ q, onAnswer, answered }) {
  const [order, setOrder] = useState(() => q.items.map((_, i) => i));
  const [submitted, setSubmitted] = useState(false);

  const move = (from, dir) => {
    if (submitted) return;
    const to = from + dir;
    if (to < 0 || to >= order.length) return;
    const o = [...order];
    [o[from], o[to]] = [o[to], o[from]];
    setOrder(o);
  };

  const submit = () => {
    if (submitted) return;
    setSubmitted(true);
    const correct = JSON.stringify(order) === JSON.stringify(q.answer);
    onAnswer(correct, order);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
        {order.map((itemIdx, pos) => {
          let borderColor = T.bd, bg = T.s2;
          if (submitted) {
            borderColor = order[pos] === q.answer[pos] ? T.gn : T.rd;
            bg = order[pos] === q.answer[pos] ? T.gn + '12' : T.rd + '12';
          }
          return (
            <div key={itemIdx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, border: `1px solid ${borderColor}`, background: bg, transition: 'all .15s' }}>
              <span style={{ fontSize: 11, color: T.t3, minWidth: 18 }}>{pos + 1}.</span>
              <span style={{ flex: 1, fontSize: 12, color: T.t1 }}>{q.items[itemIdx]}</span>
              {!submitted && (
                <div style={{ display: 'flex', gap: 3 }}>
                  <button onClick={() => move(pos, -1)} style={{ padding: '2px 7px', border: `1px solid ${T.bd}`, borderRadius: 4, background: T.s3, color: T.t2, cursor: 'pointer', fontSize: 11 }}>↑</button>
                  <button onClick={() => move(pos, 1)}  style={{ padding: '2px 7px', border: `1px solid ${T.bd}`, borderRadius: 4, background: T.s3, color: T.t2, cursor: 'pointer', fontSize: 11 }}>↓</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!submitted && (
        <button onClick={submit} style={{ padding: '9px 20px', borderRadius: 9, background: T.cy + 'cc', color: T.bg, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
          Submit Order
        </button>
      )}
    </div>
  );
}

export default function QuizBlock({ questions, topicColor = T.cy, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const totalXp = questions.reduce((s, q) => s + q.xp, 0);
  const earnedXp = results.reduce((s, r, i) => s + (r.correct ? questions[i].xp : 0), 0);

  const handleAnswer = useCallback((correct, userAnswer) => {
    setAnswered(true);
    setShowExp(true);
    setResults(r => [...r, { correct, userAnswer, questionId: q.id }]);
  }, [q]);

  const next = () => {
    setAnswered(false);
    setShowExp(false);
    if (current + 1 >= questions.length) {
      setFinished(true);
      const score = results.filter(r => r.correct).length + (answered && results[results.length - 1]?.correct ? 0 : 0);
      const finalScore = results.filter(r => r.correct).length;
      onComplete?.(finalScore, questions.length, earnedXp + (answered ? (q && results.find(r => r.questionId === q.id)?.correct ? q.xp : 0) : 0));
    } else {
      setCurrent(c => c + 1);
    }
  };

  if (finished) {
    const score = results.filter(r => r.correct).length;
    const pct = Math.round((score / questions.length) * 100);
    const grade = pct === 100 ? 'Perfect!' : pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good Job!' : 'Keep Practicing!';
    return (
      <div style={{ textAlign: 'center', padding: '32px 20px' }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>{pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚'}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: topicColor, marginBottom: 6 }}>{grade}</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: T.t0, marginBottom: 4 }}>{score}/{questions.length}</div>
        <div style={{ fontSize: 14, color: T.t2, marginBottom: 20 }}>{pct}% correct · +{earnedXp} XP earned</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {results.map((r, i) => (
            <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: r.correct ? T.gn + '20' : T.rd + '20', border: `2px solid ${r.correct ? T.gn : T.rd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              {r.correct ? '✓' : '✗'}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 4, background: T.bd, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((current) / questions.length) * 100}%`, background: topicColor, borderRadius: 2, transition: 'width .4s' }} />
        </div>
        <span style={{ fontSize: 11, color: T.t2, whiteSpace: 'nowrap' }}>{current + 1} / {questions.length}</span>
      </div>

      {/* Question type badge */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 10, padding: '2px 9px', borderRadius: 10, background: topicColor + '15', color: topicColor, border: `1px solid ${topicColor}30` }}>
          {TYPE_ICON[q.type]} {QUIZ_TYPE_LABELS[q.type]}
        </span>
        <span style={{ fontSize: 10, color: T.t3 }}>+{q.xp} XP</span>
      </div>

      {/* Question */}
      <div style={{ fontSize: 15, fontWeight: 600, color: T.t0, marginBottom: 16, lineHeight: 1.6 }}>
        {q.question}
      </div>

      {/* Code snippet for output questions */}
      {q.code && (
        <div style={{ marginBottom: 16 }}>
          <CodeBlock code={q.code} />
        </div>
      )}

      {/* Answer interface */}
      {q.type === 'mcq'       && <McqQuestion       q={q} onAnswer={handleAnswer} answered={answered} />}
      {q.type === 'truefalse' && <TrueFalseQuestion  q={q} onAnswer={handleAnswer} answered={answered} />}
      {q.type === 'fill'      && <FillQuestion        q={q} onAnswer={handleAnswer} answered={answered} />}
      {q.type === 'output'    && <OutputQuestion      q={q} onAnswer={handleAnswer} answered={answered} />}
      {q.type === 'order'     && <OrderQuestion       q={q} onAnswer={handleAnswer} answered={answered} />}

      {/* Explanation */}
      {showExp && (
        <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: T.s1, border: `1px solid ${results.at(-1)?.correct ? T.gn + '40' : T.or + '40'}` }}>
          <div style={{ fontSize: 11, color: results.at(-1)?.correct ? T.gn : T.or, marginBottom: 6, fontWeight: 700 }}>
            {results.at(-1)?.correct ? '✓ Correct!' : '✗ Not quite'}
          </div>
          <div style={{ fontSize: 13, color: T.t1, lineHeight: 1.65 }}>{q.explanation}</div>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button onClick={next} style={{ marginTop: 16, padding: '10px 28px', borderRadius: 10, background: topicColor, color: T.bg, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', transition: 'opacity .15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          {current + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}
