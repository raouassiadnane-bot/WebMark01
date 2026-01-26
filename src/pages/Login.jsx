import React, {useState} from 'react'
import { motion } from 'framer-motion'
import { feedbackVariant } from '../utils/animateVariants'
import { validateEmail } from '../utils/validators'
import authService from '../services/authService'

export default function Login(){
  const [form, setForm] = useState({email:'', password:''})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    if(!validateEmail(form.email)) return setError('Email invalide')
    if(!form.password) return setError('Mot de passe requis')

    try{
      setLoading(true)
      await authService.login(form)
      // tu peux ajouter navigate('/profile') ici si tu veux rediriger après connexion
    }catch(err){
      setError(err?.message || 'Erreur connexion')
    }finally{setLoading(false)}
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-lg font-medium mb-4">Se connecter</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          aria-label="email"
          value={form.email}
          onChange={e=>setForm({...form,email:e.target.value})}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          aria-label="password"
          value={form.password}
          onChange={e=>setForm({...form,password:e.target.value})}
          type="password"
          placeholder="Mot de passe"
          className="w-full p-2 border rounded"
        />
        <div className="flex items-center justify-between">
          {/* ✅ Bouton submit explicite */}
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </form>
      {error && (
        <motion.div
          variants={feedbackVariant}
          initial="hidden"
          animate="visible"
          className="mt-3 text-sm text-red-600"
        >
          {error}
        </motion.div>
      )}
    </div>
  )
}
