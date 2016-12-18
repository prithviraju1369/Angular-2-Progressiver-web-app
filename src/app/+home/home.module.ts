import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { HomeRoutingModule } from './home.routing';
import { SharedModule } from './../shared/shared.module';
import { HomeComponent }   from './home.component';
import {UsersService} from './../services/users.service';

@NgModule({
  imports: [
    HomeRoutingModule,SharedModule,
    CommonModule
  ],
  exports: [],
  declarations: [HomeComponent],
  providers: [UsersService],
})
export class HomeModule { }
