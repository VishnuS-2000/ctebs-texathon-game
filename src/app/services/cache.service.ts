import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  constructor() {}
  add(key: string, value: any): void {
    if (!this.get(key)) {
      this.set(key, value);
    }
  }

  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  
  delete(key: string): void {
    localStorage.removeItem(key);
  }

  
  put(key: string, value: any): void {
    const cache:any = localStorage.getItem(key)
    const item = cache ? JSON.parse(cache):null;
    if(item){
        let newItem = {...item,...value};
        this.set(key,newItem)
    }else{
        this.set(key,value);
    }
  }

  get(key: string): any | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  
  keys(): string[] {
    return Object.keys(localStorage);
  }

  clear(): void {
    localStorage.clear();
  }
}
