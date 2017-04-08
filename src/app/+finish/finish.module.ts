import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { FinishRoutingModule } from './finish.routing';
import { SharedModule } from './../shared/shared.module';
import { FinishComponent }   from './finish.component';

// finish module bootstrap
@NgModule({
  imports: [
    FinishRoutingModule,SharedModule,CommonModule,MaterialModule,FormsModule
  ],
  exports: [],
  declarations: [FinishComponent],
})
export class FinishModule { }
