import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'tasks', 
    pathMatch: 'full' 
  },
  { 
    path: 'tasks', 
    loadComponent: () => import('./features/tasks/task-list/task-list.component').then(m => m.TaskListComponent) 
  },
  { 
    path: 'categories', 
    loadComponent: () => import('./features/categories/category-form/category-form.component').then(m => m.CategoryFormComponent) 
  },
  { 
    path: '**', 
    redirectTo: 'tasks' 
  }
];
