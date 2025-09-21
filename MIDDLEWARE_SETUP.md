# Middleware Token Authentication - Setup Guide

## 🔧 **Issues Fixed**

### 1. **Token Secret Mismatch**

- ✅ **Frontend middleware** now uses the same JWT secret as backend: `your-super-secret-jwt-key-change-this-in-production`
- ✅ **Environment files** created with matching JWT configurations

### 2. **Token Verification Issues**

- ✅ Enhanced error handling with detailed logging
- ✅ Proper JWT verification with issuer/audience validation
- ✅ Debug mode for development environment

### 3. **Cookie Handling**

- ✅ Fixed login API to set multiple cookies (accessToken, refreshToken, sessionId, userInfo)
- ✅ Proper cookie options with `sameSite: "lax"` for better compatibility
- ✅ HTTP-only cookies for security

### 4. **Route Protection**

- ✅ Enhanced middleware with better role-based access control
- ✅ Smart redirects based on user roles
- ✅ Request headers with user context

## 🎯 **Current Setup**

### **Middleware Flow:**

1. **Extract Token**: Gets `accessToken` from HTTP-only cookies
2. **Verify Token**: Validates JWT with backend-matching secret
3. **Extract User Info**: Creates user object with role, ID, email, etc.
4. **Route Protection**: Enforces role-based access control
5. **Smart Redirects**: Sends users to appropriate dashboards

### **Token Verification Process:**

```javascript
// Same secret as backend jwt.js
const ACCESS_TOKEN_SECRET =
  "your-super-secret-jwt-key-change-this-in-production";

// Verify with issuer/audience validation
await jwtVerify(token, secret, {
  issuer: "almasync-backend",
  audience: "almasync-frontend",
});
```

### **Cookie Structure:**

- `accessToken` (HTTP-only, 15 minutes)
- `refreshToken` (HTTP-only, 7-30 days)
- `sessionId` (HTTP-only, 7-30 days)
- `userInfo` (readable, 24 hours) - for client-side access

## 🧪 **Testing Instructions**

### **1. Environment Setup**

```bash
# Frontend (.env.local)
JWT_ACCESS_TOKEN_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ISSUER=almasync-backend
JWT_AUDIENCE=almasync-frontend
BACKEND_URL=http://localhost:3000/api/v1

# Backend (.env)
JWT_ACCESS_TOKEN_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ISSUER=almasync-backend
JWT_AUDIENCE=almasync-frontend
```

### **2. Test Login Flow**

1. Start both backend and frontend servers
2. Navigate to `/login`
3. Login with valid credentials
4. Check browser DevTools > Application > Cookies for:
   - `accessToken` (should be present and HTTP-only)
   - `refreshToken` (should be present and HTTP-only)
   - `sessionId` (should be present)
   - `userInfo` (should contain user data)

### **3. Test Middleware Protection**

1. **Public Routes**: Access `/`, `/login`, `/register` (should work)
2. **Protected Routes**: Access `/feed`, `/profile` (should redirect to login if not authenticated)
3. **Admin Routes**: Access `/admin` (should redirect to `/unauthorized` for non-admin users)
4. **Role-based Redirects**: Login as different roles and verify redirect to appropriate dashboard

### **4. Debug Mode**

Enable debug logging by setting `NODE_ENV=development`. Check console for:

- ✅ Token verification success messages
- ❌ Token verification failure details
- 🔄 Redirect logging
- 🔍 Route access attempts

## 🚨 **Common Issues & Solutions**

### **Issue: "Token verification failed"**

**Solutions:**

1. Check JWT secrets match between frontend/backend
2. Verify token is being set in cookies during login
3. Check token expiration (15 minutes for access token)
4. Ensure issuer/audience match in both systems

### **Issue: "Infinite redirects"**

**Solutions:**

1. Check public routes are correctly defined
2. Verify role-based redirects don't create loops
3. Ensure `/unauthorized` is in public paths

### **Issue: "Cookies not being set"**

**Solutions:**

1. Check `sameSite` cookie setting (use "lax" not "strict")
2. Verify `secure` setting matches environment (false for development)
3. Check if login API is returning success response

### **Issue: "Role-based access not working"**

**Solutions:**

1. Verify token payload contains correct `role` field
2. Check user role extraction in middleware
3. Ensure route definitions match actual paths

## 📝 **Key Files Updated**

1. **`src/middleware.js`** - Enhanced token verification and route protection
2. **`src/app/api/auth/login/route.js`** - Fixed cookie setting and error handling
3. **`.env.example`** - JWT configuration templates
4. **`src/utils/debugMiddleware.js`** - Debug utilities for troubleshooting

## 🔐 **Security Features**

- HTTP-only cookies prevent XSS attacks
- JWT token validation with issuer/audience verification
- Role-based access control
- Automatic token expiration handling
- Secure cookie options for production

The middleware is now properly configured to access tokens from cookies, decode them, and extract user information for complete role-based authentication! 🚀
