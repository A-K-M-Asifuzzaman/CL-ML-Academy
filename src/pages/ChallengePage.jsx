import { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { T } from '../theme.js';
import { getChallengeById, CHALLENGES, DIFFICULTY_COLOR } from '../data/challenges.js';
import { getTopicById } from '../data/topics.js';
import CodeEditor, { runUserCode, compareResult, XpBadge } from '../components/CodeEditor.jsx';
import { useProgressCtx } from '../context/ProgressContext.jsx';

function TestResult({ tc, result, idx, comparator }) {
  const passed = result && compareResult(result.result, tc.expected, tc.comparator || comparator);
  const error  = result?.error;
  const ref = useRef(null);

  useEffect(() => {
    if (result && ref.current) {
      gsap.fromTo(ref.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)', delay: idx * 0.06 });
    }
  }, [result, idx]);

  return (
    <div ref={ref} style={{ padding: '10px 14px', borderRadius: 9, border: `1px solid ${result ? (error ? T.or + '60' : passed ? T.gn + '50' : T.rd + '50') : T.bd}`, background: result ? (error ? T.or + '08' : passed ? T.gn + '08' : T.rd + '08') : T.s1, transition: 'border-color .2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: result ? 6 : 0 }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${result ? (error ? T.or : passed ? T.gn : T.rd) : T.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: result ? (error ? T.or : passed ? T.gn : T.rd) : T.t3, flexShrink: 0, fontWeight: 700 }}>
          {result ? (error ? '!' : passed ? '✓' : '✗') : idx + 1}
        </div>
        <span style={{ fontSize: 12, color: T.t2 }}>Test {idx + 1}</span>
        {result && <span style={{ fontSize: 11, fontWeight: 700, color: error ? T.or : passed ? T.gn : T.rd, marginLeft: 'auto' }}>{error ? 'ERROR' : passed ? 'PASSED' : 'FAILED'}</span>}
      </div>
      {result && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, paddingLeft: 28 }}>
          {error ? (
            <div style={{ color: T.or }}>Error: {error}</div>
          ) : (
            <>
              <div style={{ color: T.t3, marginBottom: 2 }}>Input: <span style={{ color: T.t1 }}>{JSON.stringify(tc.input)}</span></div>
              <div style={{ color: T.t3, marginBottom: 2 }}>Expected: <span style={{ color: T.gn }}>{JSON.stringify(tc.expected)}</span></div>
              {!passed && <div style={{ color: T.t3 }}>Got: <span style={{ color: T.rd }}>{JSON.stringify(result.result)}</span></div>}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function ChallengePage() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const challenge = getChallengeById(challengeId);

  const [code, setCode]       = useState(challenge?.starter || '');
  const [testResults, setTestResults] = useState([]);
  const [running, setRunning] = useState(false);
  const [solved, setSolved]   = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [attempts, setAttempts] = useState(0);

  const headerRef = useRef(null);
  const { progress, solveChallenge } = useProgressCtx();
  const alreadySolved = challenge && progress.challengesSolved.includes(challenge.id);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
    }
  }, []);

  if (!challenge) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
      <h2 style={{ color: T.t0 }}>Challenge not found</h2>
      <Link to="/challenges" style={{ color: T.cy }}>Browse Challenges</Link>
    </div>
  );

  const topic = getTopicById(challenge.topicId);
  const diffColor = DIFFICULTY_COLOR[challenge.difficulty];
  const curIdx = CHALLENGES.findIndex(c => c.id === challengeId);
  const prev = CHALLENGES[curIdx - 1];
  const next = CHALLENGES[curIdx + 1];

  const runTests = useCallback(async () => {
    setRunning(true);
    setTestResults([]);
    setAttempts(a => a + 1);
    try {
      const inputs = challenge.testCases.map(tc => tc.input);
      const { results, error } = await runUserCode(code, inputs);
      if (error) {
        setTestResults(challenge.testCases.map(() => ({ error })));
        setRunning(false);
        return;
      }
      const mapped = challenge.testCases.map((tc, i) => {
        const r = results?.find(r => r.idx === i);
        return r ? { result: r.result, error: null } : { result: undefined, error: 'No result' };
      });
      setTestResults(mapped);
      const allPass = mapped.every((r, i) => !r.error && compareResult(r.result, challenge.testCases[i].expected, challenge.testCases[i].comparator || challenge.comparator));
      if (allPass && !alreadySolved) {
        setSolved(true);
        solveChallenge(challenge.id, challenge.xp);
        setTimeout(() => {
          if (headerRef.current) {
            gsap.to(headerRef.current, { boxShadow: `0 0 40px ${T.gn}50`, duration: 0.4, yoyo: true, repeat: 3 });
          }
        }, 200);
      }
    } catch (e) {
      setTestResults(challenge.testCases.map(() => ({ error: e.message })));
    } finally {
      setRunning(false);
    }
  }, [code, challenge, alreadySolved, solveChallenge]);

  const tabStyle = (t) => ({
    padding: '7px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12,
    color: activeTab === t ? topic?.color || T.cy : T.t2,
    borderBottom: `2px solid ${activeTab === t ? (topic?.color || T.cy) : 'transparent'}`,
    fontWeight: activeTab === t ? 600 : 400, transition: 'all .15s', fontFamily: 'inherit',
  });

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px 60px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '16px 0 12px', fontSize: 12, color: T.t2 }}>
        <Link to="/" style={{ color: T.t2, textDecoration: 'none' }}>Home</Link>
        <span>›</span>
        <Link to="/challenges" style={{ color: T.cy, textDecoration: 'none' }}>Challenges</Link>
        <span>›</span>
        <span style={{ color: T.t0 }}>{challenge.title}</span>
      </div>

      {/* Header bar */}
      <div ref={headerRef} style={{ padding: '16px 20px', borderRadius: 12, border: `1px solid ${T.bd}`, background: T.s1, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.t0 }}>{challenge.title}</h1>
            <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 12, background: diffColor + '18', color: diffColor, border: `1px solid ${diffColor}30`, textTransform: 'capitalize', fontWeight: 600 }}>{challenge.difficulty}</span>
            {(alreadySolved || solved) && <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 12, background: T.gn + '18', color: T.gn, border: `1px solid ${T.gn}30` }}>✓ Solved</span>}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {challenge.tags.map(t => <span key={t} style={{ fontSize: 10, padding: '1px 7px', borderRadius: 8, background: T.s2, color: T.t3, border: `1px solid ${T.bd}` }}>{t}</span>)}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <XpBadge xp={challenge.xp} color={diffColor} />
          {topic && <Link to={`/topic/${topic.id}`} style={{ fontSize: 12, color: topic.color, textDecoration: 'none', background: topic.color + '10', border: `1px solid ${topic.color}30`, padding: '4px 10px', borderRadius: 8 }}>→ {topic.title}</Link>}
        </div>
      </div>

      {/* Main 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'start' }}>
        {/* Left: description */}
        <div style={{ borderRadius: 12, border: `1px solid ${T.bd}`, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${T.bd}`, background: T.s1 }}>
            {['description', 'hints', 'solution'].map(t => (
              <button key={t} style={tabStyle(t)} onClick={() => setActiveTab(t)}>
                {t === 'description' ? '📋 Problem' : t === 'hints' ? `💡 Hints (${hintsShown}/${challenge.hints?.length||0})` : '✨ Solution'}
              </button>
            ))}
          </div>

          <div style={{ padding: '20px', background: T.s1, maxHeight: 600, overflowY: 'auto' }}>
            {activeTab === 'description' && (
              <div>
                <div style={{ fontSize: 13, color: T.t1, lineHeight: 1.8, marginBottom: 20, whiteSpace: 'pre-wrap' }}>{challenge.description}</div>

                {challenge.examples.map((ex, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: T.t3, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Example {i + 1}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: T.s2, padding: '10px 14px', borderRadius: 8, border: `1px solid ${T.bd}` }}>
                      <div><span style={{ color: T.t3 }}>Input: </span><span style={{ color: T.cy }}>{ex.input}</span></div>
                      <div><span style={{ color: T.t3 }}>Output: </span><span style={{ color: T.gn }}>{ex.output}</span></div>
                      {ex.explanation && <div style={{ color: T.t2, marginTop: 4, fontFamily: 'inherit', fontSize: 11 }}>// {ex.explanation}</div>}
                    </div>
                  </div>
                ))}

                {challenge.constraints && (
                  <div>
                    <div style={{ fontSize: 11, color: T.t3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Constraints</div>
                    {challenge.constraints.map((c, i) => (
                      <div key={i} style={{ fontSize: 12, color: T.t2, marginBottom: 4 }}>• {c}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'hints' && (
              <div>
                <p style={{ fontSize: 13, color: T.t2, marginTop: 0 }}>Stuck? Reveal hints one at a time. Try to solve it on your own first!</p>
                {challenge.hints?.map((hint, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    {i < hintsShown ? (
                      <div style={{ padding: '12px 16px', borderRadius: 9, background: T.ye + '10', border: `1px solid ${T.ye}30` }}>
                        <div style={{ fontSize: 11, color: T.ye, marginBottom: 4 }}>Hint {i + 1}</div>
                        <div style={{ fontSize: 13, color: T.t1 }}>{hint}</div>
                      </div>
                    ) : (
                      <button onClick={() => setHintsShown(h => Math.max(h, i + 1))}
                        style={{ width: '100%', padding: '10px 16px', borderRadius: 9, background: T.s2, border: `1px solid ${T.bd}`, color: T.t2, cursor: 'pointer', fontSize: 13, textAlign: 'left', fontFamily: 'inherit' }}>
                        🔒 Reveal Hint {i + 1}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'solution' && (
              <div>
                {!showSolution ? (
                  <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
                    <p style={{ color: T.t2, marginBottom: 16 }}>Try to solve it yourself first! The solution is here if you're truly stuck.</p>
                    <button onClick={() => setShowSolution(true)}
                      style={{ padding: '10px 24px', borderRadius: 10, background: T.or + 'cc', color: T.bg, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
                      Reveal Solution
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 12, color: T.or, marginBottom: 12 }}>Try to understand each line before copying.</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: '#050d1a', padding: '16px', borderRadius: 8, border: `1px solid ${T.bd}`, whiteSpace: 'pre', overflowX: 'auto', color: T.t1, lineHeight: 1.7 }}>
                      {challenge.solutionCode}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: editor + test runner */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Code editor */}
          <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.bd}` }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '8px 14px', background: T.s2, borderBottom: `1px solid ${T.bd}`, gap: 8 }}>
              <span style={{ fontSize: 12, color: T.t2, fontWeight: 600 }}>solution.js</span>
              <div style={{ flex: 1 }} />
              {attempts > 0 && <span style={{ fontSize: 11, color: T.t3 }}>{attempts} attempt{attempts !== 1 ? 's' : ''}</span>}
              <button id="run-btn" onClick={runTests} disabled={running}
                style={{ padding: '5px 18px', borderRadius: 7, border: 'none', background: running ? T.t3 : (solved || alreadySolved) ? T.gn : topic?.color || T.cy, color: T.bg, cursor: running ? 'default' : 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'inherit', transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 6 }}>
                {running ? '⏳ Testing...' : solved || alreadySolved ? '✓ All Tests Pass' : '▶ Run Tests'}
              </button>
            </div>
            <CodeEditor value={code} onChange={setCode} height="360px" />
          </div>

          {/* Test results */}
          <div style={{ borderRadius: 12, border: `1px solid ${T.bd}`, overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', background: T.s2, borderBottom: `1px solid ${T.bd}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: T.t2, fontWeight: 600 }}>Test Cases</span>
              {testResults.length > 0 && (
                <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 10, background: testResults.every((r, i) => !r.error && compareResult(r.result, challenge.testCases[i].expected, challenge.testCases[i].comparator)) ? T.gn + '18' : T.rd + '18', color: testResults.every((r, i) => !r.error && compareResult(r.result, challenge.testCases[i].expected, challenge.testCases[i].comparator)) ? T.gn : T.rd, border: `1px solid ${testResults.every((r, i) => !r.error && compareResult(r.result, challenge.testCases[i].expected, challenge.testCases[i].comparator)) ? T.gn : T.rd}30` }}>
                  {testResults.filter((r, i) => !r.error && compareResult(r.result, challenge.testCases[i].expected, challenge.testCases[i].comparator)).length}/{challenge.testCases.length} passed
                </span>
              )}
            </div>
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 8, background: T.s1 }}>
              {challenge.testCases.map((tc, i) => (
                <TestResult key={i} tc={tc} result={testResults[i]} idx={i} comparator={challenge.comparator} />
              ))}
            </div>
          </div>

          {/* Success banner */}
          {(solved && !alreadySolved) && (
            <div style={{ padding: '16px 20px', borderRadius: 12, background: `linear-gradient(135deg, ${T.gn}15, ${T.cy}10)`, border: `1px solid ${T.gn}50`, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: T.gn, marginBottom: 4 }}>Challenge Solved!</div>
              <div style={{ fontSize: 13, color: T.t2, marginBottom: 12 }}>+{challenge.xp} XP earned</div>
              {next && (
                <button onClick={() => navigate(`/challenge/${next.id}`)}
                  style={{ padding: '8px 20px', borderRadius: 9, background: T.gn, color: T.bg, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
                  Next Challenge →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next nav */}
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        {prev ? (
          <button onClick={() => navigate(`/challenge/${prev.id}`)} style={{ flex: 1, padding: '10px 16px', borderRadius: 9, border: `1px solid ${T.bd}`, background: T.s1, color: T.t1, cursor: 'pointer', textAlign: 'left', fontSize: 12, fontFamily: 'inherit' }}>
            ← <span style={{ color: DIFFICULTY_COLOR[prev.difficulty], fontWeight: 600 }}>{prev.title}</span>
          </button>
        ) : <div style={{ flex: 1 }} />}
        {next ? (
          <button onClick={() => navigate(`/challenge/${next.id}`)} style={{ flex: 1, padding: '10px 16px', borderRadius: 9, border: `1px solid ${T.bd}`, background: T.s1, color: T.t1, cursor: 'pointer', textAlign: 'right', fontSize: 12, fontFamily: 'inherit' }}>
            <span style={{ color: DIFFICULTY_COLOR[next.difficulty], fontWeight: 600 }}>{next.title}</span> →
          </button>
        ) : <div style={{ flex: 1 }} />}
      </div>
    </div>
  );
}
