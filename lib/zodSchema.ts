import { z } from "zod";

export const registerSchema = z
    .object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const bookSchema = z.object({
    title: z.string().min(2, "Title is required"),
    caption: z.string().min(2, "Caption is required"),
    rating: z.number().min(1).max(5),
    image: z.string().optional(),
});