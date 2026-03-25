import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTaskDTO, Task, UpdateTaskDTO } from '../app/core/models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private api = 'http://localhost:3000/tasks';

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.api);
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.api}/${id}`);
  }

  create(data: CreateTaskDTO): Observable<Task> {
    return this.http.post<Task>(this.api, data);
  }

  update(id: number, data: UpdateTaskDTO): Observable<Task> {
    return this.http.put<Task>(`${this.api}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}