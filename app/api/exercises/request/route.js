import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Exercise from "@/model/exercise";
import User from "@/model/user";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/services/nodemailer";

/**
 * POST /api/exercises/request
 * Submit a new exercise request (pending admin verification)
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
      name,
      type,
      difficulty,
      muscleGroups,
      caloriesPerMinute,
      caloriesPerSet,
      description,
      imageUrl,
    } = body;

    if (!name || !type || !difficulty) {
      return NextResponse.json(
        { error: "Name, type, and difficulty are required" },
        { status: 400 },
      );
    }

    // Check for duplicate
    const existing = await Exercise.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An exercise with this name already exists" },
        { status: 409 },
      );
    }

    const exercise = await Exercise.create({
      name,
      type,
      difficulty,
      muscleGroups: muscleGroups || [],
      caloriesPerMinute: caloriesPerMinute
        ? parseFloat(caloriesPerMinute)
        : undefined,
      caloriesPerSet: caloriesPerSet ? parseFloat(caloriesPerSet) : undefined,
      description: description || "",
      imageUrl: imageUrl || "",
      addedBy: user._id,
      verification: { verified: false },
    });

    // Notify all admins
    const admins = await User.find({ role: "admin" }).select("email name");
    if (admins.length > 0) {
      const adminEmails = admins.map((a) => a.email).join(",");
      await sendEmail({
        to: adminEmails,
        subject: `[NutriSync AI] New Exercise Request: ${name}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .detail-box { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 16px 0; }
              .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
              .label { color: #6b7280; font-size: 13px; }
              .value { font-weight: 600; }
              .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; background: #fef3c7; color: #92400e; }
              .footer { text-align: center; color: #9ca3af; margin-top: 24px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💪 New Exercise Request</h1>
                <p>Review and approve or deny this submission</p>
              </div>
              <div class="content">
                <p>Hello Admin,</p>
                <p><strong>${user.name}</strong> has submitted a new exercise for verification.</p>
                <div class="detail-box">
                  <div class="row"><span class="label">Exercise Name</span><span class="value">${name}</span></div>
                  <div class="row"><span class="label">Type</span><span class="value">${type}</span></div>
                  <div class="row"><span class="label">Difficulty</span><span class="value">${difficulty}</span></div>
                  <div class="row"><span class="label">Muscle Groups</span><span class="value">${(muscleGroups || []).join(", ") || "—"}</span></div>
                  <div class="row"><span class="label">Calories/Min</span><span class="value">${caloriesPerMinute || "—"}</span></div>
                  <div class="row"><span class="label">Calories/Set</span><span class="value">${caloriesPerSet || "—"}</span></div>
                  <div class="row"><span class="label">Description</span><span class="value">${description || "—"}</span></div>
                  <div class="row"><span class="label">Exercise ID</span><span class="value">${exercise._id}</span></div>
                </div>
                <p>Please log in to the admin panel to approve or deny this request.</p>
              </div>
              <div class="footer"><p>© 2026 NutriSync AI. All rights reserved.</p></div>
            </div>
          </body>
          </html>
        `,
      });
    }

    // Send confirmation to submitter
    await sendEmail({
      to: user.email,
      subject: `[NutriSync AI] Exercise Request Received: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; color: #9ca3af; margin-top: 24px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>✅ Request Received!</h1></div>
            <div class="content">
              <p>Hello ${user.name},</p>
              <p>We have received your request to add <strong>"${name}"</strong> to the NutriSync AI exercise database.</p>
              <p>Our team will review it shortly and you will be notified once a decision has been made.</p>
              <p>Thank you for contributing!</p>
            </div>
            <div class="footer"><p>© 2026 NutriSync AI. All rights reserved.</p></div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Exercise request submitted successfully",
        exercise,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Exercise request error:", error);
    return NextResponse.json(
      { error: "Failed to submit exercise request", details: error.message },
      { status: 500 },
    );
  }
}
