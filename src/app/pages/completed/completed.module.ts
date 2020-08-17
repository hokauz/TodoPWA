import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompletedPageRoutingModule } from './completed-routing.module';

import { CompletedPage } from './completed.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CompletedPageRoutingModule, ComponentsModule],
  declarations: [CompletedPage],
})
export class CompletedPageModule {}
