import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { HomeRoutingModule } from './home.routing';
import { SharedModule } from './../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { UsersService } from './../services/users.service';

// home module bootstrap
@NgModule({
  imports: [
    HomeRoutingModule,SharedModule,
    MaterialModule.forRoot(),
    CommonModule
  ],
  exports: [],
  declarations: [HomeComponent],
  providers: [UsersService],
})
export class HomeModule { }
