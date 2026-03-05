import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth.js";
import { connectDB } from "@/lib/connectDB.js";
import {
  calculateTDEE,
  calculateCalorieTarget,
} from "@/lib/healthCalculations.js";

// PATCH /api/user/goals - Update user goals
export async function PATCH(req) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { goalType, targetWeight, dailyCalorieTarget } = body;

    await connectDB();

    // Update goals
    if (goalType) {
      user.goals.goalType = goalType;

      // Recalculate calorie target based on new goal
      if (user.healthMetrics.bmr && user.profile.activityLevel) {
        const tdee = calculateTDEE(
          user.healthMetrics.bmr,
          user.profile.activityLevel,
        );
        user.goals.dailyCalorieTarget = calculateCalorieTarget(tdee, goalType);
      }
    }

    if (targetWeight) {
      user.goals.targetWeight = targetWeight;
    }

    // Allow manual override of calorie target
    if (dailyCalorieTarget) {
      user.goals.dailyCalorieTarget = dailyCalorieTarget;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Goals updated successfully",
      goals: user.goals,
    });
  } catch (error) {
    console.error("Error updating goals:", error);
    return NextResponse.json(
      { error: "Failed to update goals", details: error.message },
      { status: 500 },
    );
  }
}

// GET /api/user/goals - Get user goals with progress
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentWeight = user.profile?.weightKg;
    const targetWeight = user.goals?.targetWeight;
    const goalType = user.goals?.goalType;

    let progress = null;

    if (currentWeight && targetWeight && goalType) {
      const startWeight = currentWeight; // In a real app, track initial weight separately
      const weightDiff = currentWeight - targetWeight;
      const totalWeightToChange = Math.abs(startWeight - targetWeight);

      progress = {
        current: currentWeight,
        target: targetWeight,
        remaining: Math.abs(weightDiff),
        percentage:
          totalWeightToChange > 0
            ? Math.min(
                100,
                Math.round(
                  (1 - Math.abs(weightDiff) / totalWeightToChange) * 100,
                ),
              )
            : 100,
      };
    }

    return NextResponse.json({
      success: true,
      goals: user.goals,
      progress,
      healthMetrics: user.healthMetrics,
    });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch goals", details: error.message },
      { status: 500 },
    );
  }
}
