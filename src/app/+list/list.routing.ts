import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { AddCategoryComponent } from './manage/addcategory/addcategory.component';
import { EditCategoryComponent } from './manage/editcategory/editcategory.component';
import { AddArticleComponent } from './manage/addarticle/addarticle.component';
import { EditArticleComponent } from './manage/editarticle/editarticle.component';
// import { DeleteCategoryComponent } from './manage/deletecategory/deletecategory.component';
// import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  // { path: 'manage', component: ManageComponent },
  { path: 'addcategory', component: AddCategoryComponent },
  { path: 'editcategory/:catId', component: EditCategoryComponent },
  { path: 'addarticle', component: AddArticleComponent },
  { path: 'editarticle/:artId', component: EditArticleComponent }
  // { path: 'deletecategory/id', component: DeleteCategoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListRoutingModule { }
