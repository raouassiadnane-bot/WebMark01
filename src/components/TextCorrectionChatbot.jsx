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

import React, { useState } from "react";
import { correctText } from "../services/textCorrectionService";

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
      setCorrectionSource(result.source === "openai" ? "✓ OpenAI" : "✓ Mock AI");

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
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🎯 Text Correction Assistant
        </h2>
        <p className="text-gray-600 text-sm">
          AI-powered text correction with automatic smart fallback
        </p>
      </div>

      {/* Message History */}
      {messages.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
          <h3 className="font-semibold text-gray-700 mb-3">Correction History</h3>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 p-3 rounded ${
                msg.type === "user"
                  ? "bg-blue-100 border-l-4 border-blue-500"
                  : "bg-green-100 border-l-4 border-green-500"
              }`}
            >
              <div className="font-semibold text-sm mb-1">
                {msg.type === "user" ? "📝 Your Text" : "✨ Corrected"}
                {msg.source && (
                  <span className="text-xs text-gray-600 ml-2 font-normal">
                    ({msg.source})
                  </span>
                )}
              </div>
              <p className="text-gray-800">{msg.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Enter text to correct:
        </label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your text here... Press Enter or click Check button"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          rows="4"
          disabled={isLoading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Current Correction Display */}
      {correctedText && (
        <div className="mb-4 p-4 bg-green-50 border border-green-300 rounded-lg">
          <div className="font-semibold text-gray-700 mb-2 flex items-center justify-between">
            <span>✅ Corrected Text</span>
            <span className="text-xs text-green-600 font-normal">
              {correctionSource}
            </span>
          </div>
          <p className="text-gray-800 leading-relaxed">{correctedText}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCheckText}
          disabled={isLoading || !userInput.trim()}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
            isLoading || !userInput.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
          }`}
        >
          {isLoading ? "🔄 Processing..." : "✓ Check Text"}
        </button>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="py-2 px-4 rounded-lg font-semibold bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all active:scale-95"
          >
            🗑️ Clear
          </button>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-gray-600">
        <p>
          💡 <strong>Pro Tip:</strong> This component automatically falls back to
          mock AI if the real OpenAI API is unavailable. You'll see which source
          was used (OpenAI or Mock AI) next to the corrected text.
        </p>
      </div>
    </div>
  );
}
