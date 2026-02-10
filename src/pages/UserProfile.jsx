import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import userSuggestion from "../data/UserSuggestion";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // Fetch user data and posts
  useEffect(() => {
    // Find user from UserSuggestion data
    const userData = userSuggestion.find(u => u.id === id);

    if (userData) {
      setUser(userData);
      // Use mock posts from user data
      setPosts(userData.posts || []);
    }
  }, [id]);

  if (!user) {
    return <div className="p-6 text-center text-red-600">User not found</div>;
  }

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 px-4 py-10 text-gray-800">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold">
            {user.initials}
          </div>
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
  );
}
