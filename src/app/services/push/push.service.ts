import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  constructor(private swUpdate: SwUpdate) {}

  requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return;
    }

    if (Notification.permission !== 'denied') {
      Notification.requestPermission()
        .then((permission) => {
          console.log('[Request permission]', permission);
          return permission;
        })
        .catch((e) => console.log('[Request permission]', e));
    }
  }

  send(title: string, msg: string) {
    if (this.swUpdate.isEnabled) {
      const options: NotificationOptions = { body: msg, icon: 'assets/icons/icon-72x72.png' };

      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    }
  }
}
