import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'totem',
    pathMatch: 'full'
  },
  {
    path: 'totem',
    loadChildren: () => import('./pages/totem/totem.module').then( m => m.TotemPageModule)
  },
  {
    path: 'painel',
    loadChildren: () => import('./pages/painel/painel.module').then( m => m.PainelPageModule)
  },
  {
    path: 'atendente',
    loadChildren: () => import('./pages/atendente/atendente.module').then( m => m.AtendentePageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: '**',
    redirectTo: 'totem'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
