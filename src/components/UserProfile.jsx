import React from 'react'

export default function UserProfile({user}){
  if(!user) return null
  return (
    <div className="bg-white p-4 rounded shadow">
      <h4 className="font-semibold">{user.name}</h4>
      <p className="text-sm text-gray-600">{user.email}</p>
    </div>
  )
}
