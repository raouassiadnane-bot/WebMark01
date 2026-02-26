import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addPost } from "../store/postsSlice";

// Lazy-load the AI composer component to keep initial bundle small
const AIComposer = React.lazy(() => import('../components/PostAssistant'));

export default function Profile() {
  const loggedInUser = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  // Load user profile from Redux state (backed by localStorage)
  useEffect(() => {
    if (loggedInUser) {
      setUser(loggedInUser);
      // Load posts from localStorage
      const key = "posts_" + (loggedInUser.username || loggedInUser.id);
      const saved = localStorage.getItem(key);
      if (saved) {
        setPosts(JSON.parse(saved));
      }
    }
  }, [loggedInUser]);

  // Add post
  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.trim() || !user) return;

    const postText = newPost.trim();

    // Add to Redux store for global visibility (shows on Home feed)
    dispatch(addPost({
      userId: user.id,
      userName: user.name,
      userInitials: user.initials,
      userAvatar: user.avatar,
      text: postText,
    }));

    // Save to local state and localStorage for profile page
    const updated = [postText, ...posts];
    setPosts(updated);
    const key = "posts_" + (user.username || user.id);
    localStorage.setItem(key, JSON.stringify(updated));
    setNewPost("");
  };

  /**
   * Handles publishing from the AI Composer
   * @param {string} text - The corrected (or original) text from the AI assistant
   */
  const handleAIPublish = (text) => {
    if (!text.trim() || !user) return;

    // Add to Redux store
    dispatch(addPost({
      userId: user.id,
      userName: user.name,
      userInitials: user.initials,
      userAvatar: user.avatar,
      text: text,
    }));

    // Update local state and persistence
    const updated = [text, ...posts];
    setPosts(updated);
    const key = "posts_" + (user.username || user.id);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  // Delete post
  const handleDeletePost = (index) => {
    const updated = posts.filter((_, i) => i !== index);
    setPosts(updated);
    const key = "posts_" + (user.username || user.id);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <p className="text-red-600 text-lg font-semibold">Utilisateur introuvable</p>
          <Link to="/login" className="mt-4 inline-block text-purple-600 hover:underline">→ Se connecter</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 px-4 py-10 text-gray-800">
      <div className="max-w-3xl mx-auto">
        {/* Back to feed */}
        <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition">
          <span className="mr-2">←</span> Retour au feed
        </Link>

        <div className="bg-white rounded-xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="rounded-full w-24 h-24 object-cover border-4 border-purple-200 shadow-md"
              />
            ) : (
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full w-24 h-24 flex items-center justify-center text-3xl font-bold shadow-md">
                {user.initials || "?"}
              </div>
            )}

            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900">{user.name || "Mon Profil"}</h2>
              <p className="text-gray-500 font-medium text-lg">@{user.username}</p>

              {/* Display Onboarding Quiz Results */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
                {user.role && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {user.role}
                  </span>
                )}
                {user.experience && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {user.experience}
                  </span>
                )}
                {user.goal && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    Goal: {user.goal}
                  </span>
                )}
              </div>

              {user.bio && (
                <p className="text-gray-600 mt-4 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 italic">
                  "{user.bio}"
                </p>
              )}

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 justify-center md:justify-start">
                <span className="flex items-center"><span className="mr-1">📧</span> {user.email}</span>
                <span className="flex items-center"><span className="mr-1">📍</span> {user.location || "Earth"}</span>
                <span className="flex items-center"><span className="mr-1">📅</span> Inscrit en {user.joined || new Date().getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* PostAssistant (AI-assisted post composer) */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Assistant de post (AI)</h3>
            <div>
              {/* Lazy-load the component to avoid increasing bundle size excessively. */}
              <React.Suspense fallback={<div className="text-white/50 italic py-4">Chargement de l'assistant...</div>}>
                <AIComposer onPublish={handleAIPublish} />
              </React.Suspense>
            </div>
          </div>

          {/* Posts list */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Mes posts</h3>
            {posts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <p>Aucun post pour le moment.</p>
                <p className="text-sm mt-1">Écrivez votre premier post ci-dessus !</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-start hover:shadow-md transition">
                    <p className="text-gray-700 flex-1 whitespace-pre-wrap">{post}</p>
                    <button
                      onClick={() => handleDeletePost(idx)}
                      className="text-red-600 hover:text-red-800 text-xs uppercase font-bold ml-4 border p-1 rounded hover:bg-red-50 transition"
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
    </div>
  );
}
