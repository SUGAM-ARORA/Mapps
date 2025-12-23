import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title required').max(100, 'Title too long'),
  description: z.string().max(500).optional(),
  scheduledFor: z.string().datetime().optional(),
  deadline: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  tags: z.array(z.string().min(1)).max(10).default([]),
  category: z.string().max(50).optional()
});

export const authSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be 8+ chars').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must have uppercase, lowercase, and number'
  )
});

export type TaskPayload = z.infer<typeof taskSchema>;
export type AuthPayload = z.infer<typeof authSchema>;
