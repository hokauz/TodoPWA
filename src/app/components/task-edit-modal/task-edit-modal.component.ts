import { Component, OnInit } from '@angular/core';
import { Config, ModalController, NavParams } from '@ionic/angular';

import { Task } from 'src/app/core/entity';
import { TaskActions, TaskAction } from '../task/task.component';

@Component({
  selector: 'app-task-edit-modal',
  templateUrl: './task-edit-modal.component.html',
  styleUrls: ['./task-edit-modal.component.scss'],
})
export class TaskEditModalComponent implements OnInit {
  task: Task;
  ios: boolean;
  toCreate: boolean;

  constructor(private modalCtrl: ModalController, private config: Config, private navParams: NavParams) {}

  ngOnInit() {
    this.task = new Task('', 0);
  }

  ionViewWillEnter() {
    this.ios = this.config.get('mode') === `ios`;
    this.task.order = this.navParams.get('len') || 0;

    if (this.navParams.get('task')) {
      this.task = this.navParams.get('task');
      this.toCreate = false;
    } else {
      this.toCreate = true;
    }
  }

  save() {
    const act = this.toCreate ? TaskActions.CREATE : TaskActions.UPDATE;
    this.dismiss(new TaskAction(act, this.task));
  }

  delete() {
    this.dismiss(new TaskAction(TaskActions.DELETE, this.task));
  }

  dismiss(data?: any) {
    this.modalCtrl.dismiss(data);
  }
}
