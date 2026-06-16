import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
} from 'firebase/auth';
import { auth, googleProvider, githubProvider, isConfigured } from '../firebase.js';

// ── Demo mode (no Firebase config) ─────────────────────────────────────────
const DEMO_USERS_KEY   = 'csml_users';
const DEMO_SESSION_KEY = 'csml_session';
const loadDemoUsers   = () => { try { return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '{}'); } catch { return {}; } };
const saveDemoUsers   = u  => { try { localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(u)); } catch {} };
const loadDemoSession = () => { try { return JSON.parse(localStorage.getItem(DEMO_SESSION_KEY) || 'null'); } catch { return null; } };
const saveDemoSession = s  => { try { localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(s)); } catch {} };

export const AVATARS = ['🧑‍💻','👩‍💻','🧑‍🔬','👩‍🔬','🧑‍🎓','👩‍🎓','🦸','🧙'];

const AuthContext = createContext(null);

// ── Shape: user = { id, email, username, avatar, photoURL } ────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Firebase mode ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isConfigured) {
      // Demo mode: restore from localStorage
      const s = loadDemoSession();
      setUser(s);
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, fbUser => {
      if (fbUser) {
        setUser({
          id:       fbUser.uid,
          email:    fbUser.email,
          username: fbUser.displayName || fbUser.email.split('@')[0],
          avatar:   fbUser.photoURL || AVATARS[0],
          photoURL: fbUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // ── Email/Password Register ────────────────────────────────────────────
  const register = useCallback(async ({ username, email, password, avatar }) => {
    if (!isConfigured) {
      // Demo fallback
      const users = loadDemoUsers();
      if (users[email]) return { error: 'Email already registered.' };
      if (!username || username.length < 2) return { error: 'Username must be at least 2 characters.' };
      if (password.length < 6) return { error: 'Password must be at least 6 characters.' };
      const id = `demo_${Date.now()}`;
      const session = { id, username, email, avatar: avatar || AVATARS[0] };
      users[email] = { ...session, password };
      saveDemoUsers(users); saveDemoSession(session);
      setUser(session);
      return { ok: true };
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await fbUpdateProfile(cred.user, { displayName: username });
      return { ok: true };
    } catch (e) {
      return { error: friendlyError(e.code) };
    }
  }, []);

  // ── Email/Password Login ───────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    if (!isConfigured) {
      const users = loadDemoUsers();
      const u = users[email];
      if (!u) return { error: 'No account found with that email.' };
      if (u.password !== password) return { error: 'Incorrect password.' };
      const session = { id: u.id, username: u.username, email: u.email, avatar: u.avatar };
      saveDemoSession(session); setUser(session);
      return { ok: true };
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true };
    } catch (e) {
      return { error: friendlyError(e.code) };
    }
  }, []);

  // ── Google OAuth ───────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async () => {
    if (!isConfigured) return { error: 'Firebase not configured. Use email/password.' };
    try {
      await signInWithPopup(auth, googleProvider);
      return { ok: true };
    } catch (e) {
      return { error: friendlyError(e.code) };
    }
  }, []);

  // ── GitHub OAuth ───────────────────────────────────────────────────────
  const loginWithGitHub = useCallback(async () => {
    if (!isConfigured) return { error: 'Firebase not configured. Use email/password.' };
    try {
      await signInWithPopup(auth, githubProvider);
      return { ok: true };
    } catch (e) {
      return { error: friendlyError(e.code) };
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    if (!isConfigured) {
      localStorage.removeItem(DEMO_SESSION_KEY);
      setUser(null);
      return;
    }
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, loginWithGitHub, logout, isConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const friendlyError = code => {
  const map = {
    'auth/email-already-in-use':    'That email is already registered.',
    'auth/invalid-email':           'Invalid email address.',
    'auth/weak-password':           'Password must be at least 6 characters.',
    'auth/user-not-found':          'No account found with that email.',
    'auth/wrong-password':          'Incorrect password.',
    'auth/too-many-requests':       'Too many attempts. Try again later.',
    'auth/popup-closed-by-user':    'Sign-in cancelled.',
    'auth/network-request-failed':  'Network error. Check your connection.',
  };
  return map[code] || 'Something went wrong. Please try again.';
};
