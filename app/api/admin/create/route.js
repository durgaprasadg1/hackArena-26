import { clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/connectDB";
import User from "@/model/user";

export async function POST(req) {
  // Validate secret key — only requests with the correct header can create admins
  const secret = req.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_CREATE_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password, name } = body;

  if (!email || !password || !name) {
    return Response.json(
      { error: "email, password, and name are required" },
      { status: 400 },
    );
  }

  // Basic input validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.json({ error: "Invalid email format" }, { status: 400 });
  }

  if (password.length < 8) {
    return Response.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || undefined;

  try {
    // Create Clerk user and immediately set admin role in publicMetadata
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName,
      publicMetadata: { role: "admin" },
      skipPasswordChecks: true,
    });

    // Create corresponding MongoDB record
    await connectDB();
    const dbUser = await User.create({
      clerkId: clerkUser.id,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      role: "admin",
      onboarded: true,
    });

    return Response.json(
      {
        message: "Admin created successfully",
        adminId: dbUser._id.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    // Log full Clerk error details
    console.error("Admin creation error:", error?.errors ?? error);

    // Clerk duplicate email error
    if (error.errors?.[0]?.code === "form_identifier_exists") {
      return Response.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    // MongoDB duplicate key error
    if (error.code === 11000) {
      return Response.json(
        { error: "An account with this email already exists in the database" },
        { status: 409 },
      );
    }

    // Clerk validation error — return details so the caller can diagnose
    if (error.clerkError) {
      const clerkErrors = error.errors?.map((e) => ({
        code: e.code,
        message: e.message,
        longMessage: e.longMessage,
      }));
      return Response.json(
        { error: "Clerk rejected the request", clerkErrors },
        { status: 422 },
      );
    }

    return Response.json(
      { error: "Failed to create admin", details: error.message },
      { status: 500 },
    );
  }
}
