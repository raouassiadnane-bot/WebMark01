import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import userSuggestion from "../data/UserSuggestion";
import { addPost } from "../store/postsSlice";

export default function Profile() {
  const { id } = useParams();
  const loggedInUser = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  // Determine if this profile is editable or read-only
  useEffect(() => {
    // Profile is editable if:
    // 1. No :id param exists (viewing /profile), OR
    // 2. :id param matches logged-in user's id
    const editable = !id || (loggedInUser && loggedInUser.id === id);
    setIsEditable(editable);
  }, [id, loggedInUser]);

  // Fetch user data
  useEffect(() => {
    let userData;

    // If no ID param or ID matches logged-in user, show logged-in user's profile
    if (!id || (loggedInUser && loggedInUser.id === id)) {
      if (loggedInUser) {
        userData = {
          id: loggedInUser.id,
          initials: (loggedInUser.name?.charAt(0) || "U").toUpperCase() +
                   (loggedInUser.name?.split(" ")[1]?.charAt(0) || "").toUpperCase(),
          name: loggedInUser.name || "My Profile",
          email: loggedInUser.email || "user@example.com",
          role: "User",
          location: "Location",
          joined: new Date(loggedInUser.createdAt).getFullYear(),
          username: loggedInUser.name?.toLowerCase().replace(/\s/g, "") || "user",
        };
      }
    } else if (id) {
      // Fetch other user from UserSuggestion data
      userData = userSuggestion.find(u => u.id === id);
    }

    if (userData) {
      setUser(userData);

      // Load posts from localStorage
      const saved = localStorage.getItem("posts_" + userData.username);
      if (saved) {
        setPosts(JSON.parse(saved));
      } else {
        setPosts([]);
      }
    }
  }, [id, loggedInUser]);

  // Add post (only for editable profiles)
  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.trim() || !isEditable) return;

    const postText = newPost.trim();

    // Add to Redux store for global visibility
    dispatch(addPost({
      userId: user.id,
      userName: user.name,
      userInitials: user.initials,
      text: postText,
    }));

    // Also save to local state and localStorage for profile page
    const updated = [postText, ...posts];
    setPosts(updated);
    localStorage.setItem("posts_" + user.username, JSON.stringify(updated));
    setNewPost("");
  };

  // Delete post (only for editable profiles)
  const handleDeletePost = (index) => {
    if (!isEditable) return;

    const updated = posts.filter((_, i) => i !== index);
    setPosts(updated);
    localStorage.setItem("posts_" + user.username, JSON.stringify(updated));
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
            <h2 className="text-2xl font-bold">
              {isEditable ? "My Profile" : user.name}
            </h2>
            <p className="text-sm text-gray-500">@{user.username}</p>
            {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
            <p className="text-sm text-gray-500">{user.location}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
            <p className="text-sm text-gray-400">Inscrit en {user.joined}</p>
            {!isEditable && (
              <p className="text-xs text-blue-600 mt-2">📖 Read-only profile</p>
            )}
          </div>
        </div>

        {/* Post form - only show for editable profiles */}
        {isEditable && (
          <form onSubmit={handleAddPost} className="space-y-3 border-t pt-6">
            <h3 className="text-lg font-semibold">Write a Blog Post</h3>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Share your thoughts..."
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
            >
              Publish Post
            </button>
          </form>
        )}

        {/* Posts list */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {isEditable ? "My Posts" : `Posts by ${user.name}`}
          </h3>
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post, idx) => (
                <div key={idx} className="bg-gray-50 border rounded-lg p-4 flex justify-between items-start">
                  <p className="text-gray-700 flex-1">{post}</p>
                  {isEditable && (
                    <button
                      onClick={() => handleDeletePost(idx)}
                      className="text-red-600 hover:text-red-800 text-sm ml-4 whitespace-nowrap"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
