import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const isConfigured = Object.values(firebaseConfig).every(v => v && v !== 'REPLACE_ME');

export let auth           = null;
export let analytics      = null;
export let googleProvider = null;
export let githubProvider = null;
export let db             = null;

if (isConfigured) {
  const app    = initializeApp(firebaseConfig);
  auth         = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  githubProvider = new GithubAuthProvider();
  db           = getFirestore(app);
  try { analytics = getAnalytics(app); } catch {} // Analytics may fail in dev/SSR
}

export { isConfigured };
