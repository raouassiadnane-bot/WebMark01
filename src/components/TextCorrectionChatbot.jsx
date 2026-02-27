/**
 * TextCorrectionChatbot Component
 * A React component for AI-powered text correction with automatic fallback to mock AI
 * Features:
 * - Real-time text input
 * - OpenAI API integration with fallback
 * - Display of corrected text
 * - Loading state and error handling
 * - Shows source (OpenAI or Mock) for transparency
 */

import React, { useState, useEffect } from "react";
import { correctText } from "../services/textCorrectionService";
import { getSuggestions } from "../services/suggestionService";

export default function TextCorrectionChatbot() {
  // State for user input
  const [userInput, setUserInput] = useState("");

  // State for corrected output
  const [correctedText, setCorrectedText] = useState("");

  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // State for error messages
  const [error, setError] = useState("");

  // State to show which source provided the correction
  const [correctionSource, setCorrectionSource] = useState("");

  // State to track message history
  const [messages, setMessages] = useState([]);

  // State for real-time suggestions
  const [activeSuggestion, setActiveSuggestion] = useState(null);

  /**
   * Watch for input changes to show suggestions
   */
  useEffect(() => {
    const suggestionResult = getSuggestions(userInput);
    setActiveSuggestion(suggestionResult);
  }, [userInput]);

  /**
   * Apply a suggestion to the user input
   */
  const applySuggestion = (suggestion) => {
    const words = userInput.split(/\s+/);
    words[words.length - 1] = suggestion;
    setUserInput(words.join(" ") + " "); // Add space after suggestion
    setActiveSuggestion(null);
  };

  /**
   * Handle the check button click
   * Calls the correction service and updates state
   */
  const handleCheckText = async () => {
    // Clear previous messages and errors
    setError("");
    setCorrectionSource("");

    // Validate input
    if (!userInput.trim()) {
      setError("Please enter some text to correct.");
      return;
    }

    // Set loading state
    setIsLoading(true);

    try {
      // Call the correction service (tries real API, falls back to mock)
      const result = await correctText(userInput, { improveMarketing: true });

      // Update state with corrected text
      setCorrectedText(result.correctedText);
      setCorrectionSource(result.source === "openai" ? "✓ OpenAI" : result.source === "gemini" ? "✓ Gemini" : "✓ Mock AI");

      // Add to message history (user message + bot correction)
      setMessages([
        ...messages,
        { type: "user", text: userInput },
        { type: "bot", text: result.correctedText, source: result.source },
      ]);

      // Clear input for next message
      setUserInput("");
    } catch (err) {
      // Handle unexpected errors
      setError(`Correction failed: ${err.message}`);
      setCorrectionSource("✗ Error");
      console.error("Correction error:", err);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  /**
   * Handle Enter key press in input field
   * Allows user to submit by pressing Enter instead of clicking button
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCheckText();
    }
  };

  /**
   * Clear all messages and reset state
   */
  const handleClearHistory = () => {
    setMessages([]);
    setCorrectedText("");
    setUserInput("");
    setError("");
    setCorrectionSource("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl border border-gray-100">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-1">
            🎯 Smart AI Assistant
          </h2>
          <p className="text-gray-500 text-sm">
            Writing better, one suggestion at a time
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">v2.0 Beta</span>
        </div>
      </div>

      {/* Message History */}
      {messages.length > 0 && (
        <div className="mb-6 space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.type === "user"
                    ? "bg-purple-600 text-white rounded-br-none"
                    : "bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-none"
                  }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">
                    {msg.type === "user" ? "You" : "Assistant"}
                  </span>
                  {msg.source && (
                    <span className="text-[9px] px-1 py-0.5 bg-black/10 rounded">
                      {msg.source}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="relative mb-4">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
          Compose Message
        </label>

        {/* Suggestion Overlay */}
        {activeSuggestion && (
          <div className="absolute bottom-full left-0 mb-2 w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="bg-white rounded-xl shadow-2xl border border-purple-100 p-2 flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-bold text-purple-400 uppercase px-2">Suggestions for "{activeSuggestion.word}":</span>
              {activeSuggestion.suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => applySuggestion(s)}
                  className="px-3 py-1 bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white rounded-full text-sm font-medium transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your post here... (e.g., 'im happy')"
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200 resize-none min-h-[120px]"
          disabled={isLoading}
        />

        <div className="absolute bottom-4 right-4 text-[10px] text-gray-400">
          Press Shift + Enter for new line
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCheckText}
          disabled={isLoading || !userInput.trim()}
          className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${isLoading || !userInput.trim()
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-purple-200"
            }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Perfecting...</span>
            </>
          ) : (
            <>
              <span>✨ Enhance Post</span>
            </>
          )}
        </button>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="p-3 w-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all border border-gray-200"
            title="Clear History"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Pro Tip */}
      {!messages.length && !userInput && (
        <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-white/50 text-center">
          <p className="text-xs text-blue-600 font-medium italic">
            "Try typing 'im' or 'dont' to see real-time suggestions, or write a full post and click Enhance!"
          </p>
        </div>
      )}
    </div>
  );
}

