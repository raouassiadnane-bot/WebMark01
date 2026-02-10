import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function Home() {
  const reduxPosts = useSelector(state => state.posts.posts);
  const [displayPosts, setDisplayPosts] = useState([]);

  useEffect(() => {
    // Generate some random other users' posts for demo
    const randomUsers = [
      { initials: "SJ", name: "Sarah Johnson", username: "sarahj", id: "1" },
      { initials: "MC", name: "Michael Chen", username: "mchen", id: "2" },
      { initials: "EG", name: "Emma Garcia", username: "emmag", id: "3" },
    ];

    const randomPostTexts = [
      "Exploring new marketing strategies today 🚀",
      "Just finished a design sprint, feeling inspired!",
      "Learning React + Tailwind, amazing combo 💻",
      "Community feedback is the best way to grow 🌍",
    ];

    // Generate a few random posts
    const otherPosts = Array.from({ length: 3 }).map(() => {
      const user = randomUsers[Math.floor(Math.random() * randomUsers.length)];
      const text = randomPostTexts[Math.floor(Math.random() * randomPostTexts.length)];
      return {
        id: "random_" + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        userInitials: user.initials,
        text: text,
        timestamp: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
      };
    });

    // Combine Redux posts + random posts and sort by timestamp (newest first)
    const combined = [...reduxPosts, ...otherPosts].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    setDisplayPosts(combined);
  }, [reduxPosts]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Bienvenue sur <span className="text-purple-600">WebMark</span>
        </h2>

        {/* Posts List */}
        <div className="mt-8 space-y-4">
          {displayPosts.length === 0 ? (
            <p className="text-gray-500 text-center">No posts yet. Start sharing!</p>
          ) : (
            displayPosts.map((post) => (
              <div key={post.id} className="bg-gray-50 border rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  {/* Avatar - clickable to user profile */}
                  <Link to={`/user/${post.userId}`}>
                    <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold hover:scale-105 transition cursor-pointer">
                      {post.userInitials}
                    </div>
                  </Link>
                  <div>
                    {/* Name - clickable to user profile */}
                    <Link to={`/user/${post.userId}`} className="font-semibold text-gray-800 hover:underline">
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
