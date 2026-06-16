import { createContext, useContext, useEffect, useRef } from 'react';
import { useProgress, LEVELS } from '../hooks/useProgress.js';
import { useAuth } from './AuthContext.jsx';
import { db } from '../firebase.js';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const ProgressContext = createContext(null);

const getLevel = (xp) => {
  let lv = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.minXp) lv = l; }
  return lv;
};

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const progress = useProgress(user?.id);
  const debounceRef = useRef(null);

  // Sync XP to Firestore leaderboard (debounced 2s)
  useEffect(() => {
    if (!db || !user || !user.id) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const level = getLevel(progress.progress.xp);
        await setDoc(
          doc(db, 'leaderboard', user.id),
          {
            displayName: user.displayName || user.username || 'Anonymous',
            xp: progress.progress.xp,
            level: level.level,
            avatar: user.avatar || user.photoURL || null,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch {
        // Silently fail — offline or permission denied
      }
    }, 2000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [progress.progress.xp, user]);

  return (
    <ProgressContext.Provider value={progress}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgressCtx = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgressCtx must be used within ProgressProvider');
  return ctx;
};
