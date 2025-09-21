import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Debug mode - set to true for detailed logging
const DEBUG_MODE = process.env.NODE_ENV === "development";

// Helper function to verify JWT token
async function verifyToken(token, secret) {
  try {
    if (!token) {
      if (DEBUG_MODE) console.log("🔍 No token provided");
      return null;
    }

    // Verify token with proper issuer and audience
    const { payload } = await jwtVerify(token, secret, {
      issuer: process.env.JWT_ISSUER || "almasync-backend",
      audience: process.env.JWT_AUDIENCE || "almasync-frontend",
    });

    if (DEBUG_MODE) {
      console.log("✅ Token verified successfully");
      console.log("✅ Payload:", {
        userId: payload.userId,
        role: payload.role,
        email: payload.email,
        sessionId: payload.sessionId,
      });
    }
    return payload;
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    if (DEBUG_MODE) {
      console.error("❌ Token preview:", token?.substring(0, 50) + "...");
      console.error("❌ Error details:", {
        name: error.name,
        code: error.code,
        claim: error.claim,
      });
    }
    return null;
  }
}

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  console.log("Middleware processing path:", path);

  // Get access token from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  console.log("Access token found:", !!accessToken);

  // Use the same JWT secret as backend (matching jwt.js)
  const ACCESS_TOKEN_SECRET =
    process.env.JWT_ACCESS_TOKEN_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production";

  const secret = new TextEncoder().encode(ACCESS_TOKEN_SECRET);

  let user = null;
  if (accessToken) {
    const payload = await verifyToken(accessToken, secret);
    if (payload) {
      user = {
        userId: payload.userId,
        role: payload.role,
        email: payload.email,
        sessionId: payload.sessionId,
        tokenId: payload.tokenId,
      };
    }
  }

  console.log("Current path:", path);
  console.log("User from token:", user);
  const userRoutes = [
    "/alumni-directory",
    "/student-directory",
    "/job-portal",
    "/internship-portal",
    "/mentorships",
    "/workshops-webinars",
    "/messaging",
    "/profile",
    "/notifications",
    "/feed",
  ];

  const adminRoutes = [
    "/admin",
    "/admin/alumni",
    "/admin/alumni-analytics",
    "/admin/students",
    "/admin/student-analytics",
    "/admin/jobs",
    "/admin/job-analytics",
    "/admin/internships",
    "/admin/internship-analytics",
    "/admin/mentorships",
    "/admin/mentorship-analytics",
  ];

  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path === "/login/admin" ||
    path === "/forgot-password" ||
    path === "/unauthorized";

  const isAdminRoute =
    adminRoutes.some((route) => path.startsWith(route)) ||
    path.startsWith("/admin");

  const isUserRoute = userRoutes.some((route) => path.startsWith(route));

  if (user) {
    console.log(
      `✅ Authenticated user: ${user.userId}, Role: ${user.role}, Path: ${path}`
    );

    if (isPublicPath && path !== "/") {
      const redirectPath = user.role === "admin" ? "/admin" : "/";
      console.log(
        `🔄 Redirecting authenticated ${user.role} from ${path} to ${redirectPath}`
      );
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    if (isAdminRoute && user.role !== "admin") {
      console.log(
        `❌ Access denied: ${user.role} tried to access admin route ${path}`
      );
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Check user role access
    if (isUserRoute && !["student", "alumni"].includes(user.role)) {
      console.log(
        `❌ Access denied: ${user.role} tried to access user route ${path}`
      );
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Add user context to headers for pages to use
    const response = NextResponse.next();
    response.headers.set("x-user-id", user.userId);
    response.headers.set("x-user-role", user.role);
    response.headers.set("x-user-email", user.email || "");
    console.log(`✅ Access granted for ${user.role} to ${path}`);
    return response;
  } else {
    console.log(`❌ Unauthenticated access attempt to: ${path}`);

    // Redirect unauthenticated users to login
    if (!isPublicPath) {
      const loginUrl = isAdminRoute ? "/login/admin" : "/login";
      const redirectUrl = `${loginUrl}?redirect=${encodeURIComponent(path)}`;
      console.log(`🔄 Redirecting to login: ${redirectUrl}`);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    console.log(`✅ Public path access granted: ${path}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/alumni-directory",
    "/student-directory",
    "/job-portal",
    "/internship-portal",
    "/mentorships",
    "/workshops-webinars",
    "/messaging",
    "/profile",
    "/notifications",
    "/feed",
    "/admin",
    "/admin/alumni",
    "/admin/alumni-analytics",
    "/admin/students",
    "/admin/student-analytics",
    "/admin/jobs",
    "/admin/job-analytics",
    "/admin/internships",
    "/admin/internship-analytics",
    "/admin/mentorships",
    "/admin/mentorship-analytics",
    "/login",
    "/register",
    "/login/admin",
  ],
};
