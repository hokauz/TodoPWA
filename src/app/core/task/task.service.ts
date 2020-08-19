import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Task, toAPI } from '../entity';
import { TaskRepositoryApi } from './task.repository.api';
import { TaskRepositoryLocal } from './task.repository.local';

import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { TaskRoutineService } from './task.routine.sync';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private list = new BehaviorSubject<Task[]>([]);

  constructor(
    private repoAPI: TaskRepositoryApi,
    private repoLocal: TaskRepositoryLocal,
    private geoServ: GeolocationService,
    private routineServ: TaskRoutineService
  ) {
    this.routineServ.listener();
  }

  async load() {
    const data = await this.repoLocal.get();
    this.updateList(data);
  }

  get(): Observable<Task[]> {
    return this.list.asObservable();
  }

  private async isFirst(): Promise<{ isFirst: boolean }> {
    const check = localStorage.getItem('isFirst');
    const isFirst = (check !== null && check !== undefined && check !== 'false') || check === 'true';
    return { isFirst };
  }

  private updateFirstState(task: Task) {
    localStorage.setItem('isFirst', 'false');
    return task;
  }

  private updateList(list?: Task[], task?: Task) {
    if (list) {
      this.list.next(this.prepareList(list));
    }

    return task;
  }

  private prepareList(list: Task[]) {
    return list.filter((t) => !t._deleted).sort((a, b) => a.order - b.order);
  }

  private async prepareToCreateAPI(task: Task) {
    return this.repoAPI.post(toAPI(task)).then((res): Task => ({ ...task, ...res, _synced: true }));
  }

  private async prepareUpdateAPI(task: Task) {
    return task.url
      ? this.repoAPI
          .put(toAPI(task))
          .then((res): Task => ({ ...task, ...res, _synced: true }))
          .catch((): Task => ({ ...task, _synced: false }))
      : task;
  }

  private async prepareToDeleteAPI(task: Task) {
    return task.url
      ? this.repoAPI
          .delete(task.url)
          .then(() => ({ ...task, synced: true }))
          .catch(() => ({ ...task, synced: false }))
      : task;
  }

  private prepareToDeleteLocal(task: Task) {
    return task._deleted && task._synced
      ? this.repoLocal.delete(task.id).then((data) => this.updateList(data.list, data.task))
      : task;
  }

  async create(task: Task) {
    this.repoLocal
      .post(task)
      .then((data) => this.updateList(data.list, data.task))
      .then((t) => this.updateFirstState(t))
      .then((t) => this.geoServ.getCity().then((name) => ({ ...t, location: name })))
      .then((t) => this.repoLocal.put(t))
      .then((data) => this.updateList(data.list, data.task))
      .then((t) => this.prepareToCreateAPI(t))
      .then((res) => this.repoLocal.put(res))
      .then((data) => this.updateList(data.list, data.task));

    return this.isFirst();
  }

  async update(task: Task) {
    const taskPreUpdate: Task = { ...task, _synced: false, text: new Date().toISOString() };

    return this.repoLocal
      .put(taskPreUpdate)
      .then((data) => this.updateList(data.list, data.task))
      .then((t) => this.prepareUpdateAPI(t))
      .then((t) => this.repoLocal.put(t))
      .then((data) => this.updateList(data.list, data.task));
  }

  async delete(task: Task) {
    const taskPreDelete: Task = { ...task, _synced: false, _deleted: true, text: new Date().toISOString() };

    return this.repoLocal
      .put(taskPreDelete)
      .then((data) => this.updateList(data.list, data.task))
      .then((t) => this.prepareToDeleteAPI(t))
      .then((t) => this.prepareToDeleteLocal(t));
  }

  async clearCompleted() {
    const list = this.list.value.map((task) => {
      if (task.completed) {
        task._synced = false;
        task._deleted = true;
      }
      return task;
    });

    this.updateList(list);
    await this.repoLocal.setList(list);
    this.routineServ.run();
  }
}
