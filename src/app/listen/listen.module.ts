import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListenPageRoutingModule } from './listen-routing.module';

import { ListenPage } from './listen.page';
import { CommonpopoverComponent } from '../component/commonpopover/commonpopover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListenPageRoutingModule
  ],
  declarations: [ListenPage]
})
export class ListenPageModule {}
