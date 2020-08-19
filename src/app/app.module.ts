import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component';

import { CompletedPage } from './pages/completed/completed.page';
import { TasksPage } from './pages/tasks/tasks.page';

import { TaskComponent } from './components/task/task.component';
import { TaskEditModalComponent } from './components/task-edit-modal/task-edit-modal.component';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, CompletedPage, TasksPage, TaskComponent, TaskEditModalComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot({
      name: '_todoPWA',
      storeName: 'tasks',
      driverOrder: ['indexeddb', 'websql'],
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [StatusBar, SplashScreen, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
