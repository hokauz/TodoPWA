import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private online = new BehaviorSubject<boolean>(false);

  constructor() {
    this.check();
  }

  isOnline() {
    return this.online.asObservable().pipe(tap((res) => console.log('is online:', res)));
  }

  private check() {
    this.online.next(navigator.onLine);
  }

  listener() {
    window.addEventListener('offline', () => this.online.next(false));
    window.addEventListener('online', () => this.online.next(true));
  }
}
