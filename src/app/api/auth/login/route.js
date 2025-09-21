import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000/api/v1";
  try {
    const body = await request.json();
    console.log("Login request body:", body);

    // Support both email and uid login
    const { email, uid, password, rememberMe = false } = body;

    // Prepare login data for backend
    const loginData = {
      password,
      rememberMe,
      ...(email ? { email } : { uid }),
    };

    console.log("Sending to backend:", loginData);

    // Call your Node.js backend
    const backendResponse = await axios.post(
      `${BACKEND_URL}/auth/login`,
      loginData,
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": request.headers.get("user-agent") || "Next-Frontend",
        },
        timeout: 10000,
      }
    );

    const responseData = backendResponse.data.data;
    console.log("Backend response data:", responseData);

    const { user, tokens, sessionId } = responseData;

    // Set session and user info cookies for easy access
    const userInfo = {
      id: user._id,
      uid: user.uid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      isProfileVerified: user.isProfileVerified,
    };

    console.log(
      "Setting cookies for user:",
      userInfo.uid,
      "Role:",
      userInfo.role
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        user: userInfo,
        sessionId,
        tokenInfo: {
          tokenType: tokens.tokenType,
          expiresIn: tokens.expiresIn,
        },
      },
    });

    // Set HTTP-only cookies for security
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from strict to lax for better compatibility
      path: "/",
    };

    // Set access token cookie (15 minutes)
    response.cookies.set("accessToken", tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60, // 15 minutes
    });

    // Set refresh token cookie (7 or 30 days based on rememberMe)
    response.cookies.set("refreshToken", tokens.refreshToken, {
      ...cookieOptions,
      maxAge: (rememberMe ? 30 : 7) * 24 * 60 * 60, // seconds
    });

    // Set session ID cookie
    response.cookies.set("sessionId", sessionId, {
      ...cookieOptions,
      maxAge: (rememberMe ? 30 : 7) * 24 * 60 * 60,
    });

    // Set user info cookie (not HTTP-only for client access)
    response.cookies.set("userInfo", JSON.stringify(userInfo), {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    console.log("✅ Login successful, cookies set for user:", userInfo.uid);

    return response;
  } catch (error) {
    console.error("❌ Login API error:", error.message);

    if (error.response) {
      // Backend returned an error response
      const { status, data } = error.response;
      console.error("Backend error:", status, data);

      return NextResponse.json(
        {
          success: false,
          message: data.message || "Authentication failed",
          statusCode: status,
        },
        { status }
      );
    } else if (error.request) {
      // Network error - backend is unreachable
      console.error("Network error - backend unreachable");
      return NextResponse.json(
        {
          success: false,
          message: "Unable to connect to authentication server",
        },
        { status: 503 }
      );
    } else {
      // Other error
      console.error("Unexpected error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "An unexpected error occurred",
        },
        { status: 500 }
      );
    }
  }
}
