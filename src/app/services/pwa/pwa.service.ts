import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private deferred = new BehaviorSubject<any>(undefined);
  constructor(private swUpdate: SwUpdate) {
    swUpdate.available.subscribe((event) => {
      // if (askUserToUpdate()) {
      //   window.location.reload();
      // }
    });
    this.prepareToInstall();
  }

  check(): Observable<boolean> {
    return this.deferred.asObservable().pipe(map((value) => !!value));
  }

  private prepareToInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // console.log('prepared', e);
      e.preventDefault();
      this.deferred.next(e);
    });
  }

  tryInstall() {
    const deferredPrompt = this.deferred.value;
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }

      this.deferred.next(null);
    });
  }
}
