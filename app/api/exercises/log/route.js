import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import ExerciseLog from "@/model/exerciseLog";
import Exercise from "@/model/exercise";
import { getCurrentUser } from "@/lib/auth";
import { calculateExerciseBurn } from "@/services/exerciseServices";

/**
 * GET /api/exercises/log?date=YYYY-MM-DD
 * Get today's (or given date's) exercise logs
 */
export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");

    const targetDate = dateStr ? new Date(dateStr) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const logs = await ExerciseLog.find({
      userId: user._id,
      date: { $gte: targetDate, $lt: nextDay },
    })
      .populate(
        "exerciseId",
        "name type muscleGroups difficulty imageUrl caloriesPerMinute caloriesPerSet",
      )
      .sort({ createdAt: 1 })
      .lean();

    const totalCaloriesBurned = logs.reduce(
      (sum, l) => sum + (l.caloriesBurned || 0),
      0,
    );

    return NextResponse.json({
      success: true,
      date: targetDate,
      logs,
      totals: {
        caloriesBurned: Math.round(totalCaloriesBurned),
        exerciseCount: logs.length,
        totalMinutes: logs.reduce(
          (sum, l) => sum + (l.durationMinutes || 0),
          0,
        ),
      },
    });
  } catch (error) {
    console.error("Get exercise logs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise logs", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * POST /api/exercises/log
 * Add an exercise to today's log
 */
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const {
      exerciseId,
      durationMinutes,
      sets,
      notes,
      date: providedDate,
    } = body;

    if (!exerciseId) {
      return NextResponse.json(
        { error: "exerciseId is required" },
        { status: 400 },
      );
    }

    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 },
      );
    }

    if (!exercise.verification?.verified) {
      return NextResponse.json(
        { error: "Exercise not verified yet" },
        { status: 400 },
      );
    }

    const caloriesBurned = calculateExerciseBurn({
      type: exercise.type,
      duration: durationMinutes || 0,
      sets: sets || 0,
      caloriesPerMinute: exercise.caloriesPerMinute || 0,
      caloriesPerSet: exercise.caloriesPerSet || 0,
    });

    const logDate = providedDate ? new Date(providedDate) : new Date();
    logDate.setHours(0, 0, 0, 0);

    const log = await ExerciseLog.create({
      userId: user._id,
      date: logDate,
      exerciseId: exercise._id,
      exerciseName: exercise.name,
      exerciseType: exercise.type,
      sets: sets || 0,
      durationMinutes: durationMinutes || 0,
      caloriesBurned: Math.round(caloriesBurned),
      notes: notes || "",
    });

    const populated = await ExerciseLog.findById(log._id)
      .populate(
        "exerciseId",
        "name type muscleGroups difficulty imageUrl caloriesPerMinute caloriesPerSet",
      )
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Exercise logged successfully",
        log: populated,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add exercise log error:", error);
    return NextResponse.json(
      { error: "Failed to log exercise", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/exercises/log?id=...
 * Edit an existing exercise log entry
 */
export async function PATCH(request) {
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

    const log = await ExerciseLog.findOne({ _id: logId, userId: user._id });
    if (!log) {
      return NextResponse.json(
        { error: "Log not found or unauthorized" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { durationMinutes, sets, notes } = body;

    if (durationMinutes !== undefined) log.durationMinutes = durationMinutes;
    if (sets !== undefined) log.sets = sets;
    if (notes !== undefined) log.notes = notes;

    // Recalculate calories
    const exercise = await Exercise.findById(log.exerciseId);
    if (exercise) {
      log.caloriesBurned = Math.round(
        calculateExerciseBurn({
          type: exercise.type,
          duration: log.durationMinutes || 0,
          sets: log.sets || 0,
          caloriesPerMinute: exercise.caloriesPerMinute || 0,
          caloriesPerSet: exercise.caloriesPerSet || 0,
        }),
      );
    }

    await log.save();

    const populated = await ExerciseLog.findById(log._id)
      .populate(
        "exerciseId",
        "name type muscleGroups difficulty imageUrl caloriesPerMinute caloriesPerSet",
      )
      .lean();

    return NextResponse.json({ success: true, log: populated });
  } catch (error) {
    console.error("Update exercise log error:", error);
    return NextResponse.json(
      { error: "Failed to update exercise log", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/exercises/log?id=...
 * Delete an exercise log entry
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

    const log = await ExerciseLog.findOneAndDelete({
      _id: logId,
      userId: user._id,
    });

    if (!log) {
      return NextResponse.json(
        { error: "Log not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Exercise log deleted",
    });
  } catch (error) {
    console.error("Delete exercise log error:", error);
    return NextResponse.json(
      { error: "Failed to delete exercise log", details: error.message },
      { status: 500 },
    );
  }
}
