import React, { useEffect, useState } from 'react';
import userApi, { usedFallback } from '../api/userApi';

// Optional Redux asyncThunk example (paste inside a slice file):
// import { createAsyncThunk } from '@reduxjs/toolkit';
// export const fetchUsersThunk = createAsyncThunk('users/fetch', async () => {
//   return await userApi.getUsers();
// });

export default function ApiUsersExample() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.getUsers();
      setUsers(data);
      setIsFallback(usedFallback());
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    const payload = {
      name: 'Temp User',
      username: `temp${Date.now()}`,
      initials: 'TU',
      role: 'Tester',
      location: 'Remote',
      joined: '2026',
      bio: 'Created from UI',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Temp${Date.now()}`,
    };

    try {
      const created = await userApi.createUser(payload);
      setUsers(prev => [created, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await userApi.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium mb-2">MockAPI Users</h2>

      {isFallback && (
        <div className="mb-2 text-sm text-yellow-800 bg-yellow-100 px-2 py-1 rounded">Using local fallback data (offline)</div>
      )}

      <div className="mb-3">
        <button onClick={handleCreate} className="px-3 py-1 bg-blue-600 text-white rounded">
          Create sample
        </button>
        <button onClick={fetchUsers} className="ml-2 px-3 py-1 bg-gray-200 rounded">
          Refresh
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}

      <ul>
        {users.map(u => (
          <li key={u.id} className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{u.name} <span className="text-sm text-gray-500">(@{u.username})</span></div>
              <div className="text-sm text-gray-600">{u.role} · {u.location}</div>
            </div>
            <div>
              <button onClick={() => handleDelete(u.id)} className="text-sm text-red-600">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
