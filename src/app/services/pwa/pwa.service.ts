import { Injectable, ApplicationRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private deferred = new BehaviorSubject<any>(undefined);

  constructor(private updates: SwUpdate, private appRef: ApplicationRef) {
    this.prepareToInstall();
  }

  isInstalable(): Observable<boolean> {
    return this.deferred.asObservable().pipe(map((value) => !!value));
  }

  private prepareToInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
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
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }

      this.deferred.next(null);
    });
  }

  tryUpdate() {
    if (this.updates.isEnabled) {
      this.updates.activateUpdate().then(() => document.location.reload());
    }
  }

  monitoringUpdates() {
    this.updates.activated.subscribe((event) => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });

    return this.updates.available.pipe(
      map((event) => {
        console.log('current version is', event.current);
        console.log('available version is', event.available);

        return event.current !== event.available;
      })
    );
  }

  // checkForUpdates() {
  //   if (this.updates.isEnabled) {
  //     const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable === true));
  //     const everySixHours$ = interval(6 * 60 * 60 * 1000);
  //     const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
  //     everySixHoursOnceAppIsStable$.subscribe(() => this.updates.checkForUpdate());
  //   }
  // }
}
