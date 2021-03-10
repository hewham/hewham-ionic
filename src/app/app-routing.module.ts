import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    loadChildren: () => import('./pages/portfolio/portfolio.module').then( m => m.PortfolioPageModule)
  },
  {
    path: 'projects/:id',
    loadChildren: () => import('./pages/project/project.module').then( m => m.ProjectPageModule)
  },
  {
    path: 'js',
    loadChildren: () => import('./pages/js/js.module').then( m => m.JsPageModule)
  },
  {
    path: 'js/:id',
    loadChildren: () => import('./pages/js-iframe/js-iframe.module').then( m => m.JsIframePageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
