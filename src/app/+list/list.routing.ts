import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';

// import { DeleteCategoryComponent } from './manage/deletecategory/deletecategory.component';
// import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  // { path: 'manage', component: ManageComponent },
  // { path: 'deletecategory/id', component: DeleteCategoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListRoutingModule { }
