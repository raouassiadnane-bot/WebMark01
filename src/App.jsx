import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import VerifyEmail from './pages/VerifyEmail';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import NotFound from './pages/NotFound';
import ApiUsersExample from './components/ApiUsersExample';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Contact from './pages/Contact';
import { pageVariants } from './utils/animateVariants';
import { login as loginAction } from './store/authSlice';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Restore auth from localStorage on app load
  useEffect(() => {
    try {
      const saved = localStorage.getItem('profile');
      if (saved) {
        const profile = JSON.parse(saved);
        dispatch(loginAction(profile));
      }
    } catch (e) {
      console.warn('Erreur restauration profil');
    }
  }, [dispatch]);

  // Redirect logic
  useEffect(() => {
    try {
      const saved = localStorage.getItem('profile');
      const onboarded = localStorage.getItem('onboarded');
      const isAuthPage = ['/signup', '/login'].includes(location.pathname);
      const isOnboardingPage = location.pathname === '/onboarding';

      if (!saved) {
        // Not logged in -> MUST go to signup (or login)
        if (!isAuthPage) {
          navigate('/signup');
        }
      } else if (onboarded !== 'true') {
        // Logged in but not onboarded -> MUST go to onboarding
        if (!isOnboardingPage) {
          navigate('/onboarding');
        }
      } else {
        // Logged in and onboarded -> Should NOT go to auth pages
        if (isAuthPage || isOnboardingPage) {
          navigate('/');
        }
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
            <Route path="/onboarding" element={<ProtectedRoute><MotionWrapper><Onboarding /></MotionWrapper></ProtectedRoute>} />
            <Route path="/login" element={<MotionWrapper><Login /></MotionWrapper>} />
            <Route path="/profile" element={<ProtectedRoute><MotionWrapper><Profile /></MotionWrapper></ProtectedRoute>} />
            <Route path="/user/:id" element={<MotionWrapper><UserProfile /></MotionWrapper>} />
            <Route path="/verify-email" element={<MotionWrapper><VerifyEmail /></MotionWrapper>} />
            <Route path="/api-users" element={<MotionWrapper><ApiUsersExample /></MotionWrapper>} />
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
