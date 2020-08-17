import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, IonRouterOutlet } from '@ionic/angular';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Task } from 'src/app/core/entity';

import { TaskService } from 'src/app/core/task/task.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

import { TaskAction, TaskActions } from 'src/app/components/task/task.component';
import { TaskEditModalComponent } from 'src/app/components/task-edit-modal/task-edit-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  tasks$: Observable<Task[]>;

  constructor(
    private service: TaskService,
    private utils: UtilsService,
    private modalCtrl: ModalController,
    public routerOutlet: IonRouterOutlet
  ) {}

  ngOnInit() {
    this.read();
  }

  ngOnDestroy() {}

  private read() {
    this.tasks$ = this.service.get().pipe(map((list) => list.filter((l) => !l.completed)));
  }

  add(len: number) {
    this.showModal(undefined, len);
  }

  view(action: TaskAction, len: number) {
    this.showModal(action.task, len);
  }

  private create(task: Task) {
    this.service.create(task);
    this.utils.presentToast('Tarefa adicionada.');
  }

  private update(task: Task) {
    this.service.update(task);
    this.utils.presentToast('Tarefa atualizada.');
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
