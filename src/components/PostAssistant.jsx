import React, { useState } from 'react';
import { correctText } from "../services/textCorrectionService";

/**
 * PostAssistant: A premium AI-powered post composer.
 * It helps users detect and fix mistakes (grammar, conjugation, spelling)
 * before sharing their post.
 */
export default function PostAssistant({ onPublish }) {
  const [input, setInput] = useState(''); // user's raw post
  const [corrected, setCorrected] = useState(''); // corrected text returned by AI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCorrectedMode, setIsCorrectedMode] = useState(false);

  const MAX_LENGTH = 1000;

  const handleCheckText = async () => {
    setError('');
    setIsCorrectedMode(false);
    if (!input.trim()) {
      setError('Veuillez entrer du texte à vérifier.');
      return;
    }

    setLoading(true);
    try {
      const result = await correctText(input);
      if (result.success) {
        setCorrected(result.correctedText);
        // If the AI returned the exact same text, it means it's already perfect
        if (result.correctedText.trim() === input.trim()) {
          setError('✨ Votre texte est déjà parfait ! Aucune modification nécessaire.');
        } else {
          setIsCorrectedMode(true);
        }
      } else {
        throw new Error(result.error || "Erreur lors de la correction");
      }
    } catch (e) {
      console.error(e);
      setError("Désolé, l'assistant n'a pas pu vérifier votre texte. Vérifiez votre connexion ou votre clé API.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCorrection = () => {
    setInput(corrected);
    setIsCorrectedMode(false);
    setCorrected('');
  };

  const handlePublish = () => {
    const textToPublish = isCorrectedMode && corrected ? corrected : input;
    if (!textToPublish.trim()) return;

    if (onPublish) {
      onPublish(textToPublish);
      // Reset after publishing
      setInput('');
      setCorrected('');
      setIsCorrectedMode(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 border border-white/10 rounded-2xl p-6 shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="p-2 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-lg text-white shadow-lg text-sm">✨</span>
          Assistant de Rédaction IA
        </h3>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Correction Pro</span>
          <span className="text-[8px] text-white/30 text-right">Grammaire • Conjugaison • Orthographe • Contractions</span>
        </div>
      </div>

      <div className="relative group">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (isCorrectedMode) setIsCorrectedMode(false);
          }}
          placeholder="Écrivez votre post ici... L'IA corrigera l'orthographe, la grammaire, la conjugaison et les contractions (im -> I am)."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all min-h-[160px] resize-none text-base leading-relaxed"
        />
        <div className="absolute bottom-3 right-3 text-[10px] text-white/20 font-mono">
          {input.length} / {MAX_LENGTH}
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-xs flex items-center gap-2">
          <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">!</span>
          {error}
        </div>
      )}

      {isCorrectedMode && corrected && (
        <div className="mt-4 p-5 bg-purple-500/10 border border-purple-500/30 rounded-xl animate-in fade-in slide-in-from-top-4 duration-500 shadow-inner">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-purple-300 uppercase tracking-tighter flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" />
              Suggestion de l'IA (Corrigé)
            </span>
            <button
              onClick={handleApplyCorrection}
              className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-full transition-all font-bold shadow-lg shadow-purple-900/40 active:scale-95"
            >
              Appliquer la correction
            </button>
          </div>
          <p className="text-white/90 text-sm italic leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
            {corrected}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleCheckText}
          disabled={loading || !input.trim()}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all ${loading || !input.trim()
            ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg active:scale-95'
            }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyse en cours...</span>
            </>
          ) : (
            <>🔍 Vérifier les fautes</>
          )}
        </button>

        <button
          onClick={handlePublish}
          disabled={!input.trim() || loading}
          className={`px-10 py-3.5 rounded-xl font-extrabold shadow-xl transition-all active:scale-95 ${!input.trim() || loading
            ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-[1.02] text-white shadow-purple-500/30'
            }`}
        >
          Partager mon Post Correct
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 py-2 border-t border-white/5">
        <span className="text-[9px] text-white/20 uppercase font-medium tracking-tight">Sécurisé par Gemini LLM</span>
      </div>
    </div>
  );
}
