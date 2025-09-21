// Security and utility functions for authentication

export const authUtils = {
  // Sanitize user input
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  },

  // Validate token structure
  isValidJWT: (token) => {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    return parts.length === 3;
  },

  // Decode JWT payload (without verification - for client-side only)
  decodeJWTPayload: (token) => {
    try {
      if (!authUtils.isValidJWT(token)) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token) => {
    const payload = authUtils.decodeJWTPayload(token);
    if (!payload || !payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
  },

  // Get time until token expires (in milliseconds)
  getTimeUntilExpiry: (token) => {
    const payload = authUtils.decodeJWTPayload(token);
    if (!payload || !payload.exp) return 0;
    return Math.max(0, (payload.exp * 1000) - Date.now());
  },

  // Check if user can access resource
  canAccess: (user, resource, permission = 'read') => {
    if (!user || !resource) return false;
    
    // Admin can access everything
    if (user.role === 'admin') return true;
    
    // Resource-specific access logic
    switch (resource.type) {
      case 'profile':
        return resource.userId === user._id || permission === 'read';
      case 'message':
        return resource.participants?.includes(user._id);
      case 'admin':
        return user.role === 'admin';
      default:
        return false;
    }
  },

  // Get user display name
  getUserDisplayName: (user) => {
    if (!user) return 'Guest';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || user.uid || 'User';
  },

  // Get user initials
  getUserInitials: (user) => {
    if (!user) return 'G';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';
  },

  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate UID format
  isValidUID: (uid) => {
    const uidRegex = /^[a-zA-Z0-9]{3,20}$/;
    return uidRegex.test(uid);
  },

  // Format error message for display
  formatErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return 'An unexpected error occurred';
  },

  // Storage helpers for session data
  storage: {
    // Get item from localStorage safely
    getItem: (key, defaultValue = null) => {
      try {
        if (typeof window === 'undefined') return defaultValue;
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    },

    // Set item in localStorage safely
    setItem: (key, value) => {
      try {
        if (typeof window === 'undefined') return false;
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },

    // Remove item from localStorage safely
    removeItem: (key) => {
      try {
        if (typeof window === 'undefined') return false;
        localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    },

    // Clear all localStorage
    clear: () => {
      try {
        if (typeof window === 'undefined') return false;
        localStorage.clear();
        return true;
      } catch {
        return false;
      }
    },
  },

  // Role-based utilities
  roles: {
    isStudent: (user) => user?.role === 'student',
    isAlumni: (user) => user?.role === 'alumni',
    isAdmin: (user) => user?.role === 'admin',
    hasRole: (user, role) => user?.role === role,
    hasAnyRole: (user, roles) => roles.includes(user?.role),
    getRoleDisplayName: (role) => {
      const roleNames = {
        student: 'Student',
        alumni: 'Alumni',
        admin: 'Administrator',
      };
      return roleNames[role] || 'User';
    },
  },

  // Password validation helpers
  password: {
    hasMinLength: (password, minLength = 8) => password.length >= minLength,
    hasUppercase: (password) => /[A-Z]/.test(password),
    hasLowercase: (password) => /[a-z]/.test(password),
    hasNumber: (password) => /\d/.test(password),
    hasSpecialChar: (password) => /[@$!%*?&]/.test(password),
    
    validateStrength: (password) => {
      const checks = {
        length: authUtils.password.hasMinLength(password),
        uppercase: authUtils.password.hasUppercase(password),
        lowercase: authUtils.password.hasLowercase(password),
        number: authUtils.password.hasNumber(password),
        special: authUtils.password.hasSpecialChar(password),
      };
      
      const score = Object.values(checks).filter(Boolean).length;
      const strength = score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong';
      
      return { checks, score, strength };
    },
  },

  // URL and routing helpers
  routing: {
    // Get redirect URL from query params
    getRedirectUrl: (searchParams, defaultUrl = '/feed') => {
      return searchParams.get('redirect') || defaultUrl;
    },

    // Build login URL with redirect
    buildLoginUrl: (currentPath = '/') => {
      return currentPath !== '/' ? `/login?redirect=${encodeURIComponent(currentPath)}` : '/login';
    },

    // Check if path is public
    isPublicPath: (pathname) => {
      const publicPaths = ['/login', '/register', '/forgot-password', '/', '/about'];
      return publicPaths.includes(pathname);
    },

    // Check if path requires authentication
    isProtectedPath: (pathname) => {
      const protectedPaths = ['/profile', '/feed', '/messaging', '/notifications'];
      return protectedPaths.some(path => pathname.startsWith(path));
    },

    // Check if path is admin-only
    isAdminPath: (pathname) => {
      return pathname.startsWith('/admin');
    },
  },
};

export default authUtils;
