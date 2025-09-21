// Debug utility for middleware token verification
import { jwtVerify } from "jose";

export async function debugTokenVerification(request) {
  console.log("🔍 DEBUG: Starting token verification analysis");

  // Extract token from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  console.log("🔍 DEBUG: Access token found:", !!accessToken);

  if (accessToken) {
    console.log(
      "🔍 DEBUG: Token preview:",
      accessToken.substring(0, 50) + "..."
    );
    console.log("🔍 DEBUG: Token length:", accessToken.length);

    // Check token structure (JWT should have 3 parts separated by dots)
    const tokenParts = accessToken.split(".");
    console.log("🔍 DEBUG: Token parts count:", tokenParts.length);

    if (tokenParts.length === 3) {
      try {
        // Decode header (first part)
        const header = JSON.parse(atob(tokenParts[0]));
        console.log("🔍 DEBUG: Token header:", header);

        // Decode payload (second part) - without verification
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log("🔍 DEBUG: Token payload:", {
          userId: payload.userId,
          role: payload.role,
          email: payload.email,
          exp: payload.exp,
          iat: payload.iat,
          iss: payload.iss,
          aud: payload.aud,
        });

        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp < currentTime;
        console.log("🔍 DEBUG: Token expired:", isExpired);
        console.log(
          "🔍 DEBUG: Current time:",
          currentTime,
          "Token exp:",
          payload.exp
        );
      } catch (decodeError) {
        console.error("🔍 DEBUG: Error decoding token:", decodeError.message);
      }
    }
  }

  // Test token verification with actual secret
  const ACCESS_TOKEN_SECRET =
    process.env.JWT_ACCESS_TOKEN_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production";

  console.log(
    "🔍 DEBUG: Using secret:",
    ACCESS_TOKEN_SECRET.substring(0, 20) + "..."
  );

  const secret = new TextEncoder().encode(ACCESS_TOKEN_SECRET);
  console.log("🔍 DEBUG: Encoded secret length:", secret.length);

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, secret, {
        issuer: process.env.JWT_ISSUER || "almasync-backend",
        audience: process.env.JWT_AUDIENCE || "almasync-frontend",
      });

      console.log("✅ DEBUG: Token verification SUCCESSFUL");
      console.log("✅ DEBUG: Verified payload:", {
        userId: payload.userId,
        role: payload.role,
        email: payload.email,
      });

      return payload;
    } catch (verifyError) {
      console.error(
        "❌ DEBUG: Token verification FAILED:",
        verifyError.message
      );
      console.error("❌ DEBUG: Error code:", verifyError.code);
      console.error("❌ DEBUG: Error name:", verifyError.name);

      if (verifyError.message.includes("expired")) {
        console.error("❌ DEBUG: Token is EXPIRED");
      } else if (verifyError.message.includes("signature")) {
        console.error("❌ DEBUG: Token signature is INVALID");
      } else if (verifyError.message.includes("issuer")) {
        console.error("❌ DEBUG: Token issuer is INVALID");
      } else if (verifyError.message.includes("audience")) {
        console.error("❌ DEBUG: Token audience is INVALID");
      }

      return null;
    }
  }

  console.log("🔍 DEBUG: No token to verify");
  return null;
}

export async function debugCookies(request) {
  console.log("🔍 DEBUG: All cookies:");

  const cookies = request.cookies.getAll();
  cookies.forEach((cookie) => {
    console.log(
      `🔍 DEBUG: ${cookie.name}:`,
      cookie.value?.substring(0, 50) + "..."
    );
  });

  // Specific cookie checks
  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");
  const sessionId = request.cookies.get("sessionId");
  const userInfo = request.cookies.get("userInfo");

  console.log("🔍 DEBUG: accessToken present:", !!accessToken);
  console.log("🔍 DEBUG: refreshToken present:", !!refreshToken);
  console.log("🔍 DEBUG: sessionId present:", !!sessionId);
  console.log("🔍 DEBUG: userInfo present:", !!userInfo);

  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo.value);
      console.log("🔍 DEBUG: userInfo parsed:", parsed);
    } catch (e) {
      console.error("🔍 DEBUG: Error parsing userInfo:", e.message);
    }
  }
}
