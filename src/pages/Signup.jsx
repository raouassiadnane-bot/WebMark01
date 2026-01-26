import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [status, setStatus] = useState('Étudiant');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ✅ toggle
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('Veuillez entrer votre prénom et nom.');
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

    const profile = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: ageNum,
      status,
      password, // ✅ stocker le mot de passe (exemple)
    };

    try {
      localStorage.setItem('profile', JSON.stringify(profile));
      localStorage.setItem('onboarded', 'true');
    } catch (e) {
      console.warn('Erreur stockage local');
    }

    navigate('/verify-email'); // étape suivante
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
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Votre prénom"
            />
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Votre nom"
            />
          </div>

          {/* Âge */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Âge (optionnel)</label>
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              type="number"
              min="17"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: 22"
            />
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option>Étudiant</option>
              <option>Professionnel</option>
            </select>
          </div>

          {/* ✅ Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              Valider l'inscription
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
