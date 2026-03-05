import { Webhook } from "svix";
import { headers } from "next/headers";
import { connectDB } from "@/lib/connectDB";
import User from "@/model/user";

export async function POST(req) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Connect to database
  await connectDB();

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url, public_metadata } = evt.data;

    try {
      // If the user was pre-created by the admin endpoint, skip creation to avoid duplicates
      const existing = await User.findOne({ clerkId: id });
      if (existing) {
        console.log("User already exists in MongoDB (created by admin endpoint):", existing._id);
        return Response.json({ message: "User already exists", userId: existing._id }, { status: 200 });
      }

      // Respect role set in Clerk publicMetadata (e.g. "admin"), default to "user"
      const role = public_metadata?.role === "admin" ? "admin" : "user";

      const newUser = await User.create({
        clerkId: id,
        email: email_addresses[0]?.email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
        profilePicture: image_url,
        onboarded: role === "admin", // admins skip onboarding
        role,
      });

      console.log("User created in MongoDB:", newUser._id);

      return Response.json(
        {
          message: "User created successfully",
          userId: newUser._id,
        },
        { status: 201 },
      );
    } catch (error) {
      console.error("Error creating user in MongoDB:", error);
      return Response.json(
        {
          error: "Failed to create user",
          details: error.message,
        },
        { status: 500 },
      );
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      // Update user in MongoDB
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: email_addresses[0]?.email_address,
          name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
          profilePicture: image_url,
          lastActive: new Date(),
        },
        { new: true },
      );

      if (!updatedUser) {
        // User doesn't exist, create them
        const newUser = await User.create({
          clerkId: id,
          email: email_addresses[0]?.email_address,
          name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
          profilePicture: image_url,
          onboarded: false,
          role: "user",
        });

        console.log("User created in MongoDB (via update):", newUser._id);
        return Response.json(
          {
            message: "User created successfully",
            userId: newUser._id,
          },
          { status: 201 },
        );
      }

      console.log("User updated in MongoDB:", updatedUser._id);
      return Response.json({
        message: "User updated successfully",
        userId: updatedUser._id,
      });
    } catch (error) {
      console.error("Error updating user in MongoDB:", error);
      return Response.json(
        {
          error: "Failed to update user",
          details: error.message,
        },
        { status: 500 },
      );
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      // Soft delete or remove user from MongoDB
      const deletedUser = await User.findOneAndUpdate(
        { clerkId: id },
        {
          deletedAt: new Date(),
          email: `deleted_${id}@deleted.com`, // Prevent email conflicts
        },
        { new: true },
      );

      if (!deletedUser) {
        return Response.json(
          {
            error: "User not found",
          },
          { status: 404 },
        );
      }

      console.log("User soft-deleted in MongoDB:", deletedUser._id);
      return Response.json({
        message: "User deleted successfully",
        userId: deletedUser._id,
      });
    } catch (error) {
      console.error("Error deleting user in MongoDB:", error);
      return Response.json(
        {
          error: "Failed to delete user",
          details: error.message,
        },
        { status: 500 },
      );
    }
  }

  return Response.json(
    { message: "Webhook received", eventType },
    { status: 200 },
  );
}
