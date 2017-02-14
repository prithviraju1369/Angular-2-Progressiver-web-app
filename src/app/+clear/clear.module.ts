import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { MaterialModule } from '@angular/material';

import { ClearRoutingModule } from './clear.routing';
import { SharedModule } from './../shared/shared.module';
import { ClearComponent } from './clear.component';
import { UsersService } from './../services/users.service';

// clear module bootstrao
@NgModule({
  imports: [
    ClearRoutingModule,SharedModule,CommonModule,MaterialModule
  ],
  exports: [],
  declarations: [ClearComponent],
  providers: [UsersService],
})
export class ClearModule { }
