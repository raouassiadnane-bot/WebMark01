import axios from 'axios';
import localUsers from '../data/UserSuggestion';

// Axios instance for MockAPI
const api = axios.create({
  baseURL: 'https://698c3ba621a248a27360e62e.mockapi.io/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 6000,
});

const USERS_PATH = '/user';

// In-memory local cache seeded from local mock data. We never write back to files.
let localCache = Array.isArray(localUsers) ? [...localUsers] : [];
let _usedFallback = false;

function markFallback(flag) {
  _usedFallback = !!flag;
}

export function usedFallback() {
  return _usedFallback;
}

/**
 * Get list of users with optional params. Falls back to local cache on network errors.
 */
export async function getUsers(params) {
  try {
    const res = await api.get(USERS_PATH, { params });
    markFallback(false);
    return res.data;
  } catch (err) {
    markFallback(true);
    // Basic support for `limit` and `page` if provided
    if (params && (params.limit || params.page)) {
      const limit = parseInt(params.limit, 10) || 10;
      const page = parseInt(params.page, 10) || 1;
      const start = (page - 1) * limit;
      return localCache.slice(start, start + limit);
    }
    return localCache;
  }
}

/**
 * Get single user by id. Falls back to local cache on network errors.
 */
export async function getUser(id) {
  try {
    const res = await api.get(`${USERS_PATH}/${id}`);
    markFallback(false);
    return res.data;
  } catch (err) {
    markFallback(true);
    return localCache.find(u => String(u.id) === String(id)) || null;
  }
}

/**
 * Create a new user. If API fails, add to in-memory cache and return simulated created object.
 */
export async function createUser(payload) {
  try {
    const res = await api.post(USERS_PATH, payload);
    markFallback(false);
    return res.data;
  } catch (err) {
    markFallback(true);
    const id = `local-${Date.now()}`;
    const created = { id, ...payload };
    localCache = [created, ...localCache];
    return created;
  }
}

/**
 * Update existing user. If API fails, update in-memory cache and return updated object.
 */
export async function updateUser(id, payload) {
  try {
    const res = await api.put(`${USERS_PATH}/${id}`, payload);
    markFallback(false);
    return res.data;
  } catch (err) {
    markFallback(true);
    let updated = null;
    localCache = localCache.map(u => {
      if (String(u.id) === String(id)) {
        updated = { ...u, ...payload };
        return updated;
      }
      return u;
    });
    return updated;
  }
}

/**
 * Delete a user. If API fails, remove from in-memory cache and return the id.
 */
export async function deleteUser(id) {
  try {
    const res = await api.delete(`${USERS_PATH}/${id}`);
    markFallback(false);
    return res.data;
  } catch (err) {
    markFallback(true);
    const prevLength = localCache.length;
    localCache = localCache.filter(u => String(u.id) !== String(id));
    return { id, removed: prevLength !== localCache.length };
  }
}

const userApi = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  usedFallback,
};

export default userApi;
