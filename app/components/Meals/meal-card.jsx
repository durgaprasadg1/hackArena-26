export default function MealCard({ meal }) {

  return (
    <div className="flex items-center gap-4 border rounded-xl p-4">

      <img
        src={meal.image}
        className="w-16 h-16 rounded-lg object-cover"
      />

      <div className="flex-1">

        <div className="flex justify-between">

          <h3 className="font-medium">
            {meal.name}
          </h3>

          <span className="text-green-600 font-medium">
            {meal.kcal} kcal
          </span>

        </div>

        <p className="text-sm text-gray-500">
          {meal.size}
        </p>

        <div className="flex gap-6 text-xs text-gray-500 mt-2">

          <span>Protein {meal.protein}</span>
          <span>Carbs {meal.carbs}</span>
          <span>Fat {meal.fat}</span>

        </div>

      </div>

    </div>
  )
}