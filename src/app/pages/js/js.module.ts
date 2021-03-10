import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../components/components.module';

import { JsPageRoutingModule } from './js-routing.module';

import { JsPage } from './js.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    JsPageRoutingModule
  ],
  declarations: [JsPage]
})
export class JsPageModule {}
