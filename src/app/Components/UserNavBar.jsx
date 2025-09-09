// import React from 'react'

// const UserNavBar = () => {
//   return (
//     <div>UserNavBar</div>
//   )
// }

// export default UserNavBar

// src/app/Components/UserNavBar.jsx
import { Cinzel } from 'next/font/google';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { logoutAction } from '../serveractions/logoutAction';

// --- Helper function to decode JWT ---
// (It's good practice to keep this consistent across components)
const decodeJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// --- Font for the Brand Name ---
const cinzel = Cinzel({ 
  subsets: ['latin'],
  weight: '700'
});

// --- Main UserNavBar Component ---
const UserNavBar = async () => {
  // Read and decode the cookie to determine user role
  const cookieStore = cookies();
  const token = cookieStore.get('jwt_token')?.value;
  const userData = decodeJwt(token);
  const isAdmin = userData?.isAdmin || false;

  // Determine the correct dashboard link based on role
  const dashboardLink = isAdmin ? '/admin' : '/dashboard';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand Name */}
        <div className={`${cinzel.className} text-3xl font-bold text-white tracking-widest`}>
          <Link href={dashboardLink} className="hover:text-green-300 transition-colors duration-300">
            ECHO MALL
          </Link>
        </div>

        {/* Search Bar (Central Element) */}
        {!isAdmin&&(<>
        <div className="relative w-1/3">
          <input
            type="search"
            placeholder="Search for products..."
            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-green-400"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        </>)}
        

        {/* Role-Based Links & User Actions */}
        <div className="flex items-center space-x-6 text-white">
          {isAdmin ? (
            // Admin Links
            <>
              {/* <Link href="/admin" className="hover:text-green-300 transition-colors">Products</Link>
              <Link href="/admin/orders" className="hover:text-green-300 transition-colors">Orders</Link> */}
            </>
          ) : (
            // Buyer Links
            <>
              <Link href="/dashboard" className="hover:text-green-300 transition-colors">Shop</Link>
              <Link href="/cart" className="relative hover:text-green-300 transition-colors p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                {/* Optional: Cart item count */}
                {/* <span className="absolute top-0 right-0 bg-green-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span> */}
              </Link>
            </>
          )}
          {/* Logout Button */}
          <button onClick={logoutAction} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default UserNavBar;