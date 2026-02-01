// src/components/UserProfile.jsx
import React from 'react'

export default function UserProfile({ user }) {
  if (!user) return null

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold text-purple-700">{user.name}</h2>
      <p className="text-sm text-gray-600">{user.email}</p>
    </div>
  )
}
