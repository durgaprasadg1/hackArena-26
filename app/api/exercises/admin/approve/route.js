import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Exercise from "@/model/exercise";
import User from "@/model/user";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/services/nodemailer";

/**
 * GET /api/exercises/admin/pending
 * Get all pending exercise requests (admin only)
 */
export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const pending = await Exercise.find({ "verification.verified": false })
      .populate("addedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, exercises: pending });
  } catch (error) {
    console.error("Get pending exercises error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending exercises", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * POST /api/exercises/admin/approve
 * Approve or deny a pending exercise request (admin only)
 */
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();
    const { exerciseId, approved, reason } = body;

    if (!exerciseId || approved === undefined) {
      return NextResponse.json(
        { error: "exerciseId and approved status are required" },
        { status: 400 },
      );
    }

    const exercise = await Exercise.findById(exerciseId).populate(
      "addedBy",
      "email name",
    );

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 },
      );
    }

    if (approved) {
      exercise.verification.verified = true;
      exercise.verification.approvedBy = user._id;
      await exercise.save();

      if (exercise.addedBy?.email) {
        await sendEmail({
          to: exercise.addedBy.email,
          subject: `[NutriSync AI] Exercise Approved: ${exercise.name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .footer { text-align: center; color: #9ca3af; margin-top: 24px; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header"><h1>🎉 Exercise Approved!</h1></div>
                <div class="content">
                  <p>Hello ${exercise.addedBy.name},</p>
                  <p>Great news! Your exercise <strong>"${exercise.name}"</strong> has been approved and is now available in the NutriSync AI exercise database.</p>
                  <p>You and other users can now log this exercise from the Exercises page. Thank you for contributing!</p>
                </div>
                <div class="footer"><p>© 2026 NutriSync AI. All rights reserved.</p></div>
              </div>
            </body>
            </html>
          `,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Exercise approved and user notified",
      });
    } else {
      // Denied — delete the entry and notify user
      await Exercise.findByIdAndDelete(exerciseId);

      if (exercise.addedBy?.email) {
        await sendEmail({
          to: exercise.addedBy.email,
          subject: `[NutriSync AI] Exercise Request Declined: ${exercise.name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .reason-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0; }
                .footer { text-align: center; color: #9ca3af; margin-top: 24px; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header"><h1>❌ Exercise Request Declined</h1></div>
                <div class="content">
                  <p>Hello ${exercise.addedBy.name},</p>
                  <p>Unfortunately, your exercise request for <strong>"${exercise.name}"</strong> was not approved.</p>
                  ${reason ? `<div class="reason-box"><strong>Reason:</strong> ${reason}</div>` : ""}
                  <p>If you believe this is a mistake or would like to resubmit with more details, please feel free to try again.</p>
                </div>
                <div class="footer"><p>© 2026 NutriSync AI. All rights reserved.</p></div>
              </div>
            </body>
            </html>
          `,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Exercise request denied and user notified",
      });
    }
  } catch (error) {
    console.error("Approve exercise error:", error);
    return NextResponse.json(
      { error: "Failed to process exercise request", details: error.message },
      { status: 500 },
    );
  }
}
