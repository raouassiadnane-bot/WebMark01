import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-600 text-white mt-12">
      <div className="container mx-auto px-6 py-10">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          {/* Logo & description */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">WebMark</h2>
            <p className="mt-2 text-sm text-purple-100">
              Outil moderne pour les étudiants et professionnels du marketing.
            </p>
          </div>

          {/* Navigation links */}
          <div className="flex space-x-6 text-sm">
            <a href="/" className="hover:text-purple-300 transition">Home</a>
            <a href="/login" className="hover:text-purple-300 transition">Login</a>
            <a href="/profile" className="hover:text-purple-300 transition">Profile</a>
          </div>

          {/* Social icons */}
          <div className="flex space-x-4">
            <a href="#" className="hover:text-purple-300 transition">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="hover:text-purple-300 transition">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-purple-300 transition">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-purple-500 mt-8 pt-6 text-center text-sm text-purple-100">
          © {new Date().getFullYear()} WebMark — Moderne UI. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
