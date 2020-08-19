import { Component, OnInit } from '@angular/core';
import { ModalController, IonRouterOutlet } from '@ionic/angular';

import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Task } from 'src/app/core/entity';

import { TaskService } from 'src/app/core/task/task.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

import { TaskAction, TaskActions } from 'src/app/components/task/task.component';
import { TaskEditModalComponent } from 'src/app/components/task-edit-modal/task-edit-modal.component';
import { PwaService } from 'src/app/services/pwa/pwa.service';
import { PushService } from 'src/app/services/push/push.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isFirst: boolean;

  size$: BehaviorSubject<number>;
  tasks$: Observable<Task[]>;
  isPrepared$: Observable<boolean>;

  constructor(
    private service: TaskService,
    private utils: UtilsService,
    private modalCtrl: ModalController,
    public routerOutlet: IonRouterOutlet,
    private pwaServ: PwaService,
    private pushServ: PushService
  ) {}

  ngOnInit() {
    this.size$ = new BehaviorSubject(0);
    this.isPrepared$ = this.pwaServ.isInstalable();

    this.pushServ.requestPermission();
    this.checkFirst();
    this.read();
  }

  async checkFirst() {
    const { isFirst } = await this.service.isFirst();
    console.log(isFirst);
    this.isFirst = isFirst;
  }

  private read() {
    this.tasks$ = this.service.get().pipe(
      map((list) => list.filter((l) => !l.completed)),
      tap((list) => this.size$.next(list.length))
    );
  }

  add(len: number) {
    this.showModal(undefined, len);
  }

  view(action: TaskAction, len: number) {
    this.showModal(action.task, len);
  }

  private async create(task: Task) {
    const { isFirst } = await this.service.create(task);

    if (isFirst) {
      this.pwaServ.tryInstall();
      this.pushServ.requestPermission();
      return;
    }

    this.isFirst = false;
  }

  private update(task: Task) {
    this.service.update(task);
    const msg = task.completed ? 'Tarefa atualizada.' : 'Tarefa completada.';
    this.utils.presentToast(msg);
  }

  private delete(task: Task) {
    this.service.delete(task);
    this.utils.presentToast('Tarefa removida.');
  }

  handlerAction(action: TaskAction) {
    if (action.type === TaskActions.CREATE) {
      return this.create(action.task);
    }

    if (action.type === TaskActions.UPDATE) {
      return this.update(action.task);
    }

    if (action.type === TaskActions.DELETE) {
      return this.delete(action.task);
    }
  }

  private async showModal(task?: Task, len?: number) {
    const modal = await this.modalCtrl.create({
      component: TaskEditModalComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { task, len, editable: true },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) {
      this.handlerAction(data);
    }
  }
}
