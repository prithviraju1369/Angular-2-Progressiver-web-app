import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
 { path: '', redirectTo: '/index', pathMatch: 'full' },
 { path: 'home', loadChildren: './+home/home.module#HomeModule' },
 { path: 'create', loadChildren: './+create/create.module#CreateModule' },
  { path: 'help', loadChildren: './+help/help.module#HelpModule' },
  { path: 'list/:id', loadChildren: './+list/list.module#ListModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
