import mockUsers from './data/mockUsers';

imp
const allUsers = userSuggestion;

const user = userSuggestion.find(u => u.id === '1');

const userPosts = user.posts;
const firstPost = user.posts[0];

import { useSelector } from 'react-redux';

const users = useSelector(state => state.users.users);

const user = useSelector(state =>
  state.users.users.find(u => u.id === '1')
);

const userStructure = {
  id: "1",
  initials: "SJ",
  name: "Sarah Johnson",
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
