export function calculateExerciseBurn({
  type,
  duration,
  sets,
  caloriesPerMinute,
  caloriesPerSet
}) {

  if (type === "cardio") {
    return duration * caloriesPerMinute;
  }

  if (type === "strength") {
    return sets * caloriesPerSet;
  }

  return 0;
}