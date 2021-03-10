import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'portfolio',
    pathMatch: 'full'
  },
  {
    path: 'portfolio',
    loadChildren: () => import('./pages/portfolio/portfolio.module').then( m => m.PortfolioPageModule)
  },
  {
    path: 'project/:id',
    loadChildren: () => import('./pages/project/project.module').then( m => m.ProjectPageModule)
  },
  {
    path: 'js',
    loadChildren: () => import('./pages/js/js.module').then( m => m.JsPageModule)
  },
  {
    path: 'js/:id',
    loadChildren: () => import('./pages/js-iframe/js-iframe.module').then( m => m.JsIframePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
