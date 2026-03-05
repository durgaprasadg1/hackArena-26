"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AuthRedirectPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    // Don't run until Clerk has resolved, and only run once
    if (!isLoaded || redirected.current) return;

    if (!user) {
      redirected.current = true;
      router.replace("/sign-in");
      return;
    }

    const clerkRole = user.publicMetadata?.role;

    // Fast path for admin — Clerk publicMetadata is already set on creation,
    // no need to wait for a DB round-trip
    if (clerkRole === "admin") {
      redirected.current = true;
      router.replace("/admin");
      return;
    }

    // Regular user: verify onboarding status from DB
    redirected.current = true;
    fetch("/api/user/profile")
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error(res.status)),
      )
      .then((data) => {
        const effectiveRole = data?.user?.role || clerkRole;
        if (effectiveRole === "admin") {
          router.replace("/admin");
        } else if (!data?.user?.onboarded) {
          router.replace("/onboarding");
        } else {
          router.replace("/dashboard");
        }
      })
      .catch(() => {
        router.replace("/dashboard");
      });
  }, [isLoaded, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mx-auto mb-4" />
        <p className="text-sm text-gray-500">Signing you in...</p>
      </div>
    </div>
  );
}
