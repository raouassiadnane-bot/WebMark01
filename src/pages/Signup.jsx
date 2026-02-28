import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction } from '../store/authSlice';
import { updateField } from '../features/signup/signupSlice';

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get form data from Redux
  const { firstName, lastName, email, age, password } = useSelector(state => state.signup);
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Handle field changes by dispatching Redux action
  const handleFieldChange = (fieldName, value) => {
    dispatch(updateField({ fieldName, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('Veuillez entrer votre prénom et nom.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Veuillez entrer un email valide.');
      return;
    }

    if (!password.trim() || password.length < 6) {
      setError('Mot de passe invalide (minimum 6 caractères).');
      return;
    }

    const ageNum = age ? Number(age) : null;
    if (age && (Number.isNaN(ageNum) || ageNum <= 16)) {
      setError('Âge invalide (minimum 17 ans).');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const initials = (firstName.trim()[0] + lastName.trim()[0]).toUpperCase();
    const username = (firstName.trim() + lastName.trim()).toLowerCase().replace(/\s/g, '');

    const profile = {
      id: 'local-' + Date.now(),
      name: fullName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      age: ageNum,
      // status, // Will be set in onboarding
      initials,
      username,
      // role: status, // Will be set in onboarding
      location: 'Morocco 🇲🇦',
      joined: new Date().getFullYear().toString(),
      bio: `👋 Hello! I'm ${fullName}. New on WebMark!`, // Initial bio, can be updated in onboarding
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName.trim()}`,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('profile', JSON.stringify(profile));
      // localStorage.setItem('onboarded', 'true'); // REMOVED: Do not mark as onboarded yet!
      localStorage.removeItem('onboarded'); // Ensure it's cleared
    } catch (e) {
      console.warn('Erreur stockage local');
    }

    // Trigger n8n webhook for sending confirmation code and wait for response
    try {
      const res = await fetch('https://n8n.deontex.com/webhook/signup-webhook?email=' + profile.email, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
       
      });

      if (res.ok) {
        const json = await res.json().catch(() => null);
        // Expecting { code: 'ABC123' } or similar from n8n. Store locally for validation.
        if (json && json.code) {
          const expiresAt = Date.now() + 1000 * 60 * 15; // 15 minutes
          localStorage.setItem('signup_verification', JSON.stringify({
            email: profile.email,
            code: json.code,
            expiresAt,
          }));
        }
      } else {
        console.warn('Signup webhook returned non-OK:', res.status);
      }
    } catch (err) {
      console.error('Error triggering signup webhook:', err);
    }

    // Dispatch login to Redux so the user is authenticated
    dispatch(loginAction(profile));

    // Redirect to confirmation code entry (then onboarding after confirmation)
    navigate('/confirm-code');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-lg">
        {/* Titre */}
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Inscription <span className="text-purple-600">WebMark</span>
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Créez votre profil pour commencer
        </p>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              value={firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Votre prénom"
            />
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              value={lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Votre nom"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              value={email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="votre.email@example.com"
            />
          </div>

          {/* Âge */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Âge (optionnel)</label>
            <input
              value={age}
              onChange={(e) => handleFieldChange('age', e.target.value)}
              type="number"
              min="17"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: 22"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-sm text-purple-600 hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Bouton submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
            >
              Suivant
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà inscrit ?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-purple-600 hover:underline cursor-pointer"
          >
            Connectez-vous
          </span>
        </p>
      </div>
    </div>
  );
}
