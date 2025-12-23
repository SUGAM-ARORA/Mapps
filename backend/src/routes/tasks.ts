import { Router, Request, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { TaskModel, Priority, TaskStatus } from '../models/Task';
import { validateTask } from '../utils/validation';
import { ApiError, catchAsync } from '../utils/errors';

const router = Router();
router.use(requireAuth);

/**
 * POST /api/tasks
 * Create a new task.
 */
router.post(
  '/',
  catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const validation = validateTask(req.body);
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      throw new ApiError(400, 'Validation failed', errors);
    }

    const { title, description, scheduledFor, deadline, priority, tags, category } = validation.data;

    const task = await TaskModel.create({
      user: req.userId,
      title,
      description,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      deadline: deadline ? new Date(deadline) : undefined,
      priority,
      tags,
      category,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: task
    });
  })
);

/**
 * GET /api/tasks
 * List tasks with optional filtering.
 */
router.get(
  '/',
  catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { status, category, tag } = req.query as { status?: TaskStatus; category?: string; tag?: string };

    const filter: Record<string, any> = { user: req.userId };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    const tasks = await TaskModel.find(filter).sort({ createdAt: -1 }).lean();

    // Apply composite urgency sorting on server for consistency
    const scored = tasks.map((t) => ({
      ...t,
      _urgencyScore: scoreTask(t)
    }));
    scored.sort((a, b) => b._urgencyScore - a._urgencyScore);

    res.json({
      success: true,
      data: scored.map(({ _urgencyScore, ...t }) => t)
    });
  })
);

/**
 * PATCH /api/tasks/:id/toggle
 * Toggle task completion status.
 */
router.patch(
  '/:id/toggle',
  catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const task = await TaskModel.findOne({ _id: id, user: req.userId });
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    task.status = task.status === 'completed' ? 'pending' : 'completed';
    task.completedAt = task.status === 'completed' ? new Date() : undefined;
    await task.save();

    res.json({
      success: true,
      data: task
    });
  })
);

/**
 * PATCH /api/tasks/:id
 * Update task.
 */
router.patch(
  '/:id',
  catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const validation = validateTask(req.body);
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      throw new ApiError(400, 'Validation failed', errors);
    }

    const task = await TaskModel.findOneAndUpdate({ _id: id, user: req.userId }, validation.data, {
      new: true
    });
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    res.json({
      success: true,
      data: task
    });
  })
);

/**
 * DELETE /api/tasks/:id
 * Delete task.
 */
router.delete(
  '/:id',
  catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    await TaskModel.deleteOne({ _id: id, user: req.userId });
    res.status(204).send();
  })
);

/**
 * Calculate composite urgency score for task sorting.
 */
function scoreTask(t: any): number {
  const now = Date.now();
  let score = 0;

  if (t.deadline) {
    const msUntilDeadline = new Date(t.deadline).getTime() - now;
    const daysUntilDeadline = msUntilDeadline / (1000 * 60 * 60 * 24);

    if (daysUntilDeadline < 0) {
      score += 10000; // Overdue
    } else if (daysUntilDeadline < 1) {
      score += 8000; // Due today
    } else if (daysUntilDeadline < 7) {
      score += 5000 * (1 - daysUntilDeadline / 7);
    } else {
      score += 100;
    }
  }

  const priorityWeights = { urgent: 1000, high: 500, medium: 100, low: 10 };
  score += priorityWeights[t.priority as Priority] || 100;

  if (t.scheduledFor) {
    const msUntilScheduled = new Date(t.scheduledFor).getTime() - now;
    if (msUntilScheduled > 0 && msUntilScheduled < 86400000) {
      score += 2000;
    }
  }

  if (t.status === 'completed') {
    score *= 0.1;
  }

  return score;
}

export default router;
