import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { CategoryListComponent } from '../category-list/category-list.component';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryListComponent],
  template: `
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Categories</h1>
          <p class="text-gray-600">Organize your tasks with categories</p>
        </div>

        <!-- Create Form -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Create New Category</h2>
          <form (ngSubmit)="createCategory()" #form="ngForm" class="flex gap-3">
            <input
              type="text"
              [(ngModel)]="newCategoryName"
              name="categoryName"
              required
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter category name (e.g., Work, Personal)"
            />
            <button
              type="submit"
              [disabled]="isLoading()"
              class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-medium transition whitespace-nowrap"
            >
              {{ isLoading() ? 'Creating...' : 'Create' }}
            </button>
          </form>
          <span *ngIf="form.submitted && !newCategoryName" class="text-red-500 text-xs block mt-2">
            Category name is required
          </span>
        </div>

        <app-category-list
          [categories]="categories()"
          [loading]="loadingCategories()"
        />
      </div>
    </div>
  `,
  styles: []
})
export class CategoryFormComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  newCategoryName = '';
  isLoading = signal(false);
  loadingCategories = signal(true);

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.loadingCategories.set(true);
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loadingCategories.set(false);
      },
      error: (error) => {
        console.error('Failed to load categories', error);
        this.loadingCategories.set(false);
      }
    });
  }

  createCategory(): void {
    if (!this.newCategoryName.trim()) {
      return;
    }

    const name = this.newCategoryName.trim();
    this.isLoading.set(true);
    this.categoryService.create({ name }).subscribe({
      next: (newCategory) => {
        // Optimistic UI update so the user sees the new category instantly.
        this.categories.update((cats) => [newCategory, ...cats]);
        this.newCategoryName = '';
        this.isLoading.set(false);
        // Sync with backend ordering/state after optimistic update.
        this.loadCategories();
      },
      error: (error) => {
        console.error('Failed to create category', error);
        alert('Failed to create category');
        this.isLoading.set(false);
      }
    });
  }

}
