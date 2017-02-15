import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { ListsRoutingModule } from './lists.routing';
import { SharedModule } from './../shared/shared.module';
import { ListsComponent } from './lists.component';
import { ListsService } from './lists.service';

// show user shopping lists module
@NgModule({
  imports: [
    ListsRoutingModule,SharedModule,CommonModule,FormsModule,MaterialModule
  ],
  exports: [],
  declarations: [ListsComponent],
  providers: [ListsService],
})
export class ListsModule { }
