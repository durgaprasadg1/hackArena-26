import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import MealLog from "@/model/meallog";
import ExerciseLog from "@/model/exerciseLog";
import "@/model/exercise"; // register Exercise schema for ExerciseLog populate
import { getCurrentUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date"); // YYYY-MM-DD

    if (!dateStr) {
      return NextResponse.json(
        { error: "Date parameter required" },
        { status: 400 },
      );
    }

    await connectDB();

    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Fetch meal logs
    const mealLogs = await MealLog.find({
      userId: user._id,
      date: { $gte: targetDate, $lt: nextDay },
    })
      .sort({ createdAt: 1 })
      .lean();

    // Group and total meals
    const grouped = { breakfast: [], lunch: [], snacks: [], dinner: [] };
    const mealTotals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
    };

    mealLogs.forEach((log) => {
      if (grouped[log.mealType]) grouped[log.mealType].push(log);
      if (log.nutritionConsumed) {
        mealTotals.calories += log.nutritionConsumed.calories || 0;
        mealTotals.protein += log.nutritionConsumed.protein || 0;
        mealTotals.carbs += log.nutritionConsumed.carbs || 0;
        mealTotals.fat += log.nutritionConsumed.fat || 0;
        mealTotals.fiber += log.nutritionConsumed.fiber || 0;
        mealTotals.sugar += log.nutritionConsumed.sugar || 0;
      }
    });

    // Fetch exercise logs
    const exerciseLogs = await ExerciseLog.find({
      userId: user._id,
      date: { $gte: targetDate, $lt: nextDay },
    })
      .populate("exerciseId", "name type muscleGroups difficulty")
      .sort({ createdAt: 1 })
      .lean();

    const exerciseTotals = {
      caloriesBurned: 0,
      durationMinutes: 0,
      exerciseCount: exerciseLogs.length,
    };

    exerciseLogs.forEach((log) => {
      exerciseTotals.caloriesBurned += log.caloriesBurned || 0;
      exerciseTotals.durationMinutes += log.durationMinutes || 0;
    });

    const dateLabel = targetDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return NextResponse.json({
      success: true,
      dateLabel,
      date: dateStr,
      user: {
        name: user.name,
        dailyCalorieTarget: user.goals?.dailyCalorieTarget || 2000,
        goalType: user.goals?.goalType,
      },
      meals: grouped,
      mealTotals: {
        calories: Math.round(mealTotals.calories),
        protein: Math.round(mealTotals.protein),
        carbs: Math.round(mealTotals.carbs),
        fat: Math.round(mealTotals.fat),
        fiber: Math.round(mealTotals.fiber),
        sugar: Math.round(mealTotals.sugar),
      },
      exercises: exerciseLogs.map((l) => ({
        name: l.exerciseName || l.exerciseId?.name || "Exercise",
        type: l.exerciseType || l.exerciseId?.type || "",
        sets: l.sets || 0,
        durationMinutes: l.durationMinutes || 0,
        caloriesBurned: Math.round(l.caloriesBurned || 0),
        notes: l.notes || "",
      })),
      exerciseTotals: {
        caloriesBurned: Math.round(exerciseTotals.caloriesBurned),
        durationMinutes: Math.round(exerciseTotals.durationMinutes),
        exerciseCount: exerciseTotals.exerciseCount,
      },
    });
  } catch (error) {
    console.error("Report data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch report data", details: error.message },
      { status: 500 },
    );
  }
}
