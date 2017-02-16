import { NgModule } from '@angular/core';
import { Routes, RouterModule,PreloadAllModules  } from '@angular/router';

// all route and high level routes with lazy loading
// + denotes lazy loading for those modules
const routes: Routes = [
 { path: '', redirectTo: '/index', pathMatch: 'full' },
 { path: 'home', loadChildren: './+home/home.module#HomeModule' },
 { path: 'create', loadChildren: './+create/create.module#CreateModule' },
  { path: 'help', loadChildren: './+help/help.module#HelpModule' },
  { path: 'list/:id', loadChildren: './+list/list.module#ListModule' },
  { path: 'manage', loadChildren: './+manage/manage.module#ManageModule' },
  { path: 'lists', loadChildren: './+lists/lists.module#ListsModule' },
  { path: 'editlist', loadChildren: './+edit/edit.module#EditModule' },
  { path: 'clearlist', loadChildren: './+clear/clear.module#ClearModule' },
  { path: 'deletelist', loadChildren: './+delete/delete.module#DeleteModule' },
  { path: 'finishlist', loadChildren: './+finish/finish.module#FinishModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
