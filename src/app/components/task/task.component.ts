import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Task } from 'src/app/core/entity';

export enum TaskActions {
  VIEW = 'view',
  UPDATE = 'update',
  DELETE = 'delete',
  CREATE = 'create',
}

export class TaskAction {
  constructor(public type: TaskActions, public task: Task) {}
}

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Input('task') task: Task;
  @Output('action') action = new EventEmitter<TaskAction>();
  @Output('view') view = new EventEmitter<TaskAction>();

  constructor() {}

  ngOnInit() {}

  send() {
    this.action.emit();
  }

  update() {
    this.task.completed = !this.task.completed;
    this.action.emit(new TaskAction(TaskActions.UPDATE, this.task));
  }

  delete() {
    this.action.emit(new TaskAction(TaskActions.DELETE, this.task));
  }

  open() {
    this.view.emit(new TaskAction(TaskActions.VIEW, this.task));
  }
}
