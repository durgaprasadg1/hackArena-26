"use client";

export default function MacrosCard({ totals, userGoals }) {
  // Default or user-specific macro goals (in grams)
  const proteinGoal = userGoals?.protein || 150;
  const carbsGoal = userGoals?.carbs || 250;
  const fatGoal = userGoals?.fat || 65;

  const macros = [
    {
      name: "Protein",
      current: Math.round(totals?.protein || 0),
      goal: proteinGoal,
      color: "bg-blue-500",
    },
    {
      name: "Carbs",
      current: Math.round(totals?.carbs || 0),
      goal: carbsGoal,
      color: "bg-yellow-500",
    },
    {
      name: "Fat",
      current: Math.round(totals?.fat || 0),
      goal: fatGoal,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="bg-white border rounded-xl p-6">
      <h3 className="font-semibold mb-4">Macronutrients</h3>

      <div className="space-y-4">
        {macros.map((m) => {
          const progress = Math.min(100, (m.current / m.goal) * 100);

          return (
            <div key={m.name}>
              <div className="flex justify-between text-sm mb-1">
                <span>{m.name}</span>
                <span className="text-gray-500">
                  {m.current}g / {m.goal}g
                </span>
              </div>

              <div className="h-2 bg-gray-100 rounded">
                <div
                  className={`h-2 rounded ${m.color}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional info */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Fiber</span>
          <span className="font-semibold">
            {Math.round(totals?.fiber || 0)}g
          </span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">Sugar</span>
          <span className="font-semibold">
            {Math.round(totals?.sugar || 0)}g
          </span>
        </div>
      </div>
    </div>
  );
}
