import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
export class TaskRepositoryApi implements TaskRepositoryContract {
  private path = 'https://todo-backend-golang.herokuapp.com/todos';

  constructor(private http: HttpClient) {}

  get(): Promise<Task[]> {
    return this.http.get<any>(this.path).toPromise();
  }

  post(task: Task): Promise<Task> {
    return this.http.post<any>(this.path, task).toPromise();
  }

  put(task: Task): Promise<Task> {
    return this.http.put<any>(task.url, task).toPromise();
  }

  delete(target: string): Promise<undefined> {
    return this.http.delete<any>(target).toPromise();
  }
}
