import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {}

  async set(key: string, value: any): Promise<void> {
    return await this.storage.set(key, JSON.stringify(value));
  }

  async get<T>(key: string): Promise<T> {
    const item = await this.storage.get(key);
    return JSON.parse(item) || [];
  }

  async remove(key: string): Promise<void> {
    return await this.storage.remove(key);
  }
}
