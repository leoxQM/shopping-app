import { Injectable } from '@angular/core';
import { type } from 'node:os';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  isBrowser = typeof window !== 'undefined';

  get<T>(key: string):T | null {
    if(!this.isBrowser) return null;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
  }

  set<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(key);
  }

  clear(): void {
    if (!this.isBrowser) return;
    localStorage.clear();
  }
}
