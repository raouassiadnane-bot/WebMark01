import React, { useState } from "react";
import { correctText } from "../services/textCorrectionService";



export default function Chatbot() {
  // State for all messages (user inputs and bot replies)
  const [messages, setMessages] = useState([]);
  
  // State for current input field value
  const [input, setInput] = useState("");
  
  // State to track if API call is in progress (for loading UI)
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle user clicking the "Envoyer" (Send) button
   * Gets AI correction and updates message list
   */
  const handleSend = async () => {
    // Ignore empty inputs
    if (!input.trim()) return;

    // Add user message to chat
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    
    // Set loading state
    setIsLoading(true);

    try {
      // ╔═══════════════════════════════════════════════════════════╗
      // ║  PRIMARY: Mock AI (Always works, no API quota needed)     ║
      // ╚═══════════════════════════════════════════════════════════╝
      const result = await mockCorrectText(input, { improveMarketing: true });
      const botReply = result.correctedText;


      // Add bot reply to messages
      setMessages([...newMessages, { sender: "bot", text: botReply }]);
    } catch (error) {
      // Handle unexpected errors gracefully
      console.error("Error during text correction:", error);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "❌ Erreur: Impossible de corriger le texte" },
      ]);
    } finally {
      // Clear input and reset loading state
      setInput("");
      setIsLoading(false);
    }
  };

  /**
   * Handle Enter key press in input field
   * Allows sending message with Enter (Shift+Enter for newline)
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 shadow-md">
      {/* Header */}
      <h3 className="font-bold mb-2 text-lg text-gray-800">
        ✨ Assistant de vérification
      </h3>

      {/* Message Display Area */}
      <div className="h-40 overflow-y-auto border p-2 mb-2 bg-white rounded">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm italic">
            Écris du texte à vérifier pour démarrer...
          </p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 p-2 rounded ${
                msg.sender === "user"
                  ? "text-blue-600 bg-blue-50"
                  : "text-green-600 bg-green-50"
              }`}
            >
              <strong>{msg.sender === "user" ? "📝 Vous" : "🤖 Bot"}:</strong>{" "}
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Input and Button Container */}
      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
          placeholder="Écris ton texte à vérifier..."
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className={`px-3 py-1 rounded font-semibold transition-all ${
            isLoading || !input.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
          }`}
        >
          {isLoading ? "⏳ Traitement..." : "✓ Envoyer"}
        </button>
      </div>

      {/* Info text */}
      <p className="text-xs text-gray-500 mt-2 italic">
        Astuce: Appuyez sur Entrée pour envoyer (Maj+Entrée pour nouvelle ligne)
      </p>
    </div>
  );
}