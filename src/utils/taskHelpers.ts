import { Task, TaskStatus } from '@types/index';

export function calculateUrgencyScore(task: Task): number {
  const now = new Date();
  const deadline = new Date(task.deadline);
  const daysDiff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  let urgencyScore = 0;
  if (daysDiff < 0) urgencyScore = 100; // Overdue
  else if (daysDiff <= 1) urgencyScore = 80; // Due today/tomorrow
  else if (daysDiff <= 3) urgencyScore = 60; // Due within 3 days
  else if (daysDiff <= 7) urgencyScore = 40; // Due within a week
  else urgencyScore = Math.max(0, 20 - daysDiff); // Decreasing urgency
  
  return urgencyScore;
}

export function filterTasks(
  tasks: Task[], 
  filters: { status?: string; category?: string; search?: string }
): Task[] {
  return tasks.filter(task => {
    // Status filter
    if (filters.status && filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }
    
    // Category filter
    if (filters.category && task.category !== filters.category) {
      return false;
    }
    
    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      if (!task.title.toLowerCase().includes(query) && 
          !task.description?.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    return true;
  });
}

export function isDueToday(task: Task): boolean {
  const today = new Date();
  const deadline = new Date(task.deadline);
  
  return today.toDateString() === deadline.toDateString();
}

export function isTaskOverdue(task: Task): boolean {
  if (task.status === 'completed') return false;
  
  const now = new Date();
  const deadline = new Date(task.deadline);
  
  return deadline < now;
}
