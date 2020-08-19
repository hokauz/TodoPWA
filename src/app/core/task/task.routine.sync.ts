import { Injectable } from '@angular/core';

import { Task } from '../entity';
import { TaskRepositoryLocal } from './task.repository.local';
import { TaskRepositoryApi } from './task.repository.api';

import { NetworkService } from 'src/app/services/network/network.service';

interface Queue {
  toCreate: QueueStatus;
  toUpdate: QueueStatus;
  toDelete: QueueStatus;
}

interface QueueStatus {
  trigger: Promise<void[]>;
}

@Injectable({
  providedIn: 'root',
})
export class TaskRoutineService {
  constructor(
    private repoLocal: TaskRepositoryLocal,
    private repoAPI: TaskRepositoryApi,
    private network: NetworkService
  ) {}

  listener() {
    this.network.isOnline().subscribe((state) => {
      if (state) {
        this.run();
      }
    });
  }

  async run() {
    let list = await this.repoLocal.get();

    const pre: Queue = {
      toCreate: this.prepareToCreate(list),
      toUpdate: this.prepareToUpdate(list),
      toDelete: this.prepareToDelete(list),
    };

    await this.proccessQueue(pre.toCreate, 'create');
    await this.proccessQueue(pre.toUpdate, 'update');
    await this.proccessQueue(pre.toDelete, 'delete');
    // await this.proccessQueue()
  }

  private prepareToCreate(list: Task[]): QueueStatus {
    const queue = list
      .filter((task) => !task.url && !task._synced)
      .map((task) =>
        this.repoAPI
          .post(task)
          .then((res) => {
            console.log('Task', task.id, res.url, 'created');
            this.repoLocal.put({ ...task, ...res, _synced: true });
            return;
          })
          .catch((e) => {
            console.log(`Task create error`, task.id, task.url, e);
          })
      );

    return { trigger: Promise.all(queue) };
  }

  private prepareToUpdate(list: Task[]): QueueStatus {
    const queue = list
      .filter((task) => !task._deleted && !!task.url && !task._synced && !!task.url)
      .map((task) =>
        this.repoAPI
          .put(task)
          .then(() => {
            this.repoLocal.put({ ...task, _synced: true });
            console.log('Task', task.id, task.url, 'updated');
            return;
          })
          .catch((e) => {
            console.log('Task update error', task.id, task.url, e);
          })
      );

    return { trigger: Promise.all(queue) };
  }

  private prepareToDelete(list: Task[]): QueueStatus {
    const queue = list
      .filter((task) => task._deleted && !!task.url)
      .map((task) =>
        this.repoAPI
          .delete(task.url)
          .then(() => {
            this.repoLocal.delete(task.id);
            console.log('Task', task.id, task.url, 'deleted');
            return;
          })
          .catch((e) => {
            console.log('Task delete error', task.id, task.url, e);
          })
      );

    return { trigger: Promise.all(queue) };
  }

  private async proccessQueue(status: QueueStatus, type: string) {
    status.trigger.then(() => `Sync ${type} completed`);
  }
}
