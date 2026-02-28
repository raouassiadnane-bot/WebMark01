import React, { useState } from "react";
import { correctText } from "../services/textCorrectionService";
import { mockCorrectText } from "../utils/mockOpenAI";
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-2xl overflow-hidden border border-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">✨</div>
            <div>
              <h2 className="text-2xl font-bold text-white">Smart Assistant</h2>
              <p className="text-indigo-100 text-sm">Text Correction & Enhancement</p>
            </div>
          </div>
          <div className="hidden sm:block text-indigo-100 text-xs">
            {messages.length} messages
          </div>
        </div>
      </div>

      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gradient-to-b from-white/50 to-indigo-50/30">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-5xl opacity-30">💬</div>
              <p className="text-gray-400 text-lg font-medium">
                Start a conversation
              </p>
              <p className="text-gray-300 text-sm max-w-xs">
                Enter your text above and I'll help improve it
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end space-x-3 animate-fadeIn ${
                msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div className="text-xl flex-shrink-0">
                {msg.sender === "user" ? "👤" : "🤖"}
              </div>
              <div
                className={`px-5 py-3 rounded-2xl max-w-xs lg:max-w-md shadow-md ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border border-indigo-100 shadow-md"
                }`}
              >
                <p className="text-sm leading-relaxed break-words">{msg.text}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-end space-x-3 animate-fadeIn">
            <div className="text-xl">🤖</div>
            <div className="px-5 py-3 rounded-2xl bg-white text-gray-800 rounded-bl-none border border-indigo-100 shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input and Button Container */}
      <div className="bg-white border-t border-indigo-100 px-6 py-4 space-y-3">
        <div className="flex space-x-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1 border-2 border-indigo-200 rounded-full px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all disabled:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
            placeholder="Write your text here..."
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center space-x-2 ${
              isLoading || !input.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl active:scale-95"
            }`}
          >
            <span>{isLoading ? "⏳" : "✓"}</span>
            <span className="hidden sm:inline">{isLoading ? "Processing..." : "Send"}</span>
          </button>
        </div>

        {/* Info text */}
        <p className="text-xs text-gray-400 italic">
          💡 Tip: Press Enter to send (Shift+Enter for new line)
        </p>
      </div>
    </div>
  );
}