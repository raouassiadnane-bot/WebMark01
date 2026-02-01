import React, { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botReply = response.data.choices[0].message.content;
      setMessages([...newMessages, { sender: "bot", text: botReply }]);
    } catch (error) {
      setMessages([...newMessages, { sender: "bot", text: "❌ Erreur API" }]);
    }

    setInput("");
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-bold mb-2">Assistant de vérification</h3>
      <div className="h-40 overflow-y-auto border p-2 mb-2 bg-white">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === "user" ? "text-blue-600" : "text-green-600"}>
            <strong>{msg.sender === "user" ? "Vous" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Écris ton texte à vérifier..."
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 text-white px-3 py-1 rounded"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
