import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UserCard({ user }) {
  const navigate = useNavigate();
  const loggedInUser = useSelector(state => state.auth.user);

  const handleProfileClick = () => {
    // If it's the logged-in user, go to /profile
    // Otherwise, go to /user/:id
    if (loggedInUser && loggedInUser.id === user.id) {
      navigate('/profile');
    } else {
      navigate(`/user/${user.id}`);
    }
  };

  return (
    <div
      onClick={handleProfileClick}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
    >
      {/* User Avatar */}
      <div className="mb-4">
        <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-lg font-bold mx-auto">
          {user.initials}
        </div>
      </div>

      {/* User Info */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {loggedInUser && loggedInUser.id === user.id ? "Your Profile" : user.name}
        </h3>
        <p className="text-sm text-gray-500">@{user.username}</p>
        <p className="text-sm text-gray-600 mt-2">{user.role}</p>
        <p className="text-xs text-gray-400">{user.location}</p>
      </div>

      {/* View Profile Button */}
      <button
        className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition"
        onClick={handleProfileClick}
      >
        {loggedInUser && loggedInUser.id === user.id ? "View Your Profile" : "View Profile"}
      </button>
    </div>
  );
}
