import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { HomeRoutingModule } from './home.routing';
import { SharedModule } from './../shared/shared.module';
import { HomeComponent } from './home/home.component';


// home module bootstrap
@NgModule({
  imports: [
    HomeRoutingModule,SharedModule,
    MaterialModule.forRoot(),
    CommonModule
  ],
  exports: [],
  declarations: [HomeComponent]
})
export class HomeModule { }
