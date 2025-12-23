import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDb } from './utils/db';
import authRouter from './routes/auth';
import taskRouter from './routes/tasks';
import { errorHandler } from './utils/errors';

export async function createServer() {
  await connectDb();

  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }));

  // Body parsing
  app.use(express.json({ limit: '10kb' }));

  // Logging
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // Routes
  app.use('/api/auth', authRouter);
  app.use('/api/tasks', taskRouter);

  // Health check
  app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

  // 404 handler
  app.use('*', (_req, res) => res.status(404).json({ success: false, message: 'Not found' }));

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
