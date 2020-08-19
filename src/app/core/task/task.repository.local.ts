import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import { StorageService } from 'src/app/services/storage/storage.service';

import { Task } from '../entity';

export interface TaskLocalResponse {
  list: Task[];
  task: Task;
}

@Injectable({
  providedIn: 'root',
})
export class TaskRepositoryLocal {
  private list: Task[];

  constructor(private storage: StorageService) {}

  async set(task: Task) {
    this.list.push(task);
    await this.storage.set(task.id, task);
    return { list: this.list, task: task };
  }

  async setList(tasks: Task[]) {
    this.list = tasks;
    await this.storage.setList(tasks, 'id');
  }

  async get(): Promise<Task[]> {
    this.storage.getAll();
    this.list = (await this.storage.getAll<Task>()) || [];
    return this.list;
  }

  async post(task: Task): Promise<TaskLocalResponse> {
    const t = { ...task, id: uuidv4() };
    this.list.push(t);
    this.storage.set(t.id, t);
    return { list: this.list, task: t };
  }

  async put(task: Task): Promise<TaskLocalResponse> {
    const i = this.list.findIndex((t) => t.id === task.id);

    if (i !== null && i !== undefined) {
      this.list[i] = { ...this.list[i], ...task };
      this.storage.update(task.id, task);
    }
    return { list: this.list, task: task };
  }

  async delete(target: string): Promise<TaskLocalResponse> {
    this.list = this.list.filter((t) => t.id !== target);
    this.storage.remove(target);
    return { list: this.list, task: undefined };
  }
}
