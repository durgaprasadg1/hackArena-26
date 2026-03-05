"use client";

export default function MealSidebar({
  selectedMeal,
  setSelectedMeal,
  mealCalories,
}) {
  const meals = [
    { id: "breakfast", name: "Breakfast", kcal: mealCalories.breakfast || 0 },
    { id: "lunch", name: "Lunch", kcal: mealCalories.lunch || 0 },
    { id: "dinner", name: "Dinner", kcal: mealCalories.dinner || 0 },
    { id: "snacks", name: "Snacks", kcal: mealCalories.snacks || 0 },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-xl overflow-hidden">
        {meals.map((meal) => (
          <button
            key={meal.id}
            onClick={() => setSelectedMeal(meal.id)}
            className={`w-full flex justify-between px-4 py-3 border-b last:border-none transition-colors
            ${selectedMeal === meal.id ? "bg-green-50 text-green-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <span>{meal.name}</span>
            <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
              {meal.kcal} kcal
            </span>
          </button>
        ))}
      </div>

      
    </div>
  );
}
