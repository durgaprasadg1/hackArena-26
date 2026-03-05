"use client";

import { Dumbbell, Flame, Activity, Zap } from "lucide-react";

const TYPE_COLORS = {
  cardio: "bg-red-50 text-red-600 border-red-200",
  strength: "bg-blue-50 text-blue-600 border-blue-200",
  flexibility: "bg-green-50 text-green-600 border-green-200",
  balance: "bg-purple-50 text-purple-600 border-purple-200",
  functional: "bg-yellow-50 text-yellow-600 border-yellow-200",
};

const DIFFICULTY_COLORS = {
  beginner: "text-green-600",
  intermediate: "text-yellow-600",
  advanced: "text-red-600",
};

export default function ExerciseStatsCard({ logs }) {
  const byType = logs.reduce((acc, l) => {
    const t = l.exerciseType || "other";
    acc[t] = (acc[t] || 0) + (l.caloriesBurned || 0);
    return acc;
  }, {});

  const types = Object.entries(byType).sort((a, b) => b[1] - a[1]);
  const total = types.reduce((s, [, v]) => s + v, 0);

  return (
    <div className="bg-white border rounded-xl p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4 text-blue-500" /> Workout Breakdown
      </h3>

      {logs.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          No exercises logged yet today.
        </p>
      ) : (
        <div className="space-y-3">
          {types.map(([type, cal]) => {
            const pct = total > 0 ? Math.round((cal / total) * 100) : 0;
            return (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize font-medium">{type}</span>
                  <span className="text-gray-500">{Math.round(cal)} kcal</span>
                </div>
                <div className="h-2 bg-gray-100 rounded">
                  <div
                    className="h-2 rounded bg-orange-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span>
            Total: <strong className="text-gray-800">{total} kcal</strong>{" "}
            burned today
          </span>
        </div>
      </div>
    </div>
  );
}
