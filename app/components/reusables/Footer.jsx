"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer on onboarding flow
  if (pathname.startsWith("/onboarding")) return null;

  return (
    <footer className="border-t bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* TOP GRID */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* BRAND */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2 font-semibold text-lg">
              🥗 NutriSyncAI
            </div>

            <p className="text-gray-600 text-sm max-w-sm">
              Personalized AI powered nutrition guidance helping you achieve
              better health through smart meal planning, hydration tracking and
              dietary insights.
            </p>

            {/* SOCIALS */}
            <div className="flex gap-4 pt-2 text-gray-500">
              <Link href="#">
                <Github size={20} />
              </Link>
              <Link href="#">
                <Twitter size={20} />
              </Link>
              <Link href="#">
                <Linkedin size={20} />
              </Link>
              <Link href="#">
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Product</h4>

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <Link href="/meals">Meal Planner</Link>
              <Link href="/exercises">Exercise Tracker</Link>
              <Link href="/history">Nutrition AI</Link>
              <Link href="/hydration">Hydration Tracker</Link>
              <Link href="/pricing">Pricing</Link>
            </div>
          </div>

          {/* COMPANY */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Company</h4>

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <Link href="#">About</Link>
              <Link href="#">Careers</Link>
              <Link href="#">Blog</Link>
              <Link href="#">Press</Link>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Stay Updated</h4>

            <p className="text-sm text-gray-600">
              Get nutrition tips and product updates.
            </p>

            <div className="flex gap-2">
              <Input placeholder="Email address" />

              <Button className="bg-gray-600 hover:bg-black text-white">
                Join
              </Button>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}

        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} NutriSyncAI. All rights reserved.</p>

          <div className="flex gap-6">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
