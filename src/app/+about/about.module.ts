import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { AboutRoutingModule } from './about.routing';
import { SharedModule } from './../shared/shared.module';
import { AboutComponent }   from './about.component';
import {UsersService} from './../services/users.service';


@NgModule({
  imports: [
    AboutRoutingModule,SharedModule,CommonModule
  ],
  exports: [],
  declarations: [AboutComponent],
  providers: [UsersService],
})
export class AboutModule { }
