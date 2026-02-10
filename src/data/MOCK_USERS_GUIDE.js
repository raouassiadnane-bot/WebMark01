// MOCK USERS SETUP GUIDE
// This file explains how to use the mock users in your React + Vite + Redux project

/**
 * ============================================
 * 1. BASIC USAGE (No Redux needed)
 * ============================================
 *
 * If you just want to access mock users directly:
 */

// Option A: Import from UserSuggestion.js (RECOMMENDED)
import userSuggestion from './data/UserSuggestion';

// Option B: Import from mockUsers.js (Alternative)
import mockUsers from './data/mockUsers';

// Both files have the same data structure:
// [
//   { id, name, username, role, location, joined, bio, avatar, posts }
// ]

/**
 * ============================================
 * 2. ACCESSING MOCK DATA
 * ============================================
 */

// Get all users
const allUsers = userSuggestion;

// Find a specific user by ID
const user = userSuggestion.find(u => u.id === '1');
// Returns: {
//   id: "1",
//   name: "Sarah Johnson",
//   username: "sarahj",
//   bio: "✨ Travel blogger | Photography enthusiast...",
//   posts: [ { id, text, timestamp }, ... ]
// }

// Get user's posts
const userPosts = user.posts; // Array of post objects
const firstPost = user.posts[0];
// Returns: {
//   id: "1-1",
//   text: "Just finished an amazing trip...",
//   timestamp: "2025-02-08T10:30:00Z"
// }

/**
 * ============================================
 * 3. USING WITH REDUX
 * ============================================
 */

// The Redux store now includes users slice:
import { useSelector } from 'react-redux';

// Access all mock users from Redux
const users = useSelector(state => state.users.users);

// Get a specific user
const user = useSelector(state =>
  state.users.users.find(u => u.id === '1')
);

/**
 * ============================================
 * 4. ROUTING - View User Profiles
 * ============================================
 */

// The app already has routing set up for user profiles:
// Route: /user/:id
// Component: UserProfile.jsx
//
// Navigate to view a mock user profile:
// <Link to="/user/1">View Sarah's Profile</Link>
// <Link to="/user/2">View Michael's Profile</Link>
// <Link to="/user/3">View Emma's Profile</Link>
// <Link to="/user/4">View James's Profile</Link>
// <Link to="/user/5">View Lisa's Profile</Link>

// The UserProfile.jsx component:
// ✅ Displays user info (name, bio, role, location, joined date)
// ✅ Shows all mock posts with timestamps
// ✅ Is completely read-only (no editing capability)
// ✅ Clearly marked as "Read-only profile (visitor view)"

/**
 * ============================================
 * 5. YOUR OWN PROFILE (/profile)
 * ============================================
 */

// Your profile page (/profile) remains completely unchanged:
// ✅ Editable
// ✅ Can add new posts
// ✅ Can delete posts
// ✅ Uses your authenticated user data
//
// User Flow:
// - /profile → Your own editable profile
// - /user/:id → Other users' read-only profiles

/**
 * ============================================
 * 6. DATA STRUCTURE REFERENCE
 * ============================================
 */

const userStructure = {
  id: "1",                           // Unique ID
  initials: "SJ",                    // For avatar display
  name: "Sarah Johnson",             // Full name
  username: "sarahj",                // Username (without @)
  role: "Content Creator",           // Job title
  location: "Paris, France",         // Location
  joined: "2025",                    // Join year
  bio: "✨ Travel blogger | ...",    // Bio/description
  avatar: "https://api...",          // Avatar URL (from dicebear API)
  posts: [
    {
      id: "1-1",
      text: "Post content goes here",
      timestamp: "2025-02-08T10:30:00Z",
    },
    // ... more posts
  ],
};

/**
 * ============================================
 * 7. QUICK EXAMPLE: Link to User Profiles
 * ============================================
 */

import { Link } from 'react-router-dom';
import userSuggestion from './data/UserSuggestion';

export function UsersList() {
  return (
    <div>
      {userSuggestion.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <Link to={`/user/${user.id}`}>View Profile</Link>
        </div>
      ))}
    </div>
  );
}

/**
 * ============================================
 * 8. FILES INVOLVED
 * ============================================
 */

// Data files:
// src/data/UserSuggestion.js  → Mock users with posts, bio, avatar
// src/data/mockUsers.js       → Alternative copy of the same data

// Component file:
// src/pages/UserProfile.jsx   → Displays read-only user profiles

// Redux files:
// src/store/usersSlice.js     → Redux slice for users management
// src/Redux/store.js          → Redux store (now includes users slice)

// Routing:
// src/App.jsx                 → /user/:id route already set up

/**
 * ============================================
 * 9. ADDING MORE MOCK USERS
 * ============================================
 */

// To add more mock users, edit UserSuggestion.js or mockUsers.js:
// 1. Open the file
// 2. Add a new object to the array with required fields:

const newUser = {
  id: "6",
  initials: "XX",
  name: "New Person",
  username: "newperson",
  role: "Role",
  location: "Location",
  joined: "2025",
  bio: "Your bio here",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NewPerson",
  posts: [
    {
      id: "6-1",
      text: "First post",
      timestamp: "2025-02-10T12:00:00Z",
    },
  ],
};

/**
 * ============================================
 * 10. TESTING THE SETUP
 * ============================================
 */

// 1. Run your Vite dev server
// npm run dev
//
// 2. Login/authenticate to access protected routes
//
// 3. Visit these URLs to test:
// http://localhost:5173/user/1  → Sarah's profile
// http://localhost:5173/user/2  → Michael's profile
// http://localhost:5173/user/3  → Emma's profile
// http://localhost:5173/user/4  → James's profile
// http://localhost:5173/user/5  → Lisa's profile
//
// 4. Visit /profile to see your own editable profile
//
// 5. Compare:
// - /profile = Editable, with post form
// - /user/1 = Read-only, just displays info and posts

/**
 * ============================================
 * SUMMARY
 * ============================================
 *
 * ✅ 5 mock users with detailed profiles
 * ✅ Each user has 3 sample posts
 * ✅ Read-only visitor view at /user/:id
 * ✅ Your own editable profile at /profile
 * ✅ Data stored in UserSuggestion.js (and mockUsers.js)
 * ✅ Redux integration available if needed
 * ✅ Works with Vite + React + Redux
 * ✅ Responsive Tailwind styling
 * ✅ Ready to use immediately!
 */
