import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init(); // Initialize storage on service creation
  }

  // Create storage instance
  async init() {
    this._storage = await this.storage.create();
  }

  // Save a value by key
  async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  // Retrieve a value by key
  async get<T>(key: string): Promise<T | null> {
    return await this._storage?.get(key);
  }

  // Remove a value by key
  async remove(key: string): Promise<void> {
    await this._storage?.remove(key);
  }

  // Clear all storage
  async clear(): Promise<void> {
    await this._storage?.clear();
  }
}
