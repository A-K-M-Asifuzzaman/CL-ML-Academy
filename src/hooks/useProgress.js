import { useState, useCallback, useEffect } from 'react';

const KEY = (uid) => uid ? `csml_progress_v2_${uid}` : 'csml_progress_v2';

const ACHIEVEMENTS = [
  { id: 'first_topic',    label: 'First Steps',      desc: 'Read your first topic',                icon: '🎯', xpRequired: 0,   condition: p => p.topicsRead.length >= 1 },
  { id: 'first_quiz',     label: 'Quiz Taker',        desc: 'Complete your first quiz',             icon: '📝', xpRequired: 0,   condition: p => p.quizzesDone.length >= 1 },
  { id: 'first_solve',    label: 'Code Warrior',      desc: 'Solve your first challenge',           icon: '⚔️', xpRequired: 0,   condition: p => p.challengesSolved.length >= 1 },
  { id: 'streak_3',       label: '3-Day Streak',      desc: 'Study 3 days in a row',                icon: '🔥', xpRequired: 0,   condition: p => p.currentStreak >= 3 },
  { id: 'streak_7',       label: 'Week Warrior',      desc: 'Study 7 days in a row',                icon: '🏆', xpRequired: 0,   condition: p => p.currentStreak >= 7 },
  { id: 'xp_500',         label: 'Knowledge Seeker',  desc: 'Earn 500 XP',                          icon: '💡', xpRequired: 500, condition: p => p.xp >= 500 },
  { id: 'xp_1000',        label: 'Expert',            desc: 'Earn 1000 XP',                         icon: '🧠', xpRequired: 1000,condition: p => p.xp >= 1000 },
  { id: 'xp_2500',        label: 'Master',            desc: 'Earn 2500 XP',                         icon: '👑', xpRequired: 2500,condition: p => p.xp >= 2500 },
  { id: 'topics_5',       label: 'Explorer',          desc: 'Read 5 topics',                        icon: '🗺️', xpRequired: 0,   condition: p => p.topicsRead.length >= 5 },
  { id: 'topics_10',      label: 'Deep Diver',        desc: 'Read 10 topics',                       icon: '🤿', xpRequired: 0,   condition: p => p.topicsRead.length >= 10 },
  { id: 'topics_20',      label: 'Polymath',          desc: 'Read 20 topics',                       icon: '📚', xpRequired: 0,   condition: p => p.topicsRead.length >= 20 },
  { id: 'challenges_5',   label: 'Problem Solver',    desc: 'Solve 5 challenges',                   icon: '🛠️', xpRequired: 0,   condition: p => p.challengesSolved.length >= 5 },
  { id: 'challenges_10',  label: 'Algorithm Ace',     desc: 'Solve 10 challenges',                  icon: '🎯', xpRequired: 0,   condition: p => p.challengesSolved.length >= 10 },
  { id: 'quiz_perfect',   label: 'Perfect Score',     desc: 'Score 100% on a quiz',                 icon: '⭐', xpRequired: 0,   condition: p => p.perfectQuizzes >= 1 },
  { id: 'quiz_10',        label: 'Quiz Master',       desc: 'Complete 10 quizzes',                  icon: '📊', xpRequired: 0,   condition: p => p.quizzesDone.length >= 10 },
  { id: 'dsa_complete',   label: 'DSA Graduate',      desc: 'Complete all DSA topics',              icon: '🎓', xpRequired: 0,   condition: p => ['arrays','strings','linked-lists','stacks','queues','recursion','backtracking'].every(t => p.topicsRead.includes(t)) },
  { id: 'playground_use', label: 'Coder',             desc: 'Write code in the playground',         icon: '💻', xpRequired: 0,   condition: p => p.playgroundRuns >= 1 },
  { id: 'night_owl',      label: 'Night Owl',         desc: 'Study after midnight',                 icon: '🦉', xpRequired: 0,   condition: p => p.nightOwl },
];

export const LEVELS = [
  { level: 1,  name: 'Novice',        minXp: 0 },
  { level: 2,  name: 'Apprentice',    minXp: 100 },
  { level: 3,  name: 'Developer',     minXp: 250 },
  { level: 4,  name: 'Engineer',      minXp: 500 },
  { level: 5,  name: 'Senior Dev',    minXp: 900 },
  { level: 6,  name: 'Tech Lead',     minXp: 1400 },
  { level: 7,  name: 'Architect',     minXp: 2000 },
  { level: 8,  name: 'Principal',     minXp: 2800 },
  { level: 9,  name: 'Distinguished', minXp: 3800 },
  { level: 10, name: 'Fellow',        minXp: 5000 },
];

const getLevel = xp => {
  let lv = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.minXp) lv = l; }
  return lv;
};

const getNextLevel = xp => {
  const cur = getLevel(xp);
  return LEVELS.find(l => l.level === cur.level + 1) || null;
};

const xpToNextLevel = xp => {
  const next = getNextLevel(xp);
  if (!next) return null;
  const cur = getLevel(xp);
  return { needed: next.minXp - xp, total: next.minXp - cur.minXp, pct: ((xp - cur.minXp) / (next.minXp - cur.minXp)) * 100 };
};

