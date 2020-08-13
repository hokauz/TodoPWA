import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { TaskRepositoryContract } from './task.contracts';
import { Task } from '../entity';

/**
 * Apenas para fim de Separation of concerns,
 * foi separado a forma de conexão ao repositório,
 * no caso, uma api externa, das regras de negócio.
 */
@Injectable({
  providedIn: 'root',
})
export class TaskRepository implements TaskRepositoryContract {
  private path = 'https://todo-backend-golang.herokuapp.com/todos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Task[]> {
    return this.http.get<any>(this.path);
  }

  get(url: string): Observable<Task> {
    return this.http.get<any>(url);
  }

  post(task: Task): Observable<Task> {
    return this.http.post<any>(task.url, task);
  }

  put(task: Task): Observable<Task> {
    return this.http.put<any>(task.url, task);
  }

  delete(url: string): Observable<undefined> {
    return this.http.delete<any>(url);
  }
}
