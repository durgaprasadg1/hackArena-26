import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/connectDB";
import WaterLog from "@/model/waterLog";
import User from "@/model/user";

// GET - Get today's water intake
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

    let waterLog = await WaterLog.findOne({
      userId: user._id,
      date: today,
    });

    if (!waterLog) {
      // Create a new log for today
      waterLog = await WaterLog.create({
        userId: user._id,
        date: today,
        amount: 0,
        logs: [],
      });
    }

    return NextResponse.json({
      amount: waterLog.amount,
      logs: waterLog.logs,
      target: user.lifestyle?.waterIntakeLiters || 2.5,
    });
  } catch (error) {
    console.error("Error fetching water log:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}

// POST - Add water intake
export async function POST(req) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get today's date at start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let waterLog = await WaterLog.findOne({
      userId: user._id,
      date: today,
    });

    if (!waterLog) {
      waterLog = await WaterLog.create({
        userId: user._id,
        date: today,
        amount: amount,
        logs: [{ amount, timestamp: new Date() }],
      });
    } else {
      waterLog.logs.push({ amount, timestamp: new Date() });
      waterLog.amount += amount;
      await waterLog.save();
    }

    return NextResponse.json({
      amount: waterLog.amount,
      logs: waterLog.logs,
      target: user.lifestyle?.waterIntakeLiters || 2.5,
    });
  } catch (error) {
    console.error("Error adding water intake:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}

// PATCH - Update water intake (for decrement)
export async function PATCH(req) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get today's date at start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const waterLog = await WaterLog.findOne({
      userId: user._id,
      date: today,
    });

    if (!waterLog) {
      return NextResponse.json(
        { error: "No water log found for today" },
        { status: 404 },
      );
    }

    // Prevent negative values
    waterLog.amount = Math.max(0, waterLog.amount - amount);
    await waterLog.save();

    return NextResponse.json({
      amount: waterLog.amount,
      logs: waterLog.logs,
      target: user.lifestyle?.waterIntakeLiters || 2.5,
    });
  } catch (error) {
    console.error("Error updating water intake:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
