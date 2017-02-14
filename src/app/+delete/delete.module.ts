import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { DeleteRoutingModule } from './delete.routing';
import { SharedModule } from './../shared/shared.module';
import { DeleteComponent } from './delete.component';
import { UsersService } from './../services/users.service';

// delete module bootstrap
@NgModule({
  imports: [
    DeleteRoutingModule,SharedModule,CommonModule,MaterialModule
  ],
  exports: [],
  declarations: [DeleteComponent],
  providers: [UsersService],
})
export class DeleteModule { }
