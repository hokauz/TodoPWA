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
  private key = 'tasks';

  constructor(private storage: StorageService) {}

  set(tasks: Task[]) {
    this.list = tasks;
    this.save();
  }

  async get(): Promise<Task[]> {
    this.list = (await this.storage.get<Task[]>(this.key)) || [];
    return this.list;
  }

  async post(task: Task): Promise<TaskLocalResponse> {
    const t = { ...task, id: uuidv4() };
    this.list.push(t);
    this.save();
    return { list: this.list, task: t };
  }

  async put(task: Task): Promise<Task[]> {
    const i = this.list.findIndex((t) => t.id === task.id);

    if (i !== null && i !== undefined) {
      this.list[i] = { ...this.list[i], ...task };
      this.save();
    }
    return this.list;
  }

  async delete(target: string): Promise<Task[]> {
    this.list = this.list.filter((t) => t.id !== target);
    this.save();
    return this.list;
  }

  private save() {
    this.storage.set(this.key, this.list);
  }
}
