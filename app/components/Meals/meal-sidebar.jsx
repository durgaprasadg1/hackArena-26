export default function MealSidebar() {

  const meals = [
    { name: "Breakfast", kcal: 350, active: true },
    { name: "Lunch", kcal: 650 },
    { name: "Dinner", kcal: 0 },
    { name: "Snacks", kcal: 120 },
  ]

  return (
    <div className="space-y-4">

      <div className="bg-white border rounded-xl overflow-hidden">

        {meals.map((meal) => (
          <div
            key={meal.name}
            className={`flex justify-between px-4 py-3 border-b last:border-none
            ${meal.active ? "bg-green-50 text-green-700 font-medium" : "text-gray-600"}`}
          >
            <span>{meal.name}</span>

            <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
              {meal.kcal} kcal
            </span>

          </div>
        ))}

      </div>

      {/* Hydration */}

      <div className="bg-blue-50 border rounded-xl p-4">

        <p className="font-medium text-blue-700">
          Hydration Goal
        </p>

        <p className="text-sm text-gray-500">
          4 of 8 glasses logged
        </p>

        <div className="w-full h-2 bg-blue-100 rounded mt-3">

          <div className="w-1/2 h-2 bg-blue-500 rounded" />

        </div>

      </div>

    </div>
  )
}