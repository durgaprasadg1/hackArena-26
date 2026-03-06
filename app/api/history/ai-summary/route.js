import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import MealLog from "@/model/meallog";
import ExerciseLog from "@/model/exerciseLog";
import "@/model/exercise"; // register Exercise schema for ExerciseLog populate
import { getCurrentUser } from "@/lib/auth";
import { generateDailySummary } from "@/services/groqServices";

function calcAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

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

    // Parse date in local timezone to match storage
    const [year, month, day] = dateStr.split("-").map(Number);
    const targetDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Fetch meal logs
    const mealLogs = await MealLog.find({
      userId: user._id,
      date: { $gte: targetDate, $lt: nextDay },
    })
      .sort({ createdAt: 1 })
      .lean();

    // Group meals and accumulate totals
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

    const userData = {
      name: user.name,
      age: calcAge(user.profile?.dob),
      gender: user.profile?.gender,
      weightKg: user.profile?.weightKg,
      heightCm: user.profile?.heightCm,
      activityLevel: user.profile?.activityLevel,
      goalType: user.goals?.goalType,
      targetWeight: user.goals?.targetWeight,
      dailyCalorieTarget: user.goals?.dailyCalorieTarget,
      dietaryRestrictions: user.preferences?.dietaryRestrictions,
      healthConditions: user.healthConditions,
    };

    const dateLabel = targetDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (mealLogs.length === 0 && exerciseLogs.length === 0) {
      return NextResponse.json({
        success: true,
        content:
          "No meal or exercise data found for this date. Start logging your meals and workouts to get a personalized daily summary!",
        dateLabel,
      });
    }

    const content = await generateDailySummary(userData, {
      meals: grouped,
      mealTotals,
      exerciseLogs,
      exerciseTotals,
      dateLabel,
    });

    return NextResponse.json({ success: true, content, dateLabel });
  } catch (error) {
    console.error("History AI summary error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary. Please try again." },
      { status: 500 },
    );
  }
}
