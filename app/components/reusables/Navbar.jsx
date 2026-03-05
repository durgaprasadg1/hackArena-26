"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3">

        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-lg">
          🥗 <span>NutriSyncAI</span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex gap-8 text-sm text-gray-600">
          <Link href="/">Home</Link>
          <Link href="/">Features</Link>
          <Link href="/">Pricing</Link>
        </nav>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button variant="ghost">Login</Button>

          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}