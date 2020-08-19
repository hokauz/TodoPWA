import { Component, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NetworkService } from './services/network/network.service';
import { PwaService } from './services/pwa/pwa.service';
import { TaskService } from './core/task/task.service';
import { UtilsService } from './services/utils/utils.service';

import { SubSink } from 'subsink';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
  dark = false;

  private subs$ = new SubSink();

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,

    private service: TaskService,
    private networkServ: NetworkService,
    private pwaServ: PwaService,
    private utilsServ: UtilsService
  ) {
    this.initializeApp();
  }

  ngOnDestroy() {
    this.subs$.unsubscribe();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // Routines
      this.checkForUpdaes();
      this.networkServ.listener();
      this.service.load();
    });
  }

  private checkForUpdaes() {
    this.subs$.add(
      this.pwaServ.monitoringUpdates().subscribe((hasUpdate) => {
        if (hasUpdate) {
          this.askUserToUpdate();
        }
      })
    );
  }

  askUserToUpdate() {
    const btns = [
      {
        side: 'end',
        text: 'Ok',
        handler: () => {
          this.pwaServ.tryUpdate();
        },
      },
    ];

    this.utilsServ.presentToast('Nova atualização. Deseja atualizar agora?', btns, 4000);
  }
}
