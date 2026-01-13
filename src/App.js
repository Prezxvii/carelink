import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';

// Context Providers
import { ResourcesProvider } from './context/ResourcesContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Auth from './pages/Auth';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />

        {/* Protected Member Routes */}
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resources/:id"
          element={
            <ProtectedRoute>
              <ResourceDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/*  Saved Resources (match navbar: /favorites) */}
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        {/* Back-compat alias (if anything still links to /saved) */}
        <Route path="/saved" element={<Navigate to="/favorites" replace />} />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<Auth type="login" />} />
        <Route path="/signup" element={<Auth type="signup" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ResourcesProvider>
          <div className="App">
            <ScrollToTop />
            <Navbar />

            <main className="main-content">
              <AnimatedRoutes />
            </main>

            <Footer />
          </div>
        </ResourcesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
