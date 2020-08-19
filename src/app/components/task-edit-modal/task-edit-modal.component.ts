import { Component, OnInit, ViewChild } from '@angular/core';
import { Config, ModalController, NavParams, IonInput } from '@ionic/angular';

import { Task } from 'src/app/core/entity';
import { TaskActions, TaskAction } from '../task/task.component';

@Component({
  selector: 'app-task-edit-modal',
  templateUrl: './task-edit-modal.component.html',
  styleUrls: ['./task-edit-modal.component.scss'],
})
export class TaskEditModalComponent implements OnInit {
  @ViewChild('input', { static: false }) input: IonInput;

  task: Task;
  ios: boolean;
  toCreate: boolean;
  editable: boolean;
  constructor(private modalCtrl: ModalController, private config: Config, private navParams: NavParams) {}

  ngOnInit() {
    this.task = new Task('', 0);
  }

  ionViewWillEnter() {
    this.ios = this.config.get('mode') === `ios`;
    this.editable = this.navParams.get('editable');
    this.task.order = this.navParams.get('len') || 0;

    if (this.navParams.get('task')) {
      this.task = this.navParams.get('task');
      this.toCreate = false;
    } else {
      this.toCreate = true;
    }
  }

  ionViewDidEnter() {
    setTimeout(() => this.input.setFocus(), 300);
  }

  save() {
    if (!this.task.title) {
      this.dismiss();
      return;
    }

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
