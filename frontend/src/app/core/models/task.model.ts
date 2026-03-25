export type TaskStatus = 'pending' | 'in_progress' | 'done';

export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
  categoryId: number;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  categoryId?: number;
}