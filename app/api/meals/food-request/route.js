import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Food from "@/model/food";
import User from "@/model/user";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/services/nodemailer";

/**
 * POST /api/meals/food-request
 * Submit a request to add a new food item
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
      locality,
      imageUrl,
      servingSize,
      nutrition,
      minerals,
      vitamins,
    } = body;

    // Validate required fields
    if (!name || !servingSize || !nutrition) {
      return NextResponse.json(
        { error: "Name, servingSize, and nutrition are required" },
        { status: 400 },
      );
    }

    // Create unverified food entry
    const food = await Food.create({
      name,
      locality: locality || "",
      imageUrl: imageUrl || "",
      servingSize,
      nutrition,
      minerals: minerals || {},
      vitamins: vitamins || {},
      createdBy: user._id,
      verification: {
        verified: false,
      },
    });

    // Get all admin emails
    const admins = await User.find({ role: "admin" }).select("email name");

    if (admins.length > 0) {
      // Send email to admins for approval
      const adminEmails = admins.map((admin) => admin.email).join(",");

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .food-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .nutrition-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px; }
            .nutrition-item { background: #f0f0f0; padding: 10px; border-radius: 5px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
            .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍽️ New Food Request</h1>
            </div>
            <div class="content">
              <p>Hello Admin,</p>
              <p>A user has submitted a new food item for approval:</p>
              
              <div class="food-details">
                <h3>${name}</h3>
                ${locality ? `<p><strong>Locality:</strong> ${locality}</p>` : ""}
                <p><strong>Submitted by:</strong> ${user.name} (${user.email})</p>
                <p><strong>Serving Size:</strong> ${servingSize.value} ${servingSize.unit}</p>
                
                <h4>Nutritional Information:</h4>
                <div class="nutrition-grid">
                  <div class="nutrition-item"><strong>Calories:</strong> ${nutrition.calories || 0} kcal</div>
                  <div class="nutrition-item"><strong>Protein:</strong> ${nutrition.protein || 0}g</div>
                  <div class="nutrition-item"><strong>Carbs:</strong> ${nutrition.carbs || 0}g</div>
                  <div class="nutrition-item"><strong>Fat:</strong> ${nutrition.fat || 0}g</div>
                  <div class="nutrition-item"><strong>Fiber:</strong> ${nutrition.fiber || 0}g</div>
                  <div class="nutrition-item"><strong>Sugar:</strong> ${nutrition.sugar || 0}g</div>
                </div>

                ${imageUrl ? `<p style="margin-top: 15px;"><strong>Image:</strong> <a href="${imageUrl}" target="_blank">View Image</a></p>` : ""}
              </div>
              
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/food-requests" class="button">
                  Review Request
                </a>
              </p>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Please review and approve or reject this food item request.
              </p>
            </div>
            <div class="footer">
              <p>© 2026 NutriSync AI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail({
        to: adminEmails,
        subject: `New Food Request: ${name}`,
        html: emailHtml,
      });
    }

    // Send confirmation email to user
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Food Request Submitted</h1>
          </div>
          <div class="content">
            <p>Hello ${user.name},</p>
            <p>Thank you for contributing to NutriSync AI! Your food request for <strong>"${name}"</strong> has been successfully submitted.</p>
            <p>Our team will review your submission, and you'll receive an email notification once it's been approved or if we need additional information.</p>
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
      to: user.email,
      subject: "Food Request Submitted - NutriSync AI",
      html: userEmailHtml,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Food request submitted successfully. You'll be notified once it's reviewed.",
        food,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Food request error:", error);
    return NextResponse.json(
      { error: "Failed to submit food request", details: error.message },
      { status: 500 },
    );
  }
}
