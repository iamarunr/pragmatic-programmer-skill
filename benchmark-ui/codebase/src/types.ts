export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskCard {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  createdAt: number;
}

export interface Column {
  id: TaskStatus;
  title: string;
}

export interface FilterCriteria {
  searchQuery?: string;
  tags?: string[];
}
