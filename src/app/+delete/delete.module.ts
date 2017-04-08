import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { DeleteRoutingModule } from './delete.routing';
import { DeleteComponent } from './delete.component';

// delete module bootstrap
@NgModule({
  imports: [
    DeleteRoutingModule,CommonModule,MaterialModule
  ],
  exports: [],
  declarations: [DeleteComponent]
})
export class DeleteModule { }
