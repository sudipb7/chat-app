import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(1, { message: "Name is required" })
    .max(255, { message: "Name must be at most 255 characters" }),
  email: z
    .string({ message: "Email is required" })
    .min(1, { message: "Email is required" })
    .email({ message: "Email is invalid" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, { message: "Email is required" })
    .email({ message: "Email is invalid" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const usernameSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(3, { message: "Username must at least 3 characters" })
    .max(32, { message: "Username must be at most 32 characters" }),
});

export type UsernameInput = z.infer<typeof usernameSchema>;

export const userSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(3, { message: "Username must at least 3 characters" })
    .max(32, { message: "Username must be at most 32 characters" }),
  email: z
    .string({ message: "Email is required" })
    .min(1, { message: "Email is required" })
    .email({ message: "Email is invalid" }),
  name: z
    .string({ message: "Name is required" })
    .min(1, { message: "Name is required" })
    .max(255, { message: "Name must be at most 255 characters" }),
  bio: z.string().max(200, { message: "Bio must be at most 200 characters" }).optional(),
  image: z.string().url({ message: "Image URL is invalid" }).optional(),
});

export type UserInput = z.infer<typeof userSchema>;
