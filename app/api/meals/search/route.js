import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Food from "@/model/food";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/meals/search
 * Search for verified food items with filtering
 */
export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit")) || 50;

    // Build search query - only show verified foods
    const searchQuery = {
      "verification.verified": true,
      name: { $regex: query, $options: "i" },
    };

    const foods = await Food.find(searchQuery)
      .select("name locality imageUrl servingSize nutrition minerals vitamins")
      .limit(limit)
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      foods,
      count: foods.length,
    });
  } catch (error) {
    console.error("Food search error:", error);
    return NextResponse.json(
      { error: "Failed to search foods", details: error.message },
      { status: 500 },
    );
  }
}
