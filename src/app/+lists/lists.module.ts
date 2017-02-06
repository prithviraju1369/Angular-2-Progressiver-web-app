import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { ListsRoutingModule } from './lists.routing';
import { SharedModule } from './../shared/shared.module';
import { ListsComponent }   from './lists.component';
import {UsersService} from './../services/users.service';
import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [
    ListsRoutingModule,SharedModule,CommonModule,FormsModule,MaterialModule
  ],
  exports: [],
  declarations: [ListsComponent],
  providers: [UsersService],
})
export class ListsModule { }
