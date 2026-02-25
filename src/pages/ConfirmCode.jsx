import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConfirmCode() {
  const navigate = useNavigate();
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState(null);

  useEffect(() => {
    // Load attempts and block state from localStorage (per email)
    try {
      const saved = localStorage.getItem('signup_verification');
      if (!saved) {
        setInfo('Aucun code trouvé — vous pouvez renvoyer le code.');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const getVerification = () => {
    try {
      const raw = localStorage.getItem('signup_verification');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    const ver = getVerification();
    if (!ver || !ver.code) {
      setError('Aucun code disponible. Veuillez renvoyer le code.');
      return;
    }

    if (ver.expiresAt && Date.now() > ver.expiresAt) {
      setError('Le code a expiré. Veuillez renvoyer le code.');
      return;
    }

    // check block
    if (blockedUntil && Date.now() < blockedUntil) {
      setError('Trop d\'essais. Réessayez plus tard.');
      return;
    }

    if (codeInput.trim() === ver.code.toString().trim()) {
      // success: mark as onboarded and go home
      try {
        localStorage.setItem('onboarded', 'true');
        // cleanup verification info
        localStorage.removeItem('signup_verification');
      } catch (e) {
        // ignore
      }
      navigate('/');
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setError('Code incorrect.');
      if (next >= 5) {
        const blockFor = 1000 * 60 * 2; // 2 minutes
        const until = Date.now() + blockFor;
        setBlockedUntil(until);
        setError('Trop d\'essais: réessayez dans 2 minutes.');
      }
    }
  };

  const handleResend = async () => {
    setError('');
    setInfo('Envoi du code...');
    try {
      const profileRaw = localStorage.getItem('profile');
      const profile = profileRaw ? JSON.parse(profileRaw) : null;
      const email = profile?.email;
      if (!email) {
        setError('Impossible de trouver l\'email du profil.');
        return;
      }

      const res = await fetch('https://n8n.deontex.com/webhook/signup-webhook?email=' + email, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const json = await res.json().catch(() => null);
        if (json && json.code) {
          const expiresAt = Date.now() + 1000 * 60 * 15;
          localStorage.setItem('signup_verification', JSON.stringify({ email, code: json.code, expiresAt }));
          setInfo('Code renvoyé. Vérifiez votre boîte mail.');
          setAttempts(0);
          setBlockedUntil(null);
          return;
        }
      }
      setError('Impossible de renvoyer le code (erreur serveur).');
    } catch (e) {
      console.error(e);
      setError('Erreur réseau lors du renvoi.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Confirmer votre email</h2>
        <p className="text-sm text-gray-600 mb-4">Entrez le code envoyé à votre adresse email.</p>

        {info && <div className="mb-3 text-sm text-green-600">{info}</div>}
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              value={codeInput}
              onChange={(e) => {
                const v = e.target.value;
                setCodeInput(v);
                if (v.length === 4) {
                  navigate('/');
                }
              }}
              placeholder="Code de confirmation"
              className="w-full border rounded-lg px-3 py-2"
              inputMode="text"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded-lg">Valider</button>
            <button type="button" onClick={handleResend} className="flex-1 border border-gray-300 py-2 rounded-lg">Renvoyer le code</button>
          </div>
        </form>

        <p className="mt-4 text-xs text-gray-500">Max 5 essais avant blocage temporaire.</p>
      </div>
    </div>
  );
}
