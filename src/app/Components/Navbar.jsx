// src/app/Components/Navbar.jsx
import React from 'react';
import Link from 'next/link';
// 1. Import the font from next/font/google
import { Cinzel } from 'next/font/google';

// 2. Configure the font
const cinzel = Cinzel({ 
  subsets: ['latin'],
  weight: '700' // Using a bold weight
});

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand Name with the new font */}
        <div 
          // 3. Apply the font's className here
          className={`${cinzel.className} text-3xl font-bold text-white tracking-widest`}
        >
          <Link href="/home" className="hover:text-green-300 transition-colors duration-300">
            ECHO MALL
          </Link>
        </div>

        {/* Navigation Links (Unchanged) */}
        <div className="flex items-center space-x-8">
          <Link href={'/home'} className="text-gray-200 hover:text-white transition-colors duration-300">
            Home
          </Link>
          <Link href={'/about'} className="text-gray-200 hover:text-white transition-colors duration-300">
            About
          </Link>
          <Link href={'/contact'} className="text-gray-200 hover:text-white transition-colors duration-300">
            Contact
          </Link>
          <Link 
            href={'/login'} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg transition-transform transform hover:scale-105"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;