import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Navbar from './components/Navbar.jsx';
import AchievementToast from './components/AchievementToast.jsx';
import HomePage from './pages/HomePage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import TopicPage from './pages/TopicPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import RoadmapPage from './pages/RoadmapPage.jsx';
import PlaygroundPage from './pages/PlaygroundPage.jsx';
import ChallengePage from './pages/ChallengePage.jsx';
import ChallengesPage from './pages/ChallengesPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { T } from './theme.js';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${T.cy}30`, borderTopColor: T.cy, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.t1, fontFamily: 'var(--font-sans)' }}>
      <ScrollToTop />
      {user && <Navbar />}
      {user && <AchievementToast />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
          <Route path="/"                       element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/category/:catId"        element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
          <Route path="/topic/:topicId"         element={<ProtectedRoute><TopicPage /></ProtectedRoute>} />
          <Route path="/search"                 element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/roadmap"                element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
          <Route path="/playground"             element={<ProtectedRoute><PlaygroundPage /></ProtectedRoute>} />
          <Route path="/challenges"             element={<ProtectedRoute><ChallengesPage /></ProtectedRoute>} />
          <Route path="/challenge/:challengeId" element={<ProtectedRoute><ChallengePage /></ProtectedRoute>} />
          <Route path="/dashboard"              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="*"                       element={<NotFound />} />
        </Routes>
      </main>
      {user && <Footer />}
    </div>
  );
}

function NotFound() {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) gsap.fromTo(ref.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' });
  }, []);
  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
      <h2 style={{ color: T.t0, marginBottom: 8, fontSize: 24 }}>Page Not Found</h2>
      <p style={{ color: T.t2, marginBottom: 24 }}>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ color: T.cy, textDecoration: 'none', border: `1px solid ${T.cy}50`, padding: '10px 24px', borderRadius: 10, fontWeight: 600 }}>Go Home</a>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${T.bd}`, padding: '32px 20px', background: T.s1 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, background: `linear-gradient(90deg, ${T.cy}, ${T.gn})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>CS & ML Academy</div>
            <div style={{ fontSize: 11, color: T.t3, lineHeight: 1.7 }}>The most comprehensive interactive CS & ML learning platform. From Arrays to LLMs.</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.t2, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Learn</div>
            {[['/', 'Home'], ['/roadmap', 'Roadmap'], ['/search', 'Search Topics']].map(([to, label]) => (
              <a key={to} href={to} style={{ display: 'block', fontSize: 12, color: T.t3, textDecoration: 'none', marginBottom: 5 }}
                onMouseEnter={e => e.currentTarget.style.color = T.cy}
                onMouseLeave={e => e.currentTarget.style.color = T.t3}>{label}</a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.t2, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Practice</div>
            {[['/challenges', 'Challenges'], ['/playground', 'Playground'], ['/dashboard', 'Dashboard']].map(([to, label]) => (
              <a key={to} href={to} style={{ display: 'block', fontSize: 12, color: T.t3, textDecoration: 'none', marginBottom: 5 }}
                onMouseEnter={e => e.currentTarget.style.color = T.gn}
                onMouseLeave={e => e.currentTarget.style.color = T.t3}>{label}</a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.t2, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Topics</div>
            {['/category/ds', '/category/algo', '/category/ml', '/category/nlp'].map((to, i) => {
              const labels = ['Data Structures', 'Algorithms', 'Machine Learning', 'NLP & LLMs'];
              return <a key={to} href={to} style={{ display: 'block', fontSize: 12, color: T.t3, textDecoration: 'none', marginBottom: 5 }}>{labels[i]}</a>;
            })}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${T.bd}`, paddingTop: 20, display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ fontSize: 11, color: T.t3 }}>🧠 CS & ML Academy — Complete interactive learning from Arrays to LLMs</div>
          <div style={{ fontSize: 11, color: T.t3 }}>Built with React · Firebase · Monaco Editor · GSAP</div>
        </div>
      </div>
    </footer>
  );
}
