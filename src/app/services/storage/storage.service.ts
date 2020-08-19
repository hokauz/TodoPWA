import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {}

  async setList<T>(values: T[], prop: string): Promise<void> {
    values.forEach(async (v) => {
      await this.storage.set(v[prop], v);
    });

    return;
  }

  async set<T>(key: string, value: T) {
    this.storage.set(key, value);
  }

  async get<T>(key: string): Promise<T> {
    const item = await this.storage.get(key);
    return JSON.parse(item);
  }

  async getAll<T>(): Promise<T[]> {
    const t = await this.storage
      .keys()
      .then((l) => l.filter((key) => key.includes('task-')).map((key) => this.storage.get(key)));
    return Promise.all(t);
  }

  async update<T>(key: string, value: T): Promise<boolean> {
    return this.storage.set(key, value);
  }

  async remove(key: string): Promise<void> {
    return await this.storage.remove(key);
  }
}
