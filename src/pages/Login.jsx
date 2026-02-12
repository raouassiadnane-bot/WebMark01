import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { feedbackVariant } from '../utils/animateVariants';
import { validateEmail } from '../utils/validators';
import { login as loginAction } from '../store/authSlice';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!validateEmail(form.email)) return setError('Email invalide');
    if (!form.password) return setError('Mot de passe requis');

    try {
      setLoading(true);

      // Check if there's a stored profile with matching email
      const savedProfile = localStorage.getItem('profile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.email === form.email) {
          // Login with the stored profile
          dispatch(loginAction(profile));
          localStorage.setItem('onboarded', 'true');
          navigate('/');
          return;
        }
      }

      // If no matching profile found, create a minimal one from email
      const name = form.email.split('@')[0];
      const initials = name.substring(0, 2).toUpperCase();
      const profile = {
        id: 'local-' + Date.now(),
        name: name,
        email: form.email,
        initials: initials,
        username: name.toLowerCase(),
        role: 'Member',
        location: 'Earth 🌍',
        joined: new Date().getFullYear().toString(),
        bio: `👋 Hello! I'm ${name}.`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('profile', JSON.stringify(profile));
      localStorage.setItem('onboarded', 'true');
      dispatch(loginAction(profile));
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Erreur connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Se connecter</h3>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Accédez à votre compte WebMark
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              aria-label="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="votre.email@example.com"
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              aria-label="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              type="password"
              placeholder="Votre mot de passe"
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {error && (
          <motion.div
            variants={feedbackVariant}
            initial="hidden"
            animate="visible"
            className="mt-3 text-sm text-red-600 text-center"
          >
            {error}
          </motion.div>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Pas encore inscrit ?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-purple-600 hover:underline cursor-pointer"
          >
            Créer un compte
          </span>
        </p>
      </div>
    </div>
  );
}
