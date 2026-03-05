"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthNotifications() {
  const { isSignedIn, isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Show welcome message only once per session
      const hasShownWelcome = sessionStorage.getItem("welcomeShown");

      if (!hasShownWelcome) {
        toast.success(`Welcome back, ${user.firstName || "User"}!`, {
          description: "You're successfully logged in.",
          duration: 3000,
        });
        sessionStorage.setItem("welcomeShown", "true");

        // Send login notification email in background
        sendLoginNotification(
          user.primaryEmailAddress?.emailAddress,
          user.firstName || "User",
        );
      }
    }
  }, [isSignedIn, isLoaded, user]);

  const sendLoginNotification = async (email, name) => {
    try {
      await fetch("/api/auth/login-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
    } catch (error) {
      // Silently fail - don't bother user with email errors
      console.error("Failed to send login notification:", error);
    }
  };

  return null;
}
