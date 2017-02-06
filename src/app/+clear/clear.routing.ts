import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClearComponent } from './clear.component';

const routes: Routes = [
  { path: '', component: ClearComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClearRoutingModule { }