import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';

import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, last, first } from 'rxjs/operators';

import { Task } from 'src/app/core/entity';
import { TaskAction, TaskActions } from 'src/app/components/task/task.component';

import { TaskService } from 'src/app/core/task/task.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { TaskEditModalComponent } from 'src/app/components/task-edit-modal/task-edit-modal.component';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.page.html',
  styleUrls: ['./completed.page.scss'],
})
export class CompletedPage implements OnInit {
  tasks$: Observable<Task[]>;
  loaded$: BehaviorSubject<boolean>;

  hasContent: boolean;
  constructor(
    private service: TaskService,
    private utils: UtilsService,
    private modalCtrl: ModalController,
    public routerOutlet: IonRouterOutlet
  ) {}

  ngOnInit() {
    this.loaded$ = new BehaviorSubject(false);
    this.read();
  }

  ngOnDestroy() {}

  private read() {
    this.tasks$ = this.service.get().pipe(
      tap(() => this.loaded$.next(false)),
      map((list) => list.filter((l) => l.completed)),
      tap((list) => (this.hasContent = !!list.length)),
      tap(() => this.loaded$.next(true))
    );
  }

  private delete(task: Task) {
    this.service.delete(task);
    this.utils.presentToast('Tarefa removida.');
  }

  view(action: TaskAction, len: number) {
    this.showModal(action.task, len);
  }

  clear() {
    this.service.clearCompleted();
    this.utils.presentToast('Lista de tarefas realizadas foi limpa');
  }

  handlerAction(action: TaskAction) {
    if (action.type === TaskActions.DELETE) {
      return this.delete(action.task);
    }
  }

  private async showModal(task?: Task, len?: number) {
    const modal = await this.modalCtrl.create({
      component: TaskEditModalComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { task, len, editable: false },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) {
      this.handlerAction(data);
    }
  }
}
