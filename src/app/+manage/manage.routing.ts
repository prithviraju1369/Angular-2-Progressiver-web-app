import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageComponent } from './manage/manage.component';
import { AddCategoryComponent } from './manage/addcategory/addcategory.component';
import { EditCategoryComponent } from './manage/editcategory/editcategory.component';
import { AddArticleComponent } from './manage/addarticle/addarticle.component';
import { EditArticleComponent } from './manage/editarticle/editarticle.component';
import { DeleteCategoryComponent } from './manage/deletecategory/deletecategory.component';
// import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  { path: '', component: ManageComponent },
  // { path: 'manage', component: ManageComponent },
  { path: 'addcategory', component: AddCategoryComponent },
  { path: 'editcategory', component: EditCategoryComponent },
  { path: 'addarticle', component: AddArticleComponent },
  { path: 'editarticle', component: EditArticleComponent },
  { path: 'deletecategory/:id', component: DeleteCategoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageRoutingModule { }
