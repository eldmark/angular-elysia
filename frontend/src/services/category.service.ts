import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category,  } from '../app/core/models/task.model';
import { CreateCategoryDTO } from '../app/core/models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private api = 'http://localhost:3000/categories';

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.api);
  }

  create(data: CreateCategoryDTO): Observable<Category> {
    return this.http.post<Category>(this.api, data);
  }
}
