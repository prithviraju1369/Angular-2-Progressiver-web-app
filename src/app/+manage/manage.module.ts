import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { ManageRoutingModule } from './manage.routing';
import { SharedModule } from './../shared/shared.module';
import { ManageComponent }   from './manage/manage.component';
// import { ManageComponent } from './manage/manage.component';
import { AddArticleComponent } from './manage/addarticle/addarticle.component';
import { EditArticleComponent } from './manage/editarticle/editarticle.component';
import { AddCategoryComponent } from './manage/addcategory/addcategory.component';
import { EditCategoryComponent } from './manage/editcategory/editcategory.component';
import { DeleteCategoryComponent } from './manage/deletecategory/deletecategory.component';
import { SharedAddOrEditComponent } from './manage/sharedaddoredit/sharedaddoredit.component';
import {UsersService} from './../services/users.service';
import { MaterialModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './../config/firebase-config';


@NgModule({
  imports: [
    ManageRoutingModule,SharedModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    MaterialModule.forRoot(),
    CommonModule
  ],
  exports: [],
  declarations: [ManageComponent,AddArticleComponent,EditCategoryComponent,EditArticleComponent,
          AddCategoryComponent,SharedAddOrEditComponent,DeleteCategoryComponent],
  providers: [UsersService],
})
export class ManageModule { }
