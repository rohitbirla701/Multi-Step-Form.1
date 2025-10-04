import { z } from "zod";

export const step1Schema = z.object({
    fullName: z.string().min(3, "Full name is required"),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
    email: z
        .string()
        .email("Invalid email")
        .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/, "Enter full valid email"),
    mobile: z
        .string()
        .min(10, "Mobile must be at least 10 digits")
        .regex(/^[0-9]+$/, "Mobile must be numeric"),
    gender: z.string().min(1, "Gender required"),
});

export const step2Schema = z.object({
    bio: z.string().min(10, "At least 10 characters").max(200, "Max 200 chars"),
    dob: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Format DD-MM-YYYY")
        .refine((val) => {
            const parts = val.split("-").map(Number);
            const day = parts[0] || 1;
            const month = (parts[1] || 1) - 1;
            const year = parts[2] || 1900;
            return year <= 2018;
        }, "Date must be 2018 or earlier"),
    profilePic: z.string().min(1, "Profile picture required"),
});

export const step3Schema = z.object({
    address1: z.string().min(3, "Address line 1 required"),
    address2: z.string().min(3, "Address line 2 required"),
    landmark: z.string().optional(),
    zip: z.string().regex(/^[A-Za-z0-9]{3,10}$/, "Valid ZIP or Postal Code required"),
    state: z.string().min(1, "State required"),
    country: z.string().min(1, "Country required"),
});
