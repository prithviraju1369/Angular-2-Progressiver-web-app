import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EditRoutingModule } from './edit.routing';
import { SharedModule } from './../shared/shared.module';
import { EditComponent } from './edit/edit.component';
import { UsersService } from './../services/users.service';
import { MaterialModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './../config/firebase-config';

// edit shopping list module bootstrap
@NgModule({
  imports: [
    EditRoutingModule,SharedModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    MaterialModule.forRoot(),
    CommonModule
  ],
  exports: [],
  declarations: [EditComponent],
  providers: [UsersService],
})
export class EditModule { }
