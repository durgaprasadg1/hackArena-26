import { currentUser } from "@clerk/nextjs/server";
import connectDB from "./connectDB.js";
import User from "@/model/user.js";

/**
 * Get the current authenticated user from Clerk and sync with MongoDB
 * @returns {Promise<Object|null>} MongoDB User document or null if not authenticated
 */
export async function getCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  await connectDB();

  // Find or create user in MongoDB
  let mongoUser = await User.findOne({ clerkId: clerkUser.id });

  if (!mongoUser) {
    // Create user if doesn't exist
    mongoUser = await User.create({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      name:
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        "User",
      profilePicture: clerkUser.imageUrl,
      onboarded: false,
      role: "user",
    });
  } else {
    // Update last active
    mongoUser.lastActive = new Date();
    await mongoUser.save();
  }

  return mongoUser;
}

/**
 * Get MongoDB user by Clerk ID
 * @param {string} clerkId - Clerk user ID
 * @returns {Promise<Object|null>} MongoDB User document or null
 */
export async function getUserByClerkId(clerkId) {
  await connectDB();
  return await User.findOne({ clerkId });
}

/**
 * Check if user is admin
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<boolean>}
 */
export async function isUserAdmin(userId) {
  await connectDB();
  const user = await User.findById(userId);
  return user?.role === "admin";
}
