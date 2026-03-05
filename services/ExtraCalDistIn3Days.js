import CalorieAdjustment from "@/model/calorieAdjustment";

const MIN_THRESHOLD = 50; // kcal – ignore noise below this

/**
 * For a completed past day, compute the surplus/deficit and upsert a
 * CalorieAdjustment record that spreads the delta over 3 following days.
 *  - Positive adjustmentPerDay → overate → future target reduced
 *  - Negative adjustmentPerDay → underate → future target increased
 */
export async function computeAndSaveAdjustment({
  userId,
  date,
  consumed,
  expected,
}) {
  const diff = Math.round(consumed - expected);
  if (Math.abs(diff) < MIN_THRESHOLD) return null;

  const refDate = new Date(date);
  refDate.setHours(0, 0, 0, 0);

  const adjustmentPerDay = Math.round(diff / 3);

  const adjustment = await CalorieAdjustment.findOneAndUpdate(
    { userId, referenceDate: refDate },
    {
      $set: {
        userId,
        referenceDate: refDate,
        extraCalories: diff,
        daysDistributed: 3,
        adjustmentPerDay,
      },
    },
    { upsert: true, new: true },
  );

  return adjustment;
}

/**
 * Returns all CalorieAdjustment records from the 3 days preceding `today`
 * and the net adjustmentPerDay that should be applied to today's target.
 *  - Positive totalAdjustmentPerDay → user overate recently → reduce target
 *  - Negative totalAdjustmentPerDay → user underate recently → raise target
 */
export async function getActiveAdjustmentsForToday(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const adjustments = await CalorieAdjustment.find({
    userId,
    referenceDate: { $gte: threeDaysAgo, $lt: today },
  })
    .sort({ referenceDate: -1 })
    .lean();

  const totalAdjustmentPerDay = adjustments.reduce(
    (sum, a) => sum + (a.adjustmentPerDay || 0),
    0,
  );

  return { adjustments, totalAdjustmentPerDay };
}

// Legacy alias kept for any existing callers
export async function createAdjustment({ userId, consumed, expected, date }) {
  return computeAndSaveAdjustment({ userId, consumed, expected, date });
}
