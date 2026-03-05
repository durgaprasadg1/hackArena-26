"use client";

import { Flame, Timer, Dumbbell, TrendingUp } from "lucide-react";

export default function ExerciseSummary({ totals, calorieGoal = 500 }) {
  const burned = totals?.caloriesBurned || 0;
  const count = totals?.exerciseCount || 0;
  const minutes = totals?.totalMinutes || 0;
  const percent = Math.min(100, Math.round((burned / calorieGoal) * 100));

  return (
    <div className="bg-white border rounded-xl p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Flame className="w-4 h-4 text-orange-500" /> Daily Summary
      </h3>

      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-orange-500">
          {burned.toLocaleString()}
        </div>
        <p className="text-gray-500 text-sm">KCAL BURNED</p>
        <div className="mt-3">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${percent >= 100 ? "bg-green-500" : "bg-orange-400"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{percent}% of daily goal</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="border rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Goal</p>
          <p className="font-semibold">{calorieGoal.toLocaleString()}</p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Remaining</p>
          <p
            className={`font-semibold ${percent >= 100 ? "text-green-600" : "text-orange-500"}`}
          >
            {Math.max(0, calorieGoal - burned).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Exercises</p>
            <p className="font-semibold">{count}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
            <Timer className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Minutes</p>
            <p className="font-semibold">{minutes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
