"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskSchema = exports.loginSchema = exports.registerSchema = void 0;
exports.validateRegister = validateRegister;
exports.validateLogin = validateLogin;
exports.validateTask = validateTask;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain an uppercase letter')
        .regex(/[a-z]/, 'Password must contain a lowercase letter')
        .regex(/\d/, 'Password must contain a number')
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password required')
});
exports.taskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title required').max(100, 'Title too long'),
    description: zod_1.z.string().max(500, 'Description too long').optional(),
    scheduledFor: zod_1.z.string().datetime().optional().or(zod_1.z.literal('')),
    deadline: zod_1.z.string().datetime().optional().or(zod_1.z.literal('')),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    tags: zod_1.z.array(zod_1.z.string().min(1).max(20)).max(10).default([]),
    category: zod_1.z.string().max(50).optional()
});
function validateRegister(data) {
    return exports.registerSchema.safeParse(data);
}
function validateLogin(data) {
    return exports.loginSchema.safeParse(data);
}
function validateTask(data) {
    return exports.taskSchema.safeParse(data);
}
