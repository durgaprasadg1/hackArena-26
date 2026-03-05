import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth.js";
import { connectDB } from "../../../../lib/connectDB.js";
import User from "@/model/user.js";
import {
  calculateBMI,
  calculateBMR,
  calculateAge,
} from "@/lib/healthCalculations.js";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        role: user.role,
        roleType: user.roleType,
        onboarded: user.onboarded,
        profilePicture: user.profilePicture,
        profile: user.profile,
        healthMetrics: user.healthMetrics,
        lifestyle: user.lifestyle,
        goals: user.goals,
        preferences: user.preferences,
        streak: user.streak,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile", details: error.message },
      { status: 500 },
    );
  }
}

// PATCH /api/user/profile - Update user profile
export async function PATCH(req) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { profile, preferences, roleType } = body;

    await connectDB();

    // Update basic fields
    if (roleType) {
      user.roleType = roleType;
    }

    // Update profile
    if (profile) {
      if (profile.gender) user.profile.gender = profile.gender;
      if (profile.dob) user.profile.dob = new Date(profile.dob);
      if (profile.heightCm) user.profile.heightCm = profile.heightCm;
      if (profile.weightKg) user.profile.weightKg = profile.weightKg;
      if (profile.activityLevel)
        user.profile.activityLevel = profile.activityLevel;

      // Recalculate health metrics if physical data changed
      if (user.profile.heightCm && user.profile.weightKg) {
        user.healthMetrics.bmi = calculateBMI(
          user.profile.weightKg,
          user.profile.heightCm,
        );

        if (user.profile.dob && user.profile.gender) {
          const age = calculateAge(user.profile.dob);
          user.healthMetrics.bmr = calculateBMR(
            user.profile.weightKg,
            user.profile.heightCm,
            age,
            user.profile.gender,
          );
        }
      }
    }

    // Update preferences
    if (preferences) {
      if (preferences.dietaryRestrictions) {
        user.preferences.dietaryRestrictions = preferences.dietaryRestrictions;
      }
      if (preferences.allergies) {
        user.preferences.allergies = preferences.allergies;
      }
      if (preferences.cuisinePreferences) {
        user.preferences.cuisinePreferences = preferences.cuisinePreferences;
      }
      if (preferences.equipmentAccess) {
        user.preferences.equipmentAccess = preferences.equipmentAccess;
      }
      if (preferences.notificationSettings) {
        user.preferences.notificationSettings = {
          ...user.preferences.notificationSettings,
          ...preferences.notificationSettings,
        };
      }
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        onboarded: user.onboarded,
        profile: user.profile,
        healthMetrics: user.healthMetrics,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 },
    );
  }
}
