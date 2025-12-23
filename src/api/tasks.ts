import api from './client';
import { Task, Priority } from '../types';

interface BackendTasksResponse {
  success: boolean;
  data: Task[];
}

interface BackendTaskResponse {
  success: boolean;
  data: Task;
}

export async function fetchTasks(params?: { 
  status?: string; 
  category?: string; 
  tag?: string;
  search?: string;
}): Promise<Task[]> {
  try {
    const { data } = await api.get<BackendTasksResponse>('/tasks', { params });
    return data.data || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
  }
}

export async function createTask(payload: {
  title: string;
  description?: string;
  priority?: Priority;
  deadline?: string;
  tags?: string[];
  category?: string;
  estimatedDuration?: number;
}): Promise<Task> {
  try {
    const { data } = await api.post<BackendTaskResponse>('/tasks', payload);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create task');
  }
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  try {
    const { data } = await api.put<BackendTaskResponse>(`/tasks/${id}`, updates);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update task');
  }
}

export async function toggleTask(id: string): Promise<Task> {
  try {
    // First get the current task to know its status
    const currentTask = await getTask(id);
    const newStatus = currentTask.status === 'pending' ? 'completed' : 'pending';
    
    return updateTask(id, { status: newStatus });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to toggle task');
  }
}

export async function getTask(id: string): Promise<Task> {
  try {
    const { data } = await api.get<BackendTaskResponse>(`/tasks/${id}`);
    return data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get task');
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    await api.delete(`/tasks/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete task');
  }
}