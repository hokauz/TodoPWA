import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Task, toAPI } from '../entity';
import { TaskRepositoryApi } from './task.repository.api';
import { TaskRepositoryLocal } from './task.repository.local';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private list = new BehaviorSubject<Task[]>([]);

  constructor(
    private repoAPI: TaskRepositoryApi,
    private repoLocal: TaskRepositoryLocal,
    private geoServ: GeolocationService,
    private storageServ: StorageService
  ) {}

  async load() {
    const data = await this.repoLocal.get();
    this.list.next(data);
  }

  get(): Observable<Task[]> {
    return this.list.asObservable();
  }

  async isFirst(): Promise<{ isFirst: boolean }> {
    return this.storageServ
      .get('isFirst')
      .then((res) => ({ isFirst: !!res }))
      .catch((_) => ({ isFirst: false }));
  }

  async prepareCreate(task: Task): Promise<{ isFirst: boolean }> {
    const data = await this.repoLocal.post(task);
    this.list.next(data.list);
    this.create(data.task);

    return await this.isFirst();
  }

  private async create(task: Task) {
    let t = { ...task };
    t.location = await this.geoServ.getCity();

    await this.repoAPI.post(toAPI(t)).then(async (res) => {
      if (res) {
        t.url = res.url;
        const data = await this.repoLocal.put(t);
        this.list.next(data);
      }
    });
  }

  async update(task: Task) {
    const data = await this.repoLocal.put(task);
    this.list.next(data);

    if (task.url) {
      await this.repoAPI.put(toAPI(task));
    }
  }

  async delete(task: Task) {
    const data = await this.repoLocal.delete(task.id);
    this.list.next(data);

    if (task.url) {
      await this.repoAPI.delete(task.url);
    }
  }

  clearCompleted() {
    const list = this.list.value;
    const not = list.filter((l) => !l.completed);
    const completed = list.filter((l) => l.completed);

    this.repoLocal.set(completed);
    this.list.next(not);

    not.forEach(async (task) => {
      if (task.url) {
        await this.repoAPI.delete(task.url);
      }
    });
  }
}
