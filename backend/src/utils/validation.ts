import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/\d/, 'Password must contain a number')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password required')
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Title required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  scheduledFor: z.string().datetime().optional().or(z.literal('')),
  deadline: z.string().datetime().optional().or(z.literal('')),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  tags: z.array(z.string().min(1).max(20)).max(10).default([]),
  category: z.string().max(50).optional()
});

export function validateRegister(data: unknown) {
  return registerSchema.safeParse(data);
}

export function validateLogin(data: unknown) {
  return loginSchema.safeParse(data);
}

export function validateTask(data: unknown) {
  return taskSchema.safeParse(data);
}
