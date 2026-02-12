/**
 * API wrapper entry point
 *
 * This file re-exports the implementation in `src/services/userApi.js`.
 * Use this module throughout the app as the canonical users API. It
 * preserves local mock files as a fallback (implemented in services/userApi).
 */
import * as impl from '../services/userApi';

export const getUsers = impl.getUsers;
export const getUser = impl.getUser;
export const createUser = impl.createUser;
export const updateUser = impl.updateUser;
export const deleteUser = impl.deleteUser;
export const usedFallback = impl.usedFallback;

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  usedFallback,
};
