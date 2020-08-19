import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

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
  private path = environment.api_url;

  constructor(private http: HttpClient) {}

  get(): Promise<Task[]> {
    return this.http.get<any>(this.path).toPromise();
  }

  post(task: Task): Promise<Task> {
    return this.http.post<any>(this.path, task).toPromise();
  }

  put(task: Task): Promise<Task> {
    const path = task.url.substr(0, 5).match('') ? task.url.replace('http:', 'https:') : task.url;
    return this.http.patch<any>(path, task).toPromise();
  }

  delete(target: string): Promise<undefined> {
    const path = target.substr(0, 5).match('') ? target.replace('http:', 'https:') : target;
    return this.http.delete<any>(path).toPromise();
  }
}
