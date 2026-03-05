"use client";

export default function DailySummary({ totals, userGoal }) {
  const caloriesLogged = Math.round(totals?.calories || 0);
  const dailyGoal = userGoal || 2000;
  const remaining = Math.max(0, dailyGoal - caloriesLogged);
  const percentComplete = Math.min(
    100,
    Math.round((caloriesLogged / dailyGoal) * 100),
  );

  return (
    <div className="bg-white border rounded-xl p-6 text-center">
      <h3 className="font-semibold mb-4">Daily Summary</h3>

      <div className="text-3xl font-bold text-green-600">
        {caloriesLogged.toLocaleString()}
      </div>

      <p className="text-gray-500 text-sm">KCAL LOGGED</p>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              percentComplete >= 100 ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ width: `${percentComplete}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {percentComplete}% of daily goal
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="border rounded-lg p-3">
          <p className="text-xs text-gray-500">Goal</p>
          <p className="font-semibold">{dailyGoal.toLocaleString()}</p>
        </div>

        <div className="border rounded-lg p-3">
          <p className="text-xs text-gray-500">Remaining</p>
          <p
            className={`font-semibold ${percentComplete >= 100 ? "text-red-600" : "text-green-600"}`}
          >
            {remaining.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
