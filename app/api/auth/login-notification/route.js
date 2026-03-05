import { NextResponse } from "next/server";
import { sendEmail } from "@/services/nodemailer";

/**
 * POST /api/auth/login-notification
 * Send login notification email
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 },
      );
    }

    const loginEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0;
          }
          .content { 
            background: #f9f9f9; 
            padding: 30px; 
            border-radius: 0 0 10px 10px;
          }
          .info-box {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
          }
          .footer { 
            text-align: center; 
            color: #666; 
            margin-top: 30px; 
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to NutriSync AI</h1>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>You've successfully logged in to <strong>NutriSync AI</strong> - your intelligent nutrition companion!</p>
            
            <div class="info-box">
              <p style="margin: 0;"><strong>Login Time:</strong> ${new Date().toLocaleString(
                "en-US",
                {
                  dateStyle: "long",
                  timeStyle: "short",
                },
              )}</p>
            </div>

            <p>Here's what you can do:</p>
            <ul>
              <li>📊 Track your daily meals and nutrition</li>
              <li>🏋️ Log your exercises and workouts</li>
              <li>📈 View detailed analytics and insights</li>
              <li>🤖 Get AI-powered nutrition recommendations</li>
              <li>📜 Generate comprehensive health reports</li>
            </ul>

            <p style="margin-top: 30px;">If this wasn't you, please secure your account immediately or contact our support team.</p>
            
            <p style="margin-top: 30px;">Best regards,<br>The NutriSync AI Team</p>
          </div>
          <div class="footer">
            <p>© 2026 NutriSync AI. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: "Welcome Back to NutriSync AI",
      html: loginEmailHtml,
    });

    return NextResponse.json({
      success: true,
      message: "Login notification sent",
    });
  } catch (error) {
    console.error("Login notification error:", error);
    // Don't fail the request even if email fails
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send notification",
        error: error.message,
      },
      { status: 200 },
    );
  }
}
