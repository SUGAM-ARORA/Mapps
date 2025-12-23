"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const validation_1 = require("../utils/validation");
const errors_1 = require("../utils/errors");
const router = (0, express_1.Router)();
/**
 * POST /api/auth/register
 * Register a new user with email and password.
 */
router.post('/register', (0, errors_1.catchAsync)(async (req, res) => {
    const validation = (0, validation_1.validateRegister)(req.body);
    if (!validation.success) {
        const errors = validation.error.flatten().fieldErrors;
        throw new errors_1.ApiError(400, 'Validation failed', errors);
    }
    const { email, password } = validation.data;
    // Check if user exists
    const existing = await User_1.UserModel.findOne({ email });
    if (existing) {
        throw new errors_1.ApiError(409, 'Email already registered');
    }
    // Hash password and create user
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    const user = await User_1.UserModel.create({ email, passwordHash });
    // Generate JWT
    const token = jsonwebtoken_1.default.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET || 'dev', {
        expiresIn: '7d'
    });
    res.status(201).json({
        success: true,
        data: {
            token,
            user: { id: user._id, email: user.email }
        }
    });
}));
/**
 * POST /api/auth/login
 * Authenticate user and return JWT.
 */
router.post('/login', (0, errors_1.catchAsync)(async (req, res) => {
    const validation = (0, validation_1.validateLogin)(req.body);
    if (!validation.success) {
        const errors = validation.error.flatten().fieldErrors;
        throw new errors_1.ApiError(400, 'Validation failed', errors);
    }
    const { email, password } = validation.data;
    // Find user
    const user = await User_1.UserModel.findOne({ email });
    if (!user) {
        throw new errors_1.ApiError(401, 'Invalid credentials');
    }
    // Verify password
    const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!valid) {
        throw new errors_1.ApiError(401, 'Invalid credentials');
    }
    // Generate JWT
    const token = jsonwebtoken_1.default.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET || 'dev', {
        expiresIn: '7d'
    });
    res.json({
        success: true,
        data: {
            token,
            user: { id: user._id, email: user.email }
        }
    });
}));
exports.default = router;
