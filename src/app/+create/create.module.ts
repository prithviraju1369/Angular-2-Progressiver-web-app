import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';

import { CreateRoutingModule } from './create.routing';
import { SharedModule } from './../shared/shared.module';
import { CreateComponent }   from './create/create.component';
import { UsersService } from './../services/users.service';
import { firebaseConfig } from './../config/firebase-config';

@NgModule({
  imports: [
    CreateRoutingModule,SharedModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    MaterialModule.forRoot(),
    CommonModule
  ],
  exports: [],
  declarations: [CreateComponent],
  providers: [UsersService],
})
export class CreateModule { }
