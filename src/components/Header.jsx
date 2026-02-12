import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.removeItem('profile');
    localStorage.removeItem('onboarded');
    dispatch(logout());
    navigate('/signup');
  };

  const onboarded = localStorage.getItem('onboarded') === 'true';

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="bg-purple-600 text-white p-1.5 rounded-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight cursor-pointer" onClick={() => navigate('/')}>
            WebMark
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          {user && onboarded ? (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? 'text-purple-600 font-semibold border-b-2 border-purple-600 pb-1'
                    : 'text-gray-600 hover:text-purple-500 transition'
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? 'text-purple-600 font-semibold border-b-2 border-purple-600 pb-1'
                    : 'text-gray-600 hover:text-purple-500 transition'
                }
              >
                Profile
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive
                    ? 'text-purple-600 font-semibold border-b-2 border-purple-600 pb-1'
                    : 'text-gray-600 hover:text-purple-500 transition'
                }
              >
                Contact
              </NavLink>

              {/* User Info & Logout */}
              <div className="flex items-center space-x-4 pl-4 border-l">
                <div className="flex items-center space-x-2">
                  <div className="bg-purple-100 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {user.initials || user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-sm transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? 'text-purple-600 font-semibold border-b-2 border-purple-600 pb-1'
                    : 'text-gray-600 hover:text-purple-500 transition'
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition shadow-sm"
              >
                Get Started
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
