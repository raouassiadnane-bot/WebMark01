// src/pages/Contact.jsx
import React, { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    // Vérification simple email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Adresse email invalide.");
      return;
    }

    // Ici tu pourrais envoyer les données à une API ou backend
    console.log("Message envoyé :", { name, email, message });

    setSuccess("Votre message a été envoyé avec succès !");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-lg">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Contactez <span className="text-purple-600">WebMark</span>
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Envoyez-nous un message, nous vous répondrons rapidement.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Votre email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Votre message..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
