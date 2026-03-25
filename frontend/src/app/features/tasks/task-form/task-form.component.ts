import { Component, Input, Output, EventEmitter, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Task, TaskStatus, CreateTaskDTO, UpdateTaskDTO } from '../../../core/models/task.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditMode ? 'Edit Task' : 'Create New Task' }}
          </h2>
        </div>

        <form (ngSubmit)="onSubmit()" #form="ngForm" class="p-6 space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Title <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              [(ngModel)]="formData.title"
              name="title"
              #titleControl="ngModel"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter task title"
            />
            <span *ngIf="form.submitted && titleControl.errors?.['required']" class="text-red-500 text-xs">
              Title is required
            </span>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              [(ngModel)]="formData.description"
              name="description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Enter task description (optional)"
            ></textarea>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              [(ngModel)]="formData.status"
              name="status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Category <span class="text-red-500">*</span>
            </label>
            <select
              [(ngModel)]="formData.categoryId"
              name="categoryId"
              #categoryControl="ngModel"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option [ngValue]="null">Select a category</option>
              <option *ngFor="let cat of categories()" [ngValue]="cat.id">
                {{ cat.name }}
              </option>
            </select>
            <span *ngIf="form.submitted && categoryControl.errors?.['required']" class="text-red-500 text-xs">
              Category is required
            </span>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              (click)="onCancel()"
              class="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="submitting"
              class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-medium transition"
            >
              {{ submitting ? 'Saving...' : (isEditMode ? 'Update Task' : 'Create Task') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class TaskFormComponent {
  @Input() set task(value: Task | null | undefined) {
    if (value) {
      this.isEditMode = true;
      this.taskId = value.id;
      this.formData = {
        title: value.title,
        description: value.description,
        status: value.status,
        categoryId: value.categoryId
      };
    }
  }

  @Input() categories = signal<Category[]>([]);
  @Input() submitting = false;
  @Output() saved = new EventEmitter<{ data: CreateTaskDTO | UpdateTaskDTO; isEdit: boolean }>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild('form') form!: NgForm;

  isEditMode = false;
  taskId: number | null = null;

  formData: {
    title: string;
    description?: string;
    status: TaskStatus;
    categoryId: number | null;
  } = {
    title: '',
    description: '',
    status: 'pending',
    categoryId: null
  };

  onSubmit(): void {
    if (!this.form.valid || !this.formData.title || !this.formData.categoryId) {
      return;
    }

    const payload: CreateTaskDTO | UpdateTaskDTO = {
      title: this.formData.title.trim(),
      description: this.formData.description?.trim() || undefined,
      status: this.formData.status,
      categoryId: Number(this.formData.categoryId),
    };

    this.saved.emit({
      data: payload,
      isEdit: this.isEditMode
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}

