import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { MaterialModule } from '@angular/material';

import { ClearRoutingModule } from './clear.routing';
import { ClearComponent } from './clear.component';

// clear module bootstrao
@NgModule({
  imports: [
    ClearRoutingModule,CommonModule,MaterialModule
  ],
  exports: [],
  declarations: [ClearComponent]
})
export class ClearModule { }
