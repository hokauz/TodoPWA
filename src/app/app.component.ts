import { Component, OnInit } from '@angular/core';

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
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Tasks',
      url: '/tasks',
      icon: 'mail',
    },
    {
      title: 'Completadas',
      url: '/completed',
      icon: 'paper-plane',
    },
  ];

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
  private subs$ = new SubSink();

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

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex((page) => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  ngOnDestroy() {
    this.subs$.unsubscribe();
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
