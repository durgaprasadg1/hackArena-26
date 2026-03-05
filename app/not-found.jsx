"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-white to-green-50">

      <div className="max-w-2xl text-center space-y-8">

        <h1 className="text-7xl md:text-8xl font-bold text-green-600">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
          Page not found
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-base md:text-lg">
          Looks like the page you're looking for doesn't exist or has been moved.
          But don't worry — you can still continue your nutrition journey.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">

          <Link href="/">
            <Button className="bg-green-600 hover:bg-black text-white rounded-full flex gap-2">
              <Home size={16} />
              Go Home
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-full flex gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>

        </div>

        {/* Helpful Links */}
        <div className="pt-6 text-sm text-gray-500">
          <p className="mb-3">You might be looking for:</p>

          <div className="flex flex-wrap justify-center gap-4">

            <Link href="/dashboard" className="hover:text-green-600">
              Dashboard
            </Link>

            <Link href="/features" className="hover:text-green-600">
              Features
            </Link>

            <Link href="/pricing" className="hover:text-green-600">
              Pricing
            </Link>

          </div>
        </div>

      </div>
    </div>
  )
}