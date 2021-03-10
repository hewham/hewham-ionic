import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemPage } from './item.page';
import { JsIframePage } from '../js-iframe/js-iframe.page';

const routes: Routes = [
  {
    path: '',
    component: ItemPage
  },
  {
    path: 'code',
    component: JsIframePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemPageRoutingModule {}
