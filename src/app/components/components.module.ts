import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TaskComponent } from './task/task.component';
import { TaskEditModalComponent } from './task-edit-modal/task-edit-modal.component';

const comps = [TaskComponent, TaskEditModalComponent];
@NgModule({
  declarations: [...comps],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [comps],
})
export class ComponentsModule {}
