import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { getCurrentUser } from "@/lib/auth";
import { getActiveAdjustmentsForToday } from "@/services/ExtraCalDistIn3Days";

/**
 * GET /api/user/calorie-balance
 * Returns today's effective calorie target after applying any active
 * CalorieAdjustment records from the past 3 days.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const baseTarget = user.goals?.dailyCalorieTarget || 2000;

    const { adjustments, totalAdjustmentPerDay } =
      await getActiveAdjustmentsForToday(user._id);

    // Positive totalAdjustmentPerDay → overate → subtract from target
    // Negative totalAdjustmentPerDay → underate → add to target
    const adjustedTarget = Math.max(
      1200,
      Math.round(baseTarget - totalAdjustmentPerDay),
    );

    return NextResponse.json({
      success: true,
      baseTarget,
      adjustedTarget,
      totalAdjustmentPerDay,
      adjustments: adjustments.map((a) => ({
        referenceDate: a.referenceDate,
        extraCalories: a.extraCalories,
        adjustmentPerDay: a.adjustmentPerDay,
      })),
    });
  } catch (error) {
    console.error("Calorie balance error:", error);
    return NextResponse.json(
      { error: "Failed to compute calorie balance", details: error.message },
      { status: 500 },
    );
  }
}
