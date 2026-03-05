import { clerkMiddleware, clerkClient, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/auth(.*)",
  "/api/admin/create",
  "/auth-redirect",
]);

// Define admin routes (only accessible by admins)
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// Define admin API routes (only accessible by admins)
const isAdminApiRoute = createRouteMatcher(["/api/admin(.*)"]);

// Define user-only routes (not accessible by admins)
const isUserRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/meals(.*)",
  "/exercises(.*)",
  "/history(.*)",
  "/community(.*)",
  "/profile(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();

  // Allow public routes
  if (isPublicRoute(request)) {
    return;
  }

  // Protect all other routes - require authentication
  if (!userId) {
    return await auth.protect();
  }

  // Try JWT claims first; fall back to Clerk backend API when JWT template
  // is not configured to include publicMetadata (avoids needing dashboard setup)
  let userRole = sessionClaims?.metadata?.role;
  if (!userRole) {
    try {
      const clerk = await clerkClient();
      const clerkUser = await clerk.users.getUser(userId);
      userRole = clerkUser.publicMetadata?.role;
    } catch {
      // If Clerk API call fails, proceed without role (treated as regular user)
    }
  }

  // Admin routes: only admins allowed, redirect users to /dashboard
  if (isAdminRoute(request) || isAdminApiRoute(request)) {
    if (userRole !== "admin") {
      return Response.redirect(new URL("/dashboard", request.url));
    }
  }

  // User routes: admins are not allowed here, redirect them to /admin
  if (isUserRoute(request)) {
    if (userRole === "admin") {
      return Response.redirect(new URL("/admin", request.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
