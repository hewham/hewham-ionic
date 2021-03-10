import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../components/components.module';

import { JsIframePageRoutingModule } from './js-iframe-routing.module';

import { JsIframePage } from './js-iframe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    JsIframePageRoutingModule
  ],
  declarations: [JsIframePage]
})
export class JsIframePageModule {}
