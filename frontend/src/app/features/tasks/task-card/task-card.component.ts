import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <!-- Title and Category -->
      <div class="flex items-start justify-between gap-4 mb-3">
        <h3 class="text-lg font-bold text-gray-900 flex-1">{{ task.title }}</h3>
        <span class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
          [ngClass]="getCategoryColor()">
          {{ getCategoryName() }}
        </span>
      </div>

      <!-- Description -->
      <p *ngIf="task.description" class="text-gray-600 text-sm mb-4">{{ task.description }}</p>

      <!-- Status Badge -->
      <div class="flex items-center gap-3 mb-4">
        <span class="text-xs font-medium text-gray-500 uppercase">Status:</span>
        <select
          [value]="task.status"
          (change)="onStatusChange($event)"
          [ngClass]="getStatusColor(task.status)"
          class="px-3 py-1 rounded-full text-xs font-semibold cursor-pointer border-0"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 justify-end">
        <button
          (click)="onEdit()"
          class="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
        >
          Edit
        </button>
        <button
          (click)="onDelete()"
          class="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          Delete
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() deleted = new EventEmitter<number>();
  @Output() statusChanged = new EventEmitter<{ id: number; status: TaskStatus }>();
  @Output() edit = new EventEmitter<Task>();

  getStatusColor(status: TaskStatus): string {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      in_progress: 'bg-blue-100 text-blue-700',
      done: 'bg-green-100 text-green-700'
    };
    return colors[status];
  }

  getCategoryColor(): string {
    const colors = [
      'bg-indigo-100 text-indigo-700',
      'bg-violet-100 text-violet-700',
      'bg-pink-100 text-pink-700',
      'bg-orange-100 text-orange-700'
    ];
    return colors[this.task.categoryId % colors.length];
  }

  getCategoryName(): string {
    return (this.task as { category?: { name?: string } }).category?.name ?? `Category #${this.task.categoryId}`;
  }

  onStatusChange(event: Event): void {
    const status = (event.target as HTMLSelectElement).value as TaskStatus;
    this.statusChanged.emit({ id: this.task.id, status });
  }

  onEdit(): void {
    this.edit.emit(this.task);
  }

  onDelete(): void {
    if (confirm(`Are you sure you want to delete "${this.task.title}"?`)) {
      this.deleted.emit(this.task.id);
    }
  }
}
