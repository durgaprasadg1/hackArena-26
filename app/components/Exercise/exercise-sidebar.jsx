"use client";

import { Dumbbell, Activity, Zap, Scale, Workflow, LayoutGrid } from "lucide-react";

const TYPES = [
  { id: "all", label: "All Types", icon: LayoutGrid },
  { id: "cardio", label: "Cardio", icon: Activity },
  { id: "strength", label: "Strength", icon: Dumbbell },
  { id: "flexibility", label: "Flexibility", icon: Zap },
  { id: "balance", label: "Balance", icon: Scale },
  { id: "functional", label: "Functional", icon: Workflow },
];

const DIFFICULTIES = [
  { id: "all", label: "All Levels" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const DIFFICULTY_COLOR = {
  beginner: "text-green-600 bg-green-50 border-green-200",
  intermediate: "text-yellow-600 bg-yellow-50 border-yellow-200",
  advanced: "text-red-600 bg-red-50 border-red-200",
  all: "text-gray-600 bg-gray-50 border-gray-200",
};

export default function ExerciseSidebar({ filterType, setFilterType, filterDifficulty, setFilterDifficulty }) {
  return (
    <div className="space-y-4">
      {/* Type filter */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {TYPES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setFilterType(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 border-b last:border-none transition-colors text-sm
              ${filterType === id
                ? "bg-emerald-50 text-emerald-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="capitalize">{label}</span>
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="bg-white border rounded-xl p-4 space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Difficulty</p>
        {DIFFICULTIES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilterDifficulty(id)}
            className={`w-full text-left px-3 py-2 rounded-lg border text-sm capitalize transition-colors font-medium
              ${filterDifficulty === id
                ? DIFFICULTY_COLOR[id]
                : "text-gray-500 bg-white border-gray-200 hover:bg-gray-50"}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
