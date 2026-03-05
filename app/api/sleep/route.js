import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/connectDB";
import SleepLog from "@/model/sleepLog";
import User from "@/model/user";

// GET - Get today's sleep log
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

    const sleepLog = await SleepLog.findOne({
      userId: user._id,
      date: today,
    });

    if (!sleepLog) {
      return NextResponse.json({
        hours: 0,
        quality: "good",
        logged: false,
      });
    }

    return NextResponse.json({
      hours: sleepLog.hours,
      quality: sleepLog.quality,
      bedTime: sleepLog.bedTime,
      wakeTime: sleepLog.wakeTime,
      notes: sleepLog.notes,
      logged: true,
    });
  } catch (error) {
    console.error("Error fetching sleep log:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}

// POST - Create or update sleep log
export async function POST(req) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hours, quality, bedTime, wakeTime, notes } = await req.json();

    if (!hours || hours < 0 || hours > 24) {
      return NextResponse.json(
        { error: "Invalid sleep hours" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get today's date at start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sleepData = {
      userId: user._id,
      date: today,
      hours,
      quality: quality || "good",
      bedTime: bedTime ? new Date(bedTime) : undefined,
      wakeTime: wakeTime ? new Date(wakeTime) : undefined,
      notes: notes || "",
    };

    // Update if exists, create if not
    const sleepLog = await SleepLog.findOneAndUpdate(
      { userId: user._id, date: today },
      sleepData,
      { upsert: true, new: true },
    );

    return NextResponse.json({
      hours: sleepLog.hours,
      quality: sleepLog.quality,
      bedTime: sleepLog.bedTime,
      wakeTime: sleepLog.wakeTime,
      notes: sleepLog.notes,
      logged: true,
    });
  } catch (error) {
    console.error("Error updating sleep log:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
