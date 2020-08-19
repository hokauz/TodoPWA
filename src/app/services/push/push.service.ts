import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  constructor(private swUpdate: SwUpdate) {}

  requestPermission() {
    Notification.requestPermission();
  }

  send(title: string, msg: string) {
    if (this.swUpdate.isEnabled) {
      const options: NotificationOptions = { body: msg, icon: 'assets/icons/icon-72x72.png' };
      const icon = window.location.origin + '/assets/icons/icon-72x72.png';

      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    }
  }
}
