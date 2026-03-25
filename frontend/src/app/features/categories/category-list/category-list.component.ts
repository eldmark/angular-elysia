import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div *ngIf="!loading && categories.length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg">No categories yet. Create one to organize your tasks!</p>
    </div>

    <div
      *ngIf="!loading && categories.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        *ngFor="let category of categories"
        class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
        [ngClass]="getCategoryColorClass(category.id)"
      >
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ category.name }}</h3>
        <p class="text-gray-600 text-sm">
          Created on {{ formatDate(category.createdAt) }}
        </p>
      </div>
    </div>
  `,
})
export class CategoryListComponent {
  @Input() categories: Category[] = [];
  @Input() loading = false;

  getCategoryColorClass(id: number): string {
    const colors = [
      'bg-indigo-50',
      'bg-violet-50',
      'bg-pink-50',
      'bg-orange-50',
      'bg-green-50',
      'bg-blue-50',
    ];

    return colors[id % colors.length];
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
