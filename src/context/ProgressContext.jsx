import { createContext, useContext } from 'react';
import { useProgress } from '../hooks/useProgress.js';
import { useAuth } from './AuthContext.jsx';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const progress = useProgress(user?.id);
  return <ProgressContext.Provider value={progress}>{children}</ProgressContext.Provider>;
}

export const useProgressCtx = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgressCtx must be used within ProgressProvider');
  return ctx;
};
