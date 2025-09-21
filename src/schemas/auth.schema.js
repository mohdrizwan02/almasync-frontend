import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email or UID is required")
        .refine((value) => {
            // Allow either email format or UID format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const uidRegex = /^[a-zA-Z0-9]{3,20}$/; // Assuming UID is alphanumeric, 3-20 chars
            return emailRegex.test(value) || uidRegex.test(value);
        }, "Please enter a valid email address or UID"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
    rememberMe: z.boolean().default(false),
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    otp: z
        .string()
        .min(1, "OTP is required")
        .min(6, "OTP must be 6 digits")
        .max(6, "OTP must be 6 digits"),
    newPassword: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(
            /(?=.*[a-z])/,
            "Password must contain at least one lowercase letter"
        )
        .regex(
            /(?=.*[A-Z])/,
            "Password must contain at least one uppercase letter"
        )
        .regex(/(?=.*\d)/, "Password must contain at least one number")
        .regex(
            /(?=.*[@$!%*?&])/,
            "Password must contain at least one special character"
        ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(1, "New password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(
            /(?=.*[a-z])/,
            "Password must contain at least one lowercase letter"
        )
        .regex(
            /(?=.*[A-Z])/,
            "Password must contain at least one uppercase letter"
        )
        .regex(/(?=.*\d)/, "Password must contain at least one number")
        .regex(
            /(?=.*[@$!%*?&])/,
            "Password must contain at least one special character"
        ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
});
