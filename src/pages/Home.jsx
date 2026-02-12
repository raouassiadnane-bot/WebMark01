import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import userApi from '../api/userApi';

// Pool of fake post texts to randomly assign to API users
const FAKE_POST_TEXTS = [
  "Exploring new marketing strategies today 🚀",
  "Just finished a design sprint, feeling inspired!",
  "Learning React + Tailwind, amazing combo 💻",
  "Community feedback is the best way to grow 🌍",
  "Working on something exciting, stay tuned! ✨",
  "Great meetup today, incredible connections made! 🤝",
  "Productivity tip: block your mornings for deep work 🧠",
  "Just deployed my latest project, feels great! 🎉",
  "Reading about AI advancements — the future is now 🤖",
  "Coffee + Code = Perfect morning ☕💻",
  "Design thinking is underrated. Here's why...",
  "Open source contributions are the best way to learn 📚",
  "Attended an amazing workshop today! Mind = blown 🤯",
  "Collaboration over competition, always 💪",
  "New blog post dropping soon, stay tuned! ✍️",
];

// Derive initials from a full name (e.g. "Dr. Ronnie Boyer" → "RB")
function getInitials(name) {
  if (!name) return "??";
  const words = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s*/i, "").split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return words[0].substring(0, 2).toUpperCase();
}

// Seed-based pseudo-random to keep posts stable per user
function seededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function Home() {
  const reduxPosts = useSelector(state => state.posts.posts);
  const [apiUsers, setApiUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from MockAPI
  useEffect(() => {
    let mounted = true;
    async function fetchUsers() {
      try {
        const data = await userApi.getUsers();
        if (mounted) setApiUsers(data || []);
      } catch (err) {
        if (mounted) setError("Failed to load posts");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchUsers();
    return () => { mounted = false; };
  }, []);

  // Build post feed from API users
  const apiPosts = apiUsers
    .filter(u => u.name && u.name !== "Temp User") // skip temp users
    .slice(0, 15) // limit to 15 users for a clean feed
    .map((user) => {
      const seed = seededRandom(user.id || user.name);
      const textIndex = seed % FAKE_POST_TEXTS.length;
      const hoursAgo = (seed % 72) + 1; // 1–72 hours ago
      return {
        id: `api_${user.id}`,
        userId: user.id,
        userName: user.name,
        userInitials: user.initials || getInitials(user.name),
        userAvatar: user.avatar,
        text: FAKE_POST_TEXTS[textIndex],
        timestamp: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
      };
    });

  // Combine Redux posts + API posts and sort newest first
  const displayPosts = [...reduxPosts, ...apiPosts].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Bienvenue sur <span className="text-purple-600">WebMark</span>
        </h2>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {/* Posts List */}
        <div className="mt-8 space-y-4">
          {!loading && displayPosts.length === 0 ? (
            <p className="text-gray-500 text-center">No posts yet. Start sharing!</p>
          ) : (
            displayPosts.map((post) => (
              <div key={post.id} className="bg-gray-50 border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-center space-x-3 mb-2">
                  {/* Avatar - clickable to user profile */}
                  <Link to={`/user/${post.userId}`}>
                    {post.userAvatar ? (
                      <img
                        src={post.userAvatar}
                        alt={post.userName}
                        className="rounded-full w-10 h-10 object-cover hover:scale-105 transition cursor-pointer border-2 border-purple-300"
                      />
                    ) : (
                      <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold hover:scale-105 transition cursor-pointer">
                        {post.userInitials}
                      </div>
                    )}
                  </Link>
                  <div>
                    {/* Name - clickable to user profile */}
                    <Link to={`/user/${post.userId}`} className="font-semibold text-gray-800 hover:underline hover:text-purple-600 transition">
                      {post.userName}
                    </Link>
                  </div>
                </div>
                <p className="text-gray-700">{post.text}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(post.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
