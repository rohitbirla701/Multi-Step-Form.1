import { z } from "zod";

export const step1Schema = z.object({
    fullName: z.string().min(3, "Full name is required"),
    username: z
        .string()
        .min(3, "Username is required")
        .regex(/^\S*$/, "No spaces allowed"),
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
    dob: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Format DD-MM-YYYY"),
    profilePic: z.string().min(1, "Profile picture required"),
});

export const step3Schema = z.object({
    address1: z.string().min(3, "Address line 1 required"),
    address2: z.string().min(3, "Address line 2 required"),
    landmark: z.string().optional(),
    zip: z.string().regex(/^\d{5,6}$/, "Valid ZIP required"),
    state: z.string().min(1, "State required"),
    country: z.string().min(1, "Country required"),
});
