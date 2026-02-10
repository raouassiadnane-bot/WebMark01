import React from "react";
import { Link } from "react-router-dom";
import userSuggestion from "../data/UserSuggestion";

/**
 * MockUsersList Component
 * Displays all mock users as clickable links to their profiles
 *
 * Usage: <MockUsersList />
 */
export default function MockUsersList() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Community Profiles</h1>
          <p className="text-blue-100">Click on any profile to view their details and posts (read-only)</p>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userSuggestion.map((user) => (
            <Link key={user.id} to={`/user/${user.id}`}>
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 h-full">
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold">
                    {user.initials}
                  </div>
                </div>

                {/* User Info */}
                <h2 className="text-xl font-bold text-center mb-1 text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-600 text-center mb-2">@{user.username}</p>

                {/* Role and Location */}
                <div className="text-xs text-gray-500 text-center mb-3">
                  <p className="font-semibold">{user.role}</p>
                  <p>📍 {user.location}</p>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-700 text-center mb-4 line-clamp-2 h-10">
                  {user.bio}
                </p>

                {/* Posts Count */}
                <div className="border-t pt-3 text-center">
                  <p className="text-sm text-purple-600 font-semibold">
                    {user.posts?.length || 0} posts
                  </p>
                </div>

                {/* View Button */}
                <div className="mt-4">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition font-medium">
                    View Profile
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-white bg-opacity-10 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">ℹ️ About Mock Profiles</h3>
          <p className="text-sm text-blue-100 mb-2">
            These are test user accounts with sample posts. You can view their profiles in read-only mode.
          </p>
          <p className="text-sm text-blue-100">
            Go to <span className="font-semibold">/profile</span> to view and edit your own profile.
          </p>
        </div>
      </div>
    </div>
  );
}
