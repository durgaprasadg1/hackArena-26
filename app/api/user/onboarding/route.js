import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth.js";
import { connectDB } from "@/lib/connectDB.js";
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateWaterIntake,
  calculateAge,
  validateHealthMetrics,
} from "@/lib/healthCalculations.js";

// POST /api/user/onboarding - Complete user onboarding
export async function POST(req) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      roleType,
      gender,
      dob,
      heightCm,
      weightKg,
      activityLevel,
      sleepHours,
      waterIntakeLiters,
      goalType,
      targetWeight,
    } = body;

    // Validate required fields
    if (
      !roleType ||
      !gender ||
      !dob ||
      !heightCm ||
      !weightKg ||
      !activityLevel ||
      !goalType
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate metrics
    const age = calculateAge(new Date(dob));
    const validation = validateHealthMetrics({ weightKg, heightCm, age });

    if (!validation.valid) {
      return NextResponse.json(
        { error: "Invalid health metrics", details: validation.errors },
        { status: 400 },
      );
    }

    await connectDB();

    // Calculate health metrics
    const bmi = calculateBMI(weightKg, heightCm);
    const bmr = calculateBMR(weightKg, heightCm, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const dailyCalorieTarget = calculateCalorieTarget(tdee, goalType);
    const recommendedWater = calculateWaterIntake(weightKg, activityLevel);

    // Update user with onboarding data
    user.roleType = roleType;
    user.profile = {
      gender,
      dob: new Date(dob),
      heightCm,
      weightKg,
      activityLevel,
    };

    user.healthMetrics = {
      bmi,
      bmr,
    };

    user.lifestyle = {
      sleepHours: sleepHours || 7,
      waterIntakeLiters: waterIntakeLiters || recommendedWater,
    };

    user.goals = {
      goalType,
      targetWeight: targetWeight || weightKg,
      dailyCalorieTarget,
    };

    user.onboarded = true;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Onboarding completed successfully",
      user: {
        id: user._id,
        name: user.name,
        onboarded: true,
        profile: user.profile,
        healthMetrics: user.healthMetrics,
        lifestyle: user.lifestyle,
        goals: user.goals,
        recommendations: {
          dailyCalories: dailyCalorieTarget,
          dailyWater: recommendedWater,
          bmi,
          bmiCategory:
            bmi < 18.5
              ? "Underweight"
              : bmi < 25
                ? "Normal"
                : bmi < 30
                  ? "Overweight"
                  : "Obese",
        },
      },
    });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding", details: error.message },
      { status: 500 },
    );
  }
}
