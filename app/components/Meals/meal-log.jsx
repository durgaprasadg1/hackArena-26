import MealFilters from "./meal-filters"
import MealCard from "./meal-card"

export default function MealLog() {

  const meals = [
    {
      name: "Oatmeal with Berries",
      size: "1 bowl (250g)",
      kcal: 210,
      protein: "6g",
      carbs: "45g",
      fat: "3g",
      image: "/foods/oatmeal.jpg",
    },
    {
      name: "Black Coffee",
      size: "1 mug (350ml)",
      kcal: 5,
      protein: "0g",
      carbs: "1g",
      fat: "0g",
      image: "/foods/coffee.jpg",
    },
    {
      name: "Boiled Eggs",
      size: "2 large (100g)",
      kcal: 135,
      protein: "12g",
      carbs: "1g",
      fat: "9g",
      image: "/foods/eggs.jpg",
    },
  ]

  return (
    <div className="bg-white border rounded-xl p-6">

      <MealFilters />

      <h2 className="font-semibold mb-4">
        Breakfast Log
      </h2>

      <div className="space-y-4">

        {meals.map((meal) => (
          <MealCard key={meal.name} meal={meal} />
        ))}

      </div>

    </div>
  )
}