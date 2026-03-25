import { Component, signal, computed, inject, OnInit } from '@angular/core';
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
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p class="text-gray-600">Manage your tasks and projects</p>
        </div>

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
            (click)="openCreateForm()"
            class="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
          >
            + New Task
          </button>
        </div>

        <div *ngIf="isLoading()" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <div *ngIf="!isLoading() && filteredTasks().length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">No tasks found. Create one to get started!</p>
        </div>

        <div *ngIf="!isLoading() && filteredTasks().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-task-card
            *ngFor="let task of filteredTasks()"
            [task]="task"
            (deleted)="deleteTask($event)"
            (statusChanged)="updateTaskStatus($event)"
            (edit)="editTask($event)"
          />
        </div>
      </div>

      <app-task-form
        *ngIf="showForm()"
        [task]="editingTask()"
        [categories]="categories()"
        [submitting]="formSubmitting()"
        (saved)="saveTask($event)"
        (cancelled)="cancelForm()"
      />
    </div>
  `,
  styles: []
})
export class TaskListComponent implements OnInit {
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
  filteredTasks = computed(() => {
    const allTasks = this.tasks();
    const filter = this.currentFilter();
    return filter === 'all' ? allTasks : allTasks.filter((t) => t.status === filter);
  });

  ngOnInit(): void {
    this.loadTasks();
    this.loadCategories();
  }

  openCreateForm(): void {
    this.editingTask.set(null);
    this.loadCategories();
    this.showForm.set(true);
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
    this.formSubmitting.set(true);
    this.taskService.getById(task.id).subscribe({
      next: (fullTask) => {
        this.editingTask.set(fullTask);
        this.loadCategories();
        this.showForm.set(true);
        this.formSubmitting.set(false);
      },
      error: () => {
        this.editingTask.set(task);
        this.loadCategories();
        this.showForm.set(true);
        this.formSubmitting.set(false);
      }
    });
  }

  saveTask(event: { data: CreateTaskDTO | UpdateTaskDTO; isEdit: boolean }): void {
    const editingTask = this.editingTask();
    this.formSubmitting.set(true);

    if (!event.isEdit) {
      this.taskService.create(event.data as CreateTaskDTO).subscribe({
        next: (newTask) => {
          this.currentFilter.set('all');
          this.tasks.update((tasks) => [newTask, ...tasks.filter((t) => t.id !== newTask.id)]);
          this.showForm.set(false);
          this.editingTask.set(null);
          this.formSubmitting.set(false);
          this.loadTasks();
        },
        error: (error) => {
          console.error('Failed to create task', error);
          alert('Failed to create task');
          this.formSubmitting.set(false);
        }
      });
    } else if (editingTask) {
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
