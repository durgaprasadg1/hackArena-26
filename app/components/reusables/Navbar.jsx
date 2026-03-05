"use client";

import React from "react";
import { Search, Bell, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const navItem = (href, label) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
          isActive
            ? "border-[#10B981] text-gray-900"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Section */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                NutriSync AI
              </span>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex md:space-x-8">
              {navItem("/dashboard", "Dashboard")}
              {navItem("/meals", "Meal")}
              {navItem("/exercise", "Exercise")}
              {navItem("/community", "Community")}
              {navItem("/reports", "Reports")}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search workouts..."
                className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
              />
            </div>

            {/* Icons */}
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* Avatar */}
            <div className="flex-shrink-0 ml-2">
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
