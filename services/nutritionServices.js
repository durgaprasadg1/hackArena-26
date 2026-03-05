export function calculateMealNutrition(meals) {

  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  meals.forEach((meal) => {
    calories += meal.calories * meal.quantity;
    protein += meal.protein * meal.quantity;
    carbs += meal.carbs * meal.quantity;
    fat += meal.fat * meal.quantity;
  });

  return {
    calories,
    protein,
    carbs,
    fat
  };
}