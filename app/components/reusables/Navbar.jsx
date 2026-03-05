"use client";

import React from "react";
import { Search, Bell, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

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
            <div className="shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-2"
              >
                <span className="text-xl font-bold text-gray-900">
                  NutriSync AI
                </span>
              </Link>
            </div>

            {/* Navigation - Only show when signed in */}
            {isSignedIn && (
              <div className="hidden md:flex md:space-x-8">
                {navItem("/dashboard", "Dashboard")}
                {navItem("/meals", "Meal")}
                {navItem("/exercises", "Exercise")}
                {navItem("/community", "Community")}
                {navItem("/history", "History")}
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search - Only show when signed in */}
            {isSignedIn && (
              <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search workouts..."
                  className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                />
              </div>
            )}

            {/* Icons - Only show when signed in */}
            {isSignedIn && (
              <>
                <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>

                <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Conditional rendering based on auth status */}
            {isLoaded && (
              <>
                {isSignedIn ? (
                  /* User Button when signed in */
                  <div className="shrink-0 ml-2">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "h-8 w-8 ring-2 ring-gray-100",
                        },
                      }}
                    />
                  </div>
                ) : (
                  /* Login/Register buttons when signed out */
                  <div className="flex items-center gap-3">
                    <Link
                      href="/sign-in"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/sign-up"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#10B981] hover:bg-[#0ea572] rounded-lg transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
