import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateTaskDTO) {
    return this.http.post<Task>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateTaskDTO) {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, dto);
  }

  remove(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
