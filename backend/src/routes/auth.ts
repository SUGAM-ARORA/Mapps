import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { validateRegister, validateLogin } from '../utils/validation';
import { ApiError, catchAsync } from '../utils/errors';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user with email and password.
 */
router.post(
  '/register',
  catchAsync(async (req: Request, res: Response) => {
    const validation = validateRegister(req.body);
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      throw new ApiError(400, 'Validation failed', errors);
    }

    const { email, password } = validation.data;

    // Check if user exists
    const existing = await UserModel.findOne({ email });
    if (existing) {
      throw new ApiError(409, 'Email already registered');
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await UserModel.create({ email, passwordHash });

    // Generate JWT
    const token = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET || 'dev', {
      expiresIn: '7d'
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, email: user.email }
      }
    });
  })
);

/**
 * POST /api/auth/login
 * Authenticate user and return JWT.
 */
router.post(
  '/login',
  catchAsync(async (req: Request, res: Response) => {
    const validation = validateLogin(req.body);
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      throw new ApiError(400, 'Validation failed', errors);
    }

    const { email, password } = validation.data;

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Generate JWT
    const token = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET || 'dev', {
      expiresIn: '7d'
    });

    res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, email: user.email }
      }
    });
  })
);

export default router;
