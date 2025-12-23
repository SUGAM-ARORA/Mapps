export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  deadline: string; // ISO date string
  tags?: string[];
  category?: string;
  estimatedDuration?: number; // in minutes
  completedAt?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  user: string; // user ID
}

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user?: User;
  token?: string;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string;
}

export interface TasksState {
  items: Task[];
  loading: boolean;
  error?: string;
}
