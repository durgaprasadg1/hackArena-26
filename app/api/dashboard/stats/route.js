import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/connectDB";
import User from "@/model/user";
import MealLog from "@/model/meallog";
import ExerciseLog from "@/model/exerciseLog";
import WaterLog from "@/model/waterLog";
import SleepLog from "@/model/sleepLog";

// GET - Get dashboard stats for today
export async function GET(req) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get today's date at start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch today's meal logs
    const mealLogs = await MealLog.find({
      userId: user._id,
      date: { $gte: today, $lt: tomorrow },
    }).populate("foodId");

    // Calculate total macros consumed
    const macros = mealLogs.reduce(
      (acc, log) => {
        acc.calories += log.nutritionConsumed?.calories || 0;
        acc.protein += log.nutritionConsumed?.protein || 0;
        acc.carbs += log.nutritionConsumed?.carbs || 0;
        acc.fat += log.nutritionConsumed?.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    // Fetch today's exercise logs
    const exerciseLogs = await ExerciseLog.find({
      userId: user._id,
      date: { $gte: today, $lt: tomorrow },
    }).populate("exerciseId");

    const totalCaloriesBurned = exerciseLogs.reduce(
      (sum, log) => sum + (log.caloriesBurned || 0),
      0,
    );

    // Get user's goals
    const dailyCalorieTarget = user.goals?.dailyCalorieTarget || 2000;
    const proteinTarget = Math.round((dailyCalorieTarget * 0.3) / 4); // 30% of calories from protein
    const carbsTarget = Math.round((dailyCalorieTarget * 0.4) / 4); // 40% from carbs
    const fatTarget = Math.round((dailyCalorieTarget * 0.3) / 9); // 30% from fat

    // Fetch water log
    const waterLog = await WaterLog.findOne({
      userId: user._id,
      date: today,
    });

    // Fetch sleep log
    const sleepLog = await SleepLog.findOne({
      userId: user._id,
      date: today,
    });

    // Recent activities (last 3 days)
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const recentMeals = await MealLog.find({
      userId: user._id,
      date: { $gte: threeDaysAgo },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("foodId");

    const recentExercises = await ExerciseLog.find({
      userId: user._id,
      date: { $gte: threeDaysAgo },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("exerciseId");

    // Combine and sort activities
    const activities = [
      ...recentMeals.map((meal) => ({
        type: "meal",
        title: meal.foodName || meal.foodId?.name || "Unknown Food",
        mealType: meal.mealType,
        time: meal.createdAt,
      })),
      ...recentExercises.map((exercise) => ({
        type: "exercise",
        title: exercise.exerciseId?.name || "Exercise",
        duration: exercise.durationMinutes,
        calories: exercise.caloriesBurned,
        time: exercise.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);

    return NextResponse.json({
      user: {
        name: user.name,
        role: user.roleType,
      },
      macros: {
        calories: {
          consumed: Math.round(macros.calories),
          target: dailyCalorieTarget,
          burned: totalCaloriesBurned,
        },
        protein: {
          consumed: Math.round(macros.protein),
          target: proteinTarget,
        },
        carbs: {
          consumed: Math.round(macros.carbs),
          target: carbsTarget,
        },
        fat: {
          consumed: Math.round(macros.fat),
          target: fatTarget,
        },
      },
      water: {
        amount: waterLog?.amount || 0,
        target: user.lifestyle?.waterIntakeLiters || 2.5,
      },
      sleep: {
        hours: sleepLog?.hours || 0,
        quality: sleepLog?.quality || "good",
        logged: !!sleepLog,
      },
      activities,
      streak: user.streak?.current || 0,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
