import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import MealLog from "@/model/meallog";
import Food from "@/model/food";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");

    // Parse date in local timezone to match storage
    let targetDate;
    if (dateStr) {
      const [year, month, day] = dateStr.split("-").map(Number);
      targetDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    } else {
      targetDate = new Date();
      targetDate.setHours(0, 0, 0, 0);
    }

    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const mealLogs = await MealLog.find({
      userId: user._id,
      date: {
        $gte: targetDate,
        $lt: nextDay,
      },
    })
      .populate("foodId", "name imageUrl locality")
      .sort({ createdAt: 1 })
      .lean();

    // Group by meal type
    const groupedMeals = {
      breakfast: [],
      lunch: [],
      snacks: [],
      dinner: [],
    };

    mealLogs.forEach((log) => {
      if (groupedMeals[log.mealType]) {
        groupedMeals[log.mealType].push(log);
      }
    });

    // Calculate totals
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
    };

    mealLogs.forEach((log) => {
      if (log.nutritionConsumed) {
        totals.calories += log.nutritionConsumed.calories || 0;
        totals.protein += log.nutritionConsumed.protein || 0;
        totals.carbs += log.nutritionConsumed.carbs || 0;
        totals.fat += log.nutritionConsumed.fat || 0;
        totals.fiber += log.nutritionConsumed.fiber || 0;
        totals.sugar += log.nutritionConsumed.sugar || 0;
      }
    });

    return NextResponse.json({
      success: true,
      date: targetDate,
      meals: groupedMeals,
      totals,
    });
  } catch (error) {
    console.error("Get meal logs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal logs", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * POST /api/meals/log
 * Add a food item to meal log
 */
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { foodId, mealType, quantity = 1, date: providedDate } = body;

    // Validate inputs
    if (!foodId || !mealType) {
      return NextResponse.json(
        { error: "foodId and mealType are required" },
        { status: 400 },
      );
    }

    if (!["breakfast", "lunch", "snacks", "dinner"].includes(mealType)) {
      return NextResponse.json({ error: "Invalid mealType" }, { status: 400 });
    }

    // Get food details
    const food = await Food.findById(foodId);
    if (!food) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    if (!food.verification.verified) {
      return NextResponse.json(
        { error: "Food not verified yet" },
        { status: 400 },
      );
    }

    // Calculate nutrition based on quantity
    const nutritionConsumed = {};
    if (food.nutrition) {
      Object.keys(food.nutrition).forEach((key) => {
        nutritionConsumed[key] = (food.nutrition[key] || 0) * quantity;
      });
    }

    // Parse date in local timezone to match storage
    let logDate;
    if (providedDate) {
      const [year, month, day] = providedDate.split("-").map(Number);
      logDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    } else {
      logDate = new Date();
      logDate.setHours(0, 0, 0, 0);
    }

    // Create meal log
    const mealLog = await MealLog.create({
      userId: user._id,
      date: logDate,
      mealType,
      foodId: food._id,
      foodName: food.name,
      quantity,
      servingSize: food.servingSize,
      nutritionConsumed,
    });

    const populatedLog = await MealLog.findById(mealLog._id)
      .populate("foodId", "name imageUrl locality")
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Food added to meal log",
        mealLog: populatedLog,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add meal log error:", error);
    return NextResponse.json(
      { error: "Failed to add food to meal log", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/meals/log
 * Remove a food item from meal log
 */
export async function DELETE(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const logId = searchParams.get("id");

    if (!logId) {
      return NextResponse.json(
        { error: "Log ID is required" },
        { status: 400 },
      );
    }

    // Find and delete only if belongs to user
    const deleted = await MealLog.findOneAndDelete({
      _id: logId,
      userId: user._id,
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Meal log not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Meal log deleted",
    });
  } catch (error) {
    console.error("Delete meal log error:", error);
    return NextResponse.json(
      { error: "Failed to delete meal log", details: error.message },
      { status: 500 },
    );
  }
}
