import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import VerifyEmail from './pages/VerifyEmail';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileSuggestion from './data/UserSuggestion';
import Contact from './pages/Contact';
import { pageVariants } from './utils/animateVariants';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const onboarded = localStorage.getItem('onboarded');
      if (onboarded !== 'true' && location.pathname !== '/signup') {
        navigate('/signup');
      }
    } catch (e) {
      console.warn('Erreur lecture localStorage');
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-0 py-0">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<MotionWrapper><Home /></MotionWrapper>} />
            <Route path="/signup" element={<MotionWrapper><Signup /></MotionWrapper>} />
            <Route path="/login" element={<MotionWrapper><Login /></MotionWrapper>} />
            <Route path="/profile" element={<ProtectedRoute><MotionWrapper><Profile /></MotionWrapper></ProtectedRoute>} />
            <Route path="/user/:id" element={<ProtectedRoute><MotionWrapper><UserProfile /></MotionWrapper></ProtectedRoute>} />
            <Route path="/verify-email" element={<MotionWrapper><VerifyEmail /></MotionWrapper>} />
            <Route path="/profile-suggestion" element={<MotionWrapper><ProfileSuggestion /></MotionWrapper>} />
            <Route path="/contact" element={<MotionWrapper><Contact /></MotionWrapper>} />
            <Route path="*" element={<MotionWrapper><NotFound /></MotionWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function MotionWrapper({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
