import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20),
  password: z.string().min(8, "Password must be at least 8 characters"),
  display_name: z.string().min(3).max(30),
});

export type RegisterInput = z.infer<typeof registerSchema>;
