import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import MealLog from "@/model/meallog";
import { getCurrentUser } from "@/lib/auth";
import {
  generateMealSummary,
  generateMealImprovementTips,
} from "@/services/groqServices";

// Helper – calculate age from date of birth
function calcAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// Helper – fetch meal logs for a given date range and return structured data
async function fetchMealsForDate(userId, targetDate) {
  const start = new Date(targetDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const logs = await MealLog.find({
    userId,
    date: { $gte: start, $lt: end },
  })
    .populate("foodId", "name")
    .sort({ createdAt: 1 })
    .lean();

  const grouped = { breakfast: [], lunch: [], snacks: [], dinner: [] };
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  };

  logs.forEach((log) => {
    if (grouped[log.mealType]) grouped[log.mealType].push(log);
    if (log.nutritionConsumed) {
      totals.calories += log.nutritionConsumed.calories || 0;
      totals.protein += log.nutritionConsumed.protein || 0;
      totals.carbs += log.nutritionConsumed.carbs || 0;
      totals.fat += log.nutritionConsumed.fat || 0;
      totals.fiber += log.nutritionConsumed.fiber || 0;
      totals.sugar += log.nutritionConsumed.sugar || 0;
    }
  });

  return { meals: grouped, totals, totalEntries: logs.length };
}

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "summary" | "tips"

    if (!type || !["summary", "tips"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Use 'summary' or 'tips'." },
        { status: 400 },
      );
    }

    await connectDB();

    // Try today first; if fewer than 3 total entries, fall back to yesterday
    const today = new Date();
    let mealData = await fetchMealsForDate(user._id, today);
    let dateLabel = "Today";

    if (mealData.totalEntries < 3) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yestData = await fetchMealsForDate(user._id, yesterday);

      if (yestData.totalEntries >= mealData.totalEntries) {
        mealData = yestData;
        dateLabel = "Yesterday";
      }
    }

    // If there is genuinely nothing to analyse, return early with a friendly message
    if (mealData.totalEntries === 0) {
      return NextResponse.json({
        success: true,
        type,
        content:
          type === "summary"
            ? "No meal data found for today or yesterday. Start logging your meals to get a personalized nutritional summary!"
            : "No meal data found for today or yesterday. Log your meals first and come back for targeted improvement tips tailored to your goal!",
        dateLabel: "No data",
      });
    }

    // Build a lean userData context from the user's MongoDB document
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

    // Call appropriate Groq function
    let content;
    if (type === "summary") {
      content = await generateMealSummary(userData, { ...mealData, dateLabel });
    } else {
      content = await generateMealImprovementTips(userData, {
        ...mealData,
        dateLabel,
      });
    }

    return NextResponse.json({ success: true, type, content, dateLabel });
  } catch (error) {
    console.error("Meal AI analysis error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI analysis. Please try again." },
      { status: 500 },
    );
  }
}
