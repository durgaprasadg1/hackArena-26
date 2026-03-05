import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/auth(.*)",
]);

// Define admin routes
const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

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

  // Admin routes require admin role
  if (isAdminRoute(request)) {
    const userRole = sessionClaims?.metadata?.role;

    if (userRole !== "admin") {
      return Response.redirect(new URL("/dashboard", request.url));
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
