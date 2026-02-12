import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import userApi from "../api/userApi";

// Pool of fake post texts for users without posts
const FAKE_POST_TEXTS = [
  "Excited to share my latest project with the community! 🎉",
  "Just wrapped up an amazing collaboration. Great things coming!",
  "Productivity hack: smaller tasks lead to bigger wins 🏆",
  "Learning something new every day. Never stop growing 🌱",
  "Grateful for this incredible community. You all inspire me 💙",
];

// Derive initials from a full name
function getInitials(name) {
  if (!name) return "??";
  const words = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s*/i, "").split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return words[0].substring(0, 2).toUpperCase();
}

// Derive a username from a full name
function deriveUsername(name) {
  if (!name) return "user";
  return name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s*/i, "")
    .toLowerCase()
    .split(/\s+/)
    .join("")
    .replace(/[^a-z0-9]/g, "");
}

// Generate fake posts for a user
function generateFakePosts(userId, userName) {
  return FAKE_POST_TEXTS.slice(0, 3).map((text, i) => ({
    id: `${userId}-${i + 1}`,
    text,
    timestamp: new Date(Date.now() - (i + 1) * 86400000 * 2).toISOString(),
  }));
}

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data and posts
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await userApi.getUser(id);
        if (!mounted) return;
        if (data) {
          // Normalize API data — derive missing fields
          const normalizedUser = {
            ...data,
            initials: data.initials || getInitials(data.name),
            username: data.username || deriveUsername(data.name),
            role: data.role || "Member",
            location: data.location || "Earth 🌍",
            bio: data.bio || `Hello! I'm ${data.name}. Welcome to my profile.`,
            joined: data.joined || (data.createdAt ? new Date(data.createdAt).getFullYear().toString() : "2026"),
          };
          setUser(normalizedUser);
          // Use existing posts or generate fake ones
          const userPosts = data.posts && data.posts.length > 0
            ? data.posts
            : generateFakePosts(data.id, data.name);
          setPosts(userPosts);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <p className="text-red-600 text-lg font-semibold">User not found</p>
          <Link to="/" className="mt-4 inline-block text-purple-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 px-4 py-10 text-gray-800">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition">
          <span className="mr-2">←</span> Back to Feed
        </Link>

        <div className="bg-white rounded-xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="rounded-full w-20 h-20 object-cover border-4 border-purple-200"
              />
            ) : (
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold">
                {user.initials}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <p className="text-sm text-gray-600">@{user.username}</p>
              {user.bio && <p className="text-sm text-gray-600 mt-2">{user.bio}</p>}
              <div className="flex gap-4 mt-3 text-xs text-gray-500">
                <span>{user.role}</span>
                <span>📍 {user.location}</span>
                <span>Joined {user.joined}</span>
              </div>
              <p className="text-xs text-blue-600 mt-3 font-semibold">📖 Read-only profile (visitor view)</p>
            </div>
          </div>

          {/* Posts list */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Posts by {user.name.split(" ")[0]}</h3>
            {posts.length === 0 ? (
              <p className="text-gray-500">No posts yet.</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <p className="text-gray-700 mb-2">{post.text}</p>
                    <p className="text-xs text-gray-400">{formatDate(post.timestamp)}</p>
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
