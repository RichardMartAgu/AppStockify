import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  async get<T>(key: string): Promise<T | null> {
    return await this._storage?.get(key);
  }

  async remove(key: string): Promise<void> {
    await this._storage?.remove(key);
  }

  async clear(): Promise<void> {
    await this._storage?.clear();
  }
}