const defaultProgress = () => ({
  xp: 0,
  topicsRead: [],
  challengesSolved: [],
  quizzesDone: [],
  perfectQuizzes: 0,
  achievements: [],
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  playgroundRuns: 0,
  nightOwl: false,
  totalTimeMinutes: 0,
  bookmarks: [],
  notes: {},
  quizScores: {},
  categoryProgress: {},
});

const load = (uid) => {
  try {
    const raw = localStorage.getItem(KEY(uid));
    return raw ? { ...defaultProgress(), ...JSON.parse(raw) } : defaultProgress();
  } catch { return defaultProgress(); }
};

const save = (data, uid) => {
  try { localStorage.setItem(KEY(uid), JSON.stringify(data)); } catch {}
};

const updateStreak = (progress) => {
  const today = new Date().toDateString();
  const last  = progress.lastStudyDate;
  if (last === today) return progress;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const newStreak = last === yesterday ? progress.currentStreak + 1 : 1;
  const hour = new Date().getHours();
  return {
    ...progress,
    currentStreak: newStreak,
    longestStreak: Math.max(progress.longestStreak, newStreak),
    lastStudyDate: today,
    nightOwl: progress.nightOwl || hour >= 0 && hour < 4,
  };
};

const checkAchievements = (progress, oldProgress) => {
  const newOnes = [];
  for (const ach of ACHIEVEMENTS) {
    if (progress.achievements.includes(ach.id)) continue;
    if (ach.condition(progress) && !ach.condition(oldProgress)) {
      newOnes.push(ach);
    }
  }
  return newOnes;
};

export function useProgress(userId) {
  const [progress, setProgress] = useState(() => load(userId));
  const [newAchievements, setNewAchievements] = useState([]);

  // Reload when userId changes (login/logout)
  useEffect(() => { setProgress(load(userId)); }, [userId]);

  useEffect(() => { save(progress, userId); }, [progress, userId]);

  const mutate = useCallback((updater) => {
    setProgress(prev => {
      const streaked = updateStreak(prev);
      const next = updater(streaked);
      const unlocked = checkAchievements(next, prev);
      const withAch = unlocked.length
        ? { ...next, achievements: [...next.achievements, ...unlocked.map(a => a.id)] }
        : next;
      if (unlocked.length) setNewAchievements(u => [...u, ...unlocked]);
      save(withAch, userId);
      return withAch;
    });
  }, [userId]);

  const markTopicRead = useCallback((topicId) => {
    mutate(p => ({
      ...p,
      topicsRead: p.topicsRead.includes(topicId) ? p.topicsRead : [...p.topicsRead, topicId],
      xp: p.topicsRead.includes(topicId) ? p.xp : p.xp + 15,
    }));
  }, [mutate]);

  const solveChallenge = useCallback((challengeId, xpAward) => {
    mutate(p => ({
      ...p,
      challengesSolved: p.challengesSolved.includes(challengeId) ? p.challengesSolved : [...p.challengesSolved, challengeId],
      xp: p.challengesSolved.includes(challengeId) ? p.xp : p.xp + xpAward,
    }));
  }, [mutate]);

  const completeQuiz = useCallback((quizId, xpAward, score, total) => {
    mutate(p => ({
      ...p,
      quizzesDone: p.quizzesDone.includes(quizId) ? p.quizzesDone : [...p.quizzesDone, quizId],
      xp: p.quizzesDone.includes(quizId) ? p.xp : p.xp + xpAward,
      perfectQuizzes: score === total ? p.perfectQuizzes + 1 : p.perfectQuizzes,
      quizScores: { ...p.quizScores, [quizId]: Math.max(p.quizScores[quizId] || 0, Math.round((score/total)*100)) },
    }));
  }, [mutate]);

  const recordPlaygroundRun = useCallback(() => {
    mutate(p => ({ ...p, playgroundRuns: p.playgroundRuns + 1 }));
  }, [mutate]);

  const toggleBookmark = useCallback((topicId) => {
    mutate(p => ({
      ...p,
      bookmarks: p.bookmarks.includes(topicId)
        ? p.bookmarks.filter(b => b !== topicId)
        : [...p.bookmarks, topicId],
    }));
  }, [mutate]);

  const saveNote = useCallback((topicId, note) => {
    mutate(p => ({ ...p, notes: { ...p.notes, [topicId]: note } }));
  }, [mutate]);

  const clearAchievements = useCallback(() => setNewAchievements([]), []);

  const resetProgress = useCallback(() => {
    const fresh = defaultProgress();
    save(fresh);
    setProgress(fresh);
  }, []);

  return {
    progress,
    level: getLevel(progress.xp),
    nextLevel: getNextLevel(progress.xp),
    xpProgress: xpToNextLevel(progress.xp),
    allAchievements: ACHIEVEMENTS.map(a => ({ ...a, unlocked: progress.achievements.includes(a.id) })),
    newAchievements,
    markTopicRead,
    solveChallenge,
    completeQuiz,
    recordPlaygroundRun,
    toggleBookmark,
    saveNote,
    clearAchievements,
    resetProgress,
  };
}
