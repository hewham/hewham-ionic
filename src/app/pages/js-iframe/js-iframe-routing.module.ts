import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JsIframePage } from './js-iframe.page';

const routes: Routes = [
  {
    path: '',
    component: JsIframePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JsIframePageRoutingModule {}
