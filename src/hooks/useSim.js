import { useState, useEffect, useRef } from 'react';

export function useSim(genFn, deps = []) {
  const [steps, setSteps] = useState([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef(null);

  useEffect(() => {
    try {
      const all = [];
      const g = genFn();
      let r, n = 0;
      while (!(r = g.next()).done && n++ < 9000) all.push(r.value);
      setSteps(all);
      setIdx(0);
      setPlaying(false);
    } catch (_) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (playing && steps.length) {
      timer.current = setInterval(() => {
        setIdx(i => {
          if (i >= steps.length - 1) { setPlaying(false); return i; }
          return i + 1;
        });
      }, Math.max(30, 650 / speed));
    }
    return () => clearInterval(timer.current);
  }, [playing, speed, steps.length]);

  const total = steps.length;
  const progress = total > 1 ? idx / (total - 1) : 0;

  return {
    state: steps[idx] ?? null,
    steps, idx, total, playing, speed, progress,
    play: () => { if (idx >= steps.length - 1) setIdx(0); setPlaying(true); },
    pause: () => setPlaying(false),
    next: () => setIdx(i => Math.min(i + 1, steps.length - 1)),
    prev: () => setIdx(i => Math.max(i - 1, 0)),
    reset: () => { setIdx(0); setPlaying(false); },
    seek: t => setIdx(Math.max(0, Math.min(t, steps.length - 1))),
    setSpeed,
  };
}
