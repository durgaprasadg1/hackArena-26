import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Exercise from "@/model/exercise";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/exercises/search?q=...&type=...&difficulty=...&muscle=...
 * Search verified exercises with filtering
 */
export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const type = searchParams.get("type") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const muscle = searchParams.get("muscle") || "";

    const filter = { "verification.verified": true };

    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }

    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    if (muscle) filter.muscleGroups = muscle;

    const exercises = await Exercise.find(filter)
      .select(
        "name type caloriesPerMinute caloriesPerSet muscleGroups difficulty description imageUrl",
      )
      .sort({ name: 1 })
      .limit(30)
      .lean();

    return NextResponse.json({ success: true, exercises });
  } catch (error) {
    console.error("Exercise search error:", error);
    return NextResponse.json(
      { error: "Failed to search exercises", details: error.message },
      { status: 500 },
    );
  }
}
