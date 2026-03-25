import { Component, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { CategoryService } from '../../../core/services/category.service';
import { Task, TaskStatus, CreateTaskDTO, UpdateTaskDTO } from '../../../core/models/task.model';
import { Category } from '../../../core/models/category.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormComponent } from '../task-form/task-form.component';

type FilterStatus = TaskStatus | 'all';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, TaskFormComponent],
  template: `
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p class="text-gray-600">Manage your tasks and projects</p>
        </div>

        <!-- Filter Bar -->
        <div class="flex gap-3 mb-8 flex-wrap">
          <button
            *ngFor="let status of filterOptions"
            (click)="setFilter(status)"
            [ngClass]="{
              'bg-indigo-600 text-white': currentFilter() === status,
              'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50': currentFilter() !== status
            }"
            class="px-4 py-2 rounded-lg font-medium transition"
          >
            {{ status === 'all' ? 'All' : (status | titlecase).replace('_', ' ') }}
          </button>
          <button
            (click)="showForm.set(true)"
            class="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
          >
            + New Task
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading()" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading() && filteredTasks().length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">No tasks found. Create one to get started!</p>
        </div>

        <!-- Tasks Grid -->
        <div *ngIf="!isLoading() && filteredTasks().length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-task-card
            *ngFor="let task of filteredTasks()"
            [task]="task"
            (deleted)="deleteTask($event)"
            (statusChanged)="updateTaskStatus($event)"
            (edit)="editTask($event)"
          />
        </div>
      </div>

      <!-- Form Modal -->
      <app-task-form
        *ngIf="showForm()"
        [task]="editingTask()"
        [categories]="categories"
        [submitting]="formSubmitting()"
        (saved)="saveTask($event)"
        (cancelled)="cancelForm()"
      />
    </div>
  `,
  styles: []
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  private categoryService = inject(CategoryService);

  tasks = signal<Task[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(true);
  currentFilter = signal<FilterStatus>('all');
  showForm = signal(false);
  editingTask = signal<Task | null>(null);
  formSubmitting = signal(false);

  filterOptions: FilterStatus[] = ['all', 'pending', 'in_progress', 'done'];
  filteredTasks = signal<Task[]>([]);

  constructor() {
    // Load tasks and categories on init
    effect(() => {
      this.loadTasks();
      this.loadCategories();
    });

    // Update filtered tasks when tasks or filter changes
    effect(() => {
      const allTasks = this.tasks();
      const filter = this.currentFilter();
      
      if (filter === 'all') {
        this.filteredTasks.set(allTasks);
      } else {
        this.filteredTasks.set(allTasks.filter(t => t.status === filter));
      }
    });
  }

  private loadTasks(): void {
    this.isLoading.set(true);
    this.taskService.getAll().subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load tasks', error);
        this.isLoading.set(false);
      }
    });
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (error) => {
        console.error('Failed to load categories', error);
      }
    });
  }

  setFilter(status: FilterStatus): void {
    this.currentFilter.set(status);
  }

  deleteTask(id: number): void {
    this.taskService.remove(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Failed to delete task', error);
        alert('Failed to delete task');
      }
    });
  }

  updateTaskStatus(event: { id: number; status: TaskStatus }): void {
    this.taskService.update(event.id, { status: event.status }).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Failed to update task status', error);
        alert('Failed to update task status');
      }
    });
  }

  editTask(task: Task): void {
    this.editingTask.set(task);
    this.showForm.set(true);
  }

  saveTask(event: { data: CreateTaskDTO | UpdateTaskDTO; isEdit: boolean }): void {
    const editingTask = this.editingTask();
    this.formSubmitting.set(true);
    
    if (!event.isEdit) {
      // Create new task
      this.taskService.create(event.data as CreateTaskDTO).subscribe({
        next: () => {
          this.currentFilter.set('all');
          this.loadTasks();
          this.showForm.set(false);
          this.editingTask.set(null);
          this.formSubmitting.set(false);
        },
        error: (error) => {
          console.error('Failed to create task', error);
          alert('Failed to create task');
          this.formSubmitting.set(false);
        }
      });
    } else if (editingTask) {
      // Update existing task
      this.taskService.update(editingTask.id, event.data as UpdateTaskDTO).subscribe({
        next: () => {
          this.loadTasks();
          this.showForm.set(false);
          this.editingTask.set(null);
          this.formSubmitting.set(false);
        },
        error: (error) => {
          console.error('Failed to update task', error);
          alert('Failed to update task');
          this.formSubmitting.set(false);
        }
      });
    } else {
      this.formSubmitting.set(false);
    }
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingTask.set(null);
    this.formSubmitting.set(false);
  }
}

