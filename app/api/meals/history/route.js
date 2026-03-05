import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import MealLog from "@/model/meallog";
import CalorieAdjustment from "@/model/calorieAdjustment";
import { getCurrentUser } from "@/lib/auth";
import { computeAndSaveAdjustment } from "@/services/ExtraCalDistIn3Days";

/**
 * GET /api/meals/history
 * Get meal history grouped by date
 */
export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days")) || 30; // Default to 30 days

    // Calculate date range
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Fetch all meal logs in range
    const mealLogs = await MealLog.find({
      userId: user._id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .sort({ date: -1 })
      .lean();

    // Group by date and calculate daily totals
    const dailyData = {};

    mealLogs.forEach((log) => {
      const dateKey = log.date.toISOString().split("T")[0];

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: log.date,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          mealsCount: 0,
        };
      }

      if (log.nutritionConsumed) {
        dailyData[dateKey].totalCalories += log.nutritionConsumed.calories || 0;
        dailyData[dateKey].totalProtein += log.nutritionConsumed.protein || 0;
        dailyData[dateKey].totalCarbs += log.nutritionConsumed.carbs || 0;
        dailyData[dateKey].totalFat += log.nutritionConsumed.fat || 0;
      }
      dailyData[dateKey].mealsCount++;
    });

    // Convert to array and format
    const history = Object.values(dailyData).map((day) => {
      const date = new Date(day.date);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const dateStr = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return {
        day: dayName,
        date: dateStr,
        dateObj: day.date,
        intake: Math.round(day.totalCalories),
        expected: user.goals?.dailyCalorieTarget || 2000,
        protein: Math.round(day.totalProtein),
        carbs: Math.round(day.totalCarbs),
        fat: Math.round(day.totalFat),
        mealsCount: day.mealsCount,
      };
    });

    // Sort by date descending
    history.sort((a, b) => new Date(b.dateObj) - new Date(a.dateObj));

    // Determine today's date key so we skip today (day not yet complete)
    const todayKey = new Date().toISOString().split("T")[0];

    // Fetch existing CalorieAdjustment records for this user in the range
    const startDateAdj = new Date(startDate);
    const existingAdjustments = await CalorieAdjustment.find({
      userId: user._id,
      referenceDate: { $gte: startDateAdj, $lte: new Date() },
    }).lean();

    const adjustmentByDateKey = {};
    existingAdjustments.forEach((a) => {
      const key = new Date(a.referenceDate).toISOString().split("T")[0];
      adjustmentByDateKey[key] = a;
    });

    // For each past day without an adjustment record, lazily create one.
    // Also enrich each history entry with its adjustment data.
    const MIN_THRESHOLD = 50;
    const enrichedHistory = [];

    for (const entry of history) {
      const key = new Date(entry.dateObj).toISOString().split("T")[0];
      const isToday = key === todayKey;

      let adjustment = adjustmentByDateKey[key] || null;

      if (!isToday && !adjustment) {
        try {
          adjustment = await computeAndSaveAdjustment({
            userId: user._id,
            date: entry.dateObj,
            consumed: entry.intake,
            expected: entry.expected,
          });
        } catch {
          // Don't fail the main request if adjustment saving fails
        }
      }

      const diff = entry.intake - entry.expected;
      enrichedHistory.push({
        ...entry,
        diff,
        adjustmentPerDay: adjustment?.adjustmentPerDay ?? null,
        balanced: Math.abs(diff) < MIN_THRESHOLD,
      });
    }

    return NextResponse.json({
      success: true,
      history: enrichedHistory,
      count: enrichedHistory.length,
    });
  } catch (error) {
    console.error("Get meal history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal history", details: error.message },
      { status: 500 },
    );
  }
}
