import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, CreateCategoryDTO } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Category[]>(this.apiUrl);
  }

  create(dto: CreateCategoryDTO) {
    return this.http.post<Category>(this.apiUrl, dto);
  }
}
