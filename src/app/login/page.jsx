// src/app/login/page.jsx
import React from 'react';
import { LoginAction } from '../serveractions/LoginAction';

const Page = () => {
  return (
    <main className="bg-gradient-to-br from-green-900 to-black min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8 pt-20">
        {/* User Icon */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-800 p-4 rounded-full border-4 border-white/20">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
        </div>

        <form action={LoginAction} className="space-y-6">
          {/* Email Input */}
          <div>
            <div className="relative flex items-center bg-white/20 rounded-lg border border-white/30 px-3 py-2">
              <svg
                className="w-5 h-5 text-gray-300 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              {/* Note: Label is visually hidden but important for accessibility */}
              <label htmlFor="email" className="sr-only">Email ID:</label>
              <input
                id="email"
                type="email"
                name="email"
                required
                className="flex-grow bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-0"
                placeholder="Email ID"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="relative flex items-center bg-white/20 rounded-lg border border-white/30 px-3 py-2">
              <svg
                className="w-5 h-5 text-gray-300 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              {/* Note: Label is visually hidden but important for accessibility */}
              <label htmlFor="password" className="sr-only">Password:</label>
              <input
                id="password"
                type="password"
                name="password"
                required
                className="flex-grow bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-0"
                placeholder="Password"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password
          <div className="flex justify-between items-center text-sm text-gray-200">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-600 rounded bg-white/20"
              />
              <label htmlFor="remember_me" className="ml-2">
                Remember me
              </label>
            </div>
            <a href="#" className="font-medium text-green-300 hover:text-green-200 hover:underline">
              Forgot Password?
            </a>
          </div> */}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
          >
            LOGIN
          </button>
        </form>
      </div>
    </main>
  );
};

export default Page;