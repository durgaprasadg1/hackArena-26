import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Food from "@/model/food";
import User from "@/model/user";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/services/nodemailer";

/**
 * POST /api/meals/admin/approve
 * Approve or reject a food request (admin only)
 */
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 },
      );
    }

    await connectDB();

    const body = await request.json();
    const { foodId, approved, reason } = body;

    if (!foodId || approved === undefined) {
      return NextResponse.json(
        { error: "foodId and approved status are required" },
        { status: 400 },
      );
    }

    const food = await Food.findById(foodId).populate(
      "createdBy",
      "email name",
    );

    if (!food) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    if (approved) {
      // Approve the food
      food.verification.verified = true;
      food.verification.approvedBy = user._id;
      await food.save();

      // Send approval email to user
      if (food.createdBy && food.createdBy.email) {
        const approvalEmail = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Food Request Approved!</h1>
              </div>
              <div class="content">
                <p>Hello ${food.createdBy.name},</p>
                <p>Great news! Your food request for <strong>"${food.name}"</strong> has been approved and is now available in the NutriSync AI food database.</p>
                <p>Thank you for contributing to our community and helping make NutriSync AI better for everyone!</p>
                <p style="margin-top: 30px;">Best regards,<br>The NutriSync AI Team</p>
              </div>
              <div class="footer">
                <p>© 2026 NutriSync AI. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await sendEmail({
          to: food.createdBy.email,
          subject: "Food Request Approved - NutriSync AI",
          html: approvalEmail,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Food approved successfully",
        food,
      });
    } else {
      // Reject the food - delete it
      await Food.findByIdAndDelete(foodId);

      // Send rejection email to user
      if (food.createdBy && food.createdBy.email) {
        const rejectionEmail = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Food Request Update</h1>
              </div>
              <div class="content">
                <p>Hello ${food.createdBy.name},</p>
                <p>Thank you for your submission of <strong>"${food.name}"</strong>. Unfortunately, we're unable to approve this request at this time.</p>
                ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
                <p>If you have questions or would like to resubmit with corrections, please feel free to submit a new request.</p>
                <p style="margin-top: 30px;">Best regards,<br>The NutriSync AI Team</p>
              </div>
              <div class="footer">
                <p>© 2026 NutriSync AI. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await sendEmail({
          to: food.createdBy.email,
          subject: "Food Request Update - NutriSync AI",
          html: rejectionEmail,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Food request rejected and removed",
      });
    }
  } catch (error) {
    console.error("Food approval error:", error);
    return NextResponse.json(
      { error: "Failed to process food approval", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * GET /api/meals/admin/approve
 * Get all pending food requests (admin only)
 */
export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 },
      );
    }

    await connectDB();

    const pendingFoods = await Food.find({ "verification.verified": false })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      pendingRequests: pendingFoods,
      count: pendingFoods.length,
    });
  } catch (error) {
    console.error("Get pending requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending requests", details: error.message },
      { status: 500 },
    );
  }
}
