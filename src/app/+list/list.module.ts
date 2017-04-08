import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ListRoutingModule } from './list.routing';
import { SharedModule } from './../shared/shared.module';
import { ListComponent } from './list/list.component';
// import { ManageComponent } from './manage/manage.component';
import { UsersService } from './../services/users.service';
import { MaterialModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './../config/firebase-config';

// shopping list module bootstrapping
@NgModule({
  imports: [
    ListRoutingModule,SharedModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    MaterialModule.forRoot(),
    CommonModule
  ],
  exports: [],
  declarations: [ListComponent],
  providers: [UsersService],
})
export class ListModule { }
