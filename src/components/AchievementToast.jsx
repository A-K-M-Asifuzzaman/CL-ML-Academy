import { useEffect, useState } from 'react';
import { T } from '../theme.js';
import { useProgressCtx } from '../context/ProgressContext.jsx';

function AchievementCard({ achievement, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50);
    const t2 = setTimeout(() => setVisible(false), 3500);
    const t3 = setTimeout(onDone, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 18px',
      background: `linear-gradient(135deg, ${T.s2}, ${T.s3})`,
      border: `1px solid ${T.ye}50`,
      borderRadius: 14,
      boxShadow: `0 0 20px ${T.ye}30, 0 8px 32px rgba(0,0,0,.6)`,
      marginBottom: 10,
      transform: visible ? 'translateX(0) scale(1)' : 'translateX(100px) scale(.9)',
      opacity: visible ? 1 : 0,
      transition: 'all .35s cubic-bezier(.34,1.56,.64,1)',
      minWidth: 280,
      maxWidth: 340,
      pointerEvents: 'none',
    }}>
      <div style={{ fontSize: 28, flexShrink: 0 }}>{achievement.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, color: T.ye, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>
          Achievement Unlocked!
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.t0, marginBottom: 2 }}>{achievement.label}</div>
        <div style={{ fontSize: 11, color: T.t2 }}>{achievement.desc}</div>
      </div>
    </div>
  );
}

export default function AchievementToast() {
  const { newAchievements, clearAchievements } = useProgressCtx();
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    if (newAchievements.length > 0) {
      setQueue(q => [...q, ...newAchievements]);
      clearAchievements();
    }
  }, [newAchievements, clearAchievements]);

  const remove = (id) => setQueue(q => q.filter(a => a.id !== id));

  if (!queue.length) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
    }}>
      {queue.slice(0, 3).map(ach => (
        <AchievementCard key={ach.id} achievement={ach} onDone={() => remove(ach.id)} />
      ))}
    </div>
  );
}
