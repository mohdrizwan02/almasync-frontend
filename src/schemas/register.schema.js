import { z } from "zod";


export const registerSchema = z
    .object({
        firstName: z
            .string()
            .min(1, "First name is required")
            .min(2, "First name must be at least 2 characters")
            .max(50, "First name must be less than 50 characters")
            .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
        lastName: z
            .string()
            .min(1, "Last name is required")
            .min(2, "Last name must be at least 2 characters")
            .max(50, "Last name must be less than 50 characters")
            .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email address"),
        password: z
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
        uid: z
            .string()
            .min(1, "Enrollment number is required")
            .min(5, "Enrollment number must be at least 5 characters")
            .max(20, "Enrollment number must be less than 20 characters"),
        degree: z.string().min(1, "Degree is required"),
        department: z.string().min(1, "Department is required"),
        admissionYear: z
            .string()
            .min(1, "Admission year is required")
            .regex(/^\d{4}$/, "Please enter a valid 4-digit year")
            .refine((year) => {
                const currentYear = new Date().getFullYear();
                const yearNum = parseInt(year);
                return yearNum >= 1950 && yearNum <= currentYear;
            }, "Please enter a valid admission year"),
        passoutYear: z
            .string()
            .min(1, "Passout year is required")
            .regex(/^\d{4}$/, "Please enter a valid 4-digit year")
            .refine((year) => {
                const currentYear = new Date().getFullYear();
                const yearNum = parseInt(year);
                return yearNum >= 1950 && yearNum <= currentYear + 10;
            }, "Please enter a valid passout year"),
    })
    .refine(
        (data) => {
            const admission = parseInt(data.admissionYear);
            const passout = parseInt(data.passoutYear);
            return passout > admission;
        },
        {
            message: "Passout year must be after admission year",
            path: ["passoutYear"],
        }
    );