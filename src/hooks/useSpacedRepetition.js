import { useState, useCallback, useMemo, useEffect } from 'react';

const KEY = (uid) => uid ? `csml_sr_${uid}` : 'csml_sr';

const toISODate = (date) => date.toISOString().split('T')[0];

const todayStr = () => toISODate(new Date());

const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return toISODate(d);
};

const loadCards = (uid) => {
  try {
    const raw = localStorage.getItem(KEY(uid));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveCards = (cards, uid) => {
  try { localStorage.setItem(KEY(uid), JSON.stringify(cards)); } catch {}
};

const sm2Update = (card, quality) => {
  // quality: 0-5
  const q = Math.max(0, Math.min(5, quality));
  let { ef, repetitions, interval } = card;

  // Update easiness factor
  ef = Math.max(1.3, ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  if (q < 3) {
    // Failed — reset
    repetitions = 0;
    interval = 1;
  } else {
    // Passed
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ef);
    }
    repetitions += 1;
  }

  const today = todayStr();
  return {
    ...card,
    ef,
    repetitions,
    interval,
    nextReview: addDays(today, interval),
    lastReview: today,
  };
};

export function useSpacedRepetition(userId) {
  const [cards, setCards] = useState(() => loadCards(userId));

  // Reload on userId change
  useEffect(() => {
    setCards(loadCards(userId));
  }, [userId]);

  const persist = useCallback((next) => {
    setCards(next);
    saveCards(next, userId);
  }, [userId]);

  const dueCards = useMemo(() => {
    const today = todayStr();
    return cards.filter(c => c.nextReview <= today);
  }, [cards]);

  const addCard = useCallback((topicId) => {
    setCards(prev => {
      if (prev.find(c => c.topicId === topicId)) return prev;
      const today = todayStr();
      const next = [
        ...prev,
        {
          topicId,
          interval: 1,
          repetitions: 0,
          ef: 2.5,
          nextReview: today,
          lastReview: null,
        },
      ];
      saveCards(next, userId);
      return next;
    });
  }, [userId]);

  const reviewCard = useCallback((topicId, quality) => {
    setCards(prev => {
      const next = prev.map(c =>
        c.topicId === topicId ? sm2Update(c, quality) : c
      );
      saveCards(next, userId);
      return next;
    });
  }, [userId]);

  const removeCard = useCallback((topicId) => {
    setCards(prev => {
      const next = prev.filter(c => c.topicId !== topicId);
      saveCards(next, userId);
      return next;
    });
  }, [userId]);

  const isDue = useCallback((topicId) => {
    const today = todayStr();
    const card = cards.find(c => c.topicId === topicId);
    return card ? card.nextReview <= today : false;
  }, [cards]);

  const getCard = useCallback((topicId) => {
    return cards.find(c => c.topicId === topicId) || null;
  }, [cards]);

  return {
    cards,
    dueCards,
    addCard,
    reviewCard,
    removeCard,
    isDue,
    getCard,
  };
}
