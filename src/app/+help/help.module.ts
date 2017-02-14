import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpRoutingModule } from './help.routing';
import { SharedModule } from './../shared/shared.module';
import { HelpComponent } from './help.component';
import { UsersService } from './../services/users.service';

// help module bootstrap
@NgModule({
  imports: [
    HelpRoutingModule,SharedModule,CommonModule
  ],
  exports: [],
  declarations: [HelpComponent],
  providers: [UsersService],
})
export class HelpModule { }
