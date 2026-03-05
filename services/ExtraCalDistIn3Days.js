import CalorieAdjustment from "@/models/CalorieAdjustment";

export async function createAdjustment({
  userId,
  consumed,
  expected,
  date
}) {

  const extraCalories = consumed - expected;

  if (extraCalories <= 0) return null;

  const days = 3;

  const perDay = Math.round(extraCalories / days);

  const adjustment = await CalorieAdjustment.create({
    userId,
    referenceDate: date,
    extraCalories,
    daysDistributed: days,
    adjustmentPerDay: perDay
  });

  return adjustment;
}