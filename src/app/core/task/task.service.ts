import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Task, toAPI } from '../entity';
import { TaskRepositoryApi } from './task.repository.api';
import { TaskRepositoryLocal } from './task.repository.local';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private list = new BehaviorSubject<Task[]>([]);
  constructor(private repoAPI: TaskRepositoryApi, private repoLocal: TaskRepositoryLocal) {}

  async load() {
    const data = await this.repoLocal.get();
    this.list.next(data);
  }

  get(): Observable<Task[]> {
    return this.list.asObservable();
  }

  async create(task: Task) {
    const data = await this.repoLocal.post(task);
    this.list.next(data);
    this.repoAPI.post(toAPI(task)).then(async (res) => {
      if (res) {
        task.url = res.url;
        const data = await this.repoLocal.put(task);
        this.list.next(data);
      }
    });
  }

  async update(task: Task) {
    const data = await this.repoLocal.put(task);
    this.list.next(data);
    if (task.url) {
      this.repoAPI.put(toAPI(task));
    }
  }

  async delete(task: Task) {
    const data = await this.repoLocal.delete(task.id);
    this.list.next(data);

    if (task.url) {
      this.repoAPI.delete(task.url);
    }
  }
}
