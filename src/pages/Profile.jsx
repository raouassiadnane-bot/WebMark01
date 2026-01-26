// src/pages/UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import userSuggestion from "../data/UserSuggestion";

export default function UserProfile() {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  // Cherche dans la liste des suggestions
  let user = userSuggestion.find((u) => u.username === username);

  // Si pas trouvé, regarde dans localStorage (profil créé au signup)
  if (!user) {
    try {
      const storedProfile = localStorage.getItem("profile");
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        user = {
          initials: parsed.firstName[0] + parsed.lastName[0],
          name: parsed.firstName + " " + parsed.lastName,
          username: "adnanra", // ⚠️ garde ce username fixe pour cohérence
          location: "Casa",
          role: parsed.status,
          joined: "2026",
        };
      }
    } catch (e) {
      console.warn("Erreur lecture profil localStorage");
    }
  }

  // Charger les posts depuis localStorage
  useEffect(() => {
    if (user?.username) {
      const saved = localStorage.getItem("posts_" + user.username); // ✅ cohérent avec Home
      if (saved) {
        setPosts(JSON.parse(saved));
      }
    }
  }, [user?.username]);

  // Ajouter un post
  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    const updated = [newPost.trim(), ...posts];
    setPosts(updated);
    localStorage.setItem("posts_" + user.username, JSON.stringify(updated)); // ✅ même clé
    setNewPost("");
  };

  // Supprimer un post
  const handleDeletePost = (index) => {
    const updated = posts.filter((_, i) => i !== index);
    setPosts(updated);
    localStorage.setItem("posts_" + user.username, JSON.stringify(updated)); // ✅ même clé
  };

  if (!user) {
    return <div className="p-6 text-center text-red-600">Utilisateur introuvable</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 px-4 py-10 text-gray-800">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold">
            {user.initials}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-sm text-gray-500">@{user.username}</p>
            <p className="text-sm text-gray-500">{user.location}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
            <p className="text-sm text-gray-400">Inscrit en {user.joined}</p>
          </div>
        </div>

        {/* Formulaire pour ajouter un post */}
        <form onSubmit={handleAddPost} className="space-y-3">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Écris ton post ici..."
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Publier
          </button>
        </form>

        {/* Liste des posts */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Posts de {user.name}</h3>
          {posts.length === 0 ? (
            <p className="text-gray-500">Aucun post pour le moment.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post, idx) => (
                <div key={idx} className="bg-gray-50 border rounded-lg p-4 flex justify-between items-center">
                  <p className="text-gray-700">{post}</p>
                  <button
                    onClick={() => handleDeletePost(idx)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
