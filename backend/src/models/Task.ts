import mongoose, { Schema } from 'mongoose';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'completed';

export interface ITask extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  scheduledFor?: Date;
  deadline?: Date;
  priority: Priority;
  tags: string[];
  category?: string;
  status: TaskStatus;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  scheduledFor: { type: Date },
  deadline: { type: Date },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  tags: { type: [String], default: [] },
  category: { type: String, trim: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  completedAt: { type: Date }
}, { timestamps: true });

TaskSchema.index({ user: 1, status: 1, priority: 1 });

export const TaskModel = mongoose.model<ITask>('Task', TaskSchema);
