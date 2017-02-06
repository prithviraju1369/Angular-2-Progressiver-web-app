import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { ClearRoutingModule } from './clear.routing';
import { SharedModule } from './../shared/shared.module';
import { ClearComponent }   from './clear.component';
import {UsersService} from './../services/users.service';
import { MaterialModule } from '@angular/material';


@NgModule({
  imports: [
    ClearRoutingModule,SharedModule,CommonModule,MaterialModule
  ],
  exports: [],
  declarations: [ClearComponent],
  providers: [UsersService],
})
export class ClearModule { }
