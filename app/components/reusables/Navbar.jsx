import React from 'react';
import { Bell, } from 'lucide-react';
import Link from 'next/link';
const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-[#556B2F]">NutriSync AI</span>
            </div>
            <div className="hidden sm:flex sm:space-x-8">
              <Link href="/dashboard" className="border-[#556B2F] text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/meals" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Meal Log
              </Link>
              <Link href="/exercise" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Exercise
              </Link>
              <Link href="/history" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                History
              </Link>
              <Link href="/add-experiences" className="border-[#556B2F] text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Experiences
              </Link>
              
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-100"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGQF3fxXOFITCZEzciPLdcKfqzJ_IWt4-HYDWyC-2E-A3Ws_VJLkUHFTADPLnlKb0EPCQtBFvvi_MQGQDexbEteTarqj_omxjpx1MPoXTRq6D1UHmZS8kmRdYpOAns3oysMoR57QYTOfOsd79gvRzRLS11DzvaVh4YUhYjWgnMOEaAPLHlzJgTuAWDGNFs3xkAwMb_BjnydGDU-a3oWDdwqRfTf4wN2ltkm6pvjeMi3A-EQ-cTvwV0YOPmYyx8hJ8XGIw3nQFqEc8"
                alt="User avatar"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
