"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Dumbbell,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({ food: null, exercises: null });

  useEffect(() => {
    // Fetch counts in parallel
    Promise.all([
      fetch("/api/meals/admin/approve").then((r) => r.json()),
      fetch("/api/exercises/admin/approve").then((r) => r.json()),
    ])
      .then(([foodData, exData]) => {
        setCounts({
          food: foodData.count ?? foodData.pendingRequests?.length ?? 0,
          exercises: exData.exercises?.length ?? 0,
        });
      })
      .catch(() => setCounts({ food: 0, exercises: 0 }));
  }, []);

  const cards = [
    {
      href: "/admin/food-requests",
      icon: UtensilsCrossed,
      label: "Food Requests",
      description: "Review user-submitted food items pending verification.",
      count: counts.food,
      accent: "bg-emerald-700",
      lightBg: "bg-emerald-50",
      textAccent: "text-emerald-700",
      borderAccent: "border-emerald-200",
    },
    {
      href: "/admin/exercise-requests",
      icon: Dumbbell,
      label: "Exercise Requests",
      description: "Review user-submitted exercises pending verification.",
      count: counts.exercises,
      accent: "bg-teal-700",
      lightBg: "bg-teal-50",
      textAccent: "text-teal-700",
      borderAccent: "border-teal-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2.5 rounded-xl bg-emerald-700/10">
            <ShieldCheck className="h-7 w-7 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage pending submissions from users.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map(
            ({
              href,
              icon: Icon,
              label,
              description,
              count,
              accent,
              lightBg,
              textAccent,
              borderAccent,
            }) => (
              <Link
                key={href}
                href={href}
                className={`group bg-white border ${borderAccent} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${lightBg}`}>
                    <Icon className={`h-6 w-6 ${textAccent}`} />
                  </div>
                  {count !== null && (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${accent}`}
                    >
                      {count} pending
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {label}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{description}</p>
                </div>

                <div
                  className={`flex items-center gap-1 text-sm font-medium ${textAccent} mt-auto`}
                >
                  Review requests
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
