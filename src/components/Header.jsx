import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-brand-700 tracking-wide">
          WebMark
        </h1>

        {/* Navigation */}
        <nav className="flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-brand-700 font-semibold border-b-2 border-brand-700 pb-1'
                : 'text-gray-600 hover:text-brand-500 transition'
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? 'text-brand-700 font-semibold border-b-2 border-brand-700 pb-1'
                : 'text-gray-600 hover:text-brand-500 transition'
            }
          >
            Login
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? 'text-brand-700 font-semibold border-b-2 border-brand-700 pb-1'
                : 'text-gray-600 hover:text-brand-500 transition'
            }
          >
            Profile
          </NavLink>

          {/* ✅ Nouveau lien vers la page Contact */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? 'text-brand-700 font-semibold border-b-2 border-brand-700 pb-1'
                : 'text-gray-600 hover:text-brand-500 transition'
            }
          >
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
