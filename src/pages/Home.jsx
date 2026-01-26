import React, { useEffect, useState } from 'react';

// Faux utilisateurs pour posts aléatoires
const randomUsers = [
  { initials: "SJ", name: "Sarah Johnson", username: "@sarahj" },
  { initials: "MC", name: "Michael Chen", username: "@mchen" },
  { initials: "EG", name: "Emma Garcia", username: "@emmag" },
  { initials: "AD", name: "Adnane", username: "@adnanra" }, // toi
];

// Faux posts générés
const randomPosts = [
  "Exploring new marketing strategies today 🚀",
  "Just finished a design sprint, feeling inspired!",
  "Learning React + Tailwind, amazing combo 💻",
  "Community feedback is the best way to grow 🌍",
];

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // ✅ Récupère tes posts depuis localStorage avec la bonne clé
    const saved = localStorage.getItem('posts_adnanra');
    const myPosts = saved ? JSON.parse(saved) : [];

    // Génère quelques posts aléatoires
    const otherPosts = Array.from({ length: 3 }).map(() => {
      const user = randomUsers[Math.floor(Math.random() * randomUsers.length)];
      const text = randomPosts[Math.floor(Math.random() * randomPosts.length)];
      return { user, text };
    });

    // Combine tes posts + posts aléatoires
    const combined = [
      ...myPosts.map((p) => ({
        user: randomUsers.find((u) => u.username === "@adnanra"),
        text: p,
      })),
      ...otherPosts,
    ];

    setPosts(combined);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Bienvenue sur <span className="text-purple-600">WebMark</span>
        </h2>
        
        {/* Liste des posts */}
        <div className="mt-8 space-y-4">
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center">Aucun post pour le moment.</p>
          ) : (
            posts.map((post, idx) => (
              <div key={idx} className="bg-gray-50 border rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {post.user.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{post.user.name}</p>
                    <p className="text-sm text-gray-500">{post.user.username}</p>
                  </div>
                </div>
                <p className="text-gray-700">{post.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
