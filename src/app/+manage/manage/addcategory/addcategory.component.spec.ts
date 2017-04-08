/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import {AddCategoryComponent } from './addcategory.component';
import { FormsModule } from '@angular/forms';
import { ManageService } from './../../manage.service';
import { SharedAddOrEditComponent } from './../sharedaddoredit/sharedaddoredit.component';
import {
  AngularFire,
  FirebaseObjectObservable,
  FIREBASE_PROVIDERS,
  AngularFireAuth,
  FirebaseConfig,
  FirebaseApp,
  defaultFirebase,
  AngularFireDatabase,
  FirebaseAppConfig,
  AngularFireModule
} from 'angularfire2';

import { Subscription } from 'rxjs/Subscription';
import { firebaseConfig } from './../../../config/firebase-config';
import { MaterialModule } from '@angular/material';

import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';
 import 'rxjs/Rx';

const APP_NAME = 'Fergg';

class DummyComponent {
}
class RouterStub {
}

describe('CreateComponent', () => {

let subscription:Subscription;
  let app: firebase.app.App;
  let rootRef: firebase.database.Reference;
  let questionsRef: firebase.database.Reference;
  let listOfQuestionsRef: firebase.database.Reference;
  let angularFire2: AngularFire;
  let PouchDB: any;
  let allDocs:any;
  let AppServiceStub = {
    PouchDBRef(){
        return new PouchDB("sList");
    }
  };
  beforeEach((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000000;
    setTimeout(function () {
            console.log('inside timeout');
            done();
        }, 100);
    TestBed.configureTestingModule({
      declarations: [
      AddCategoryComponent,SharedAddOrEditComponent
      ],
      imports: [MaterialModule.forRoot(),
      RouterTestingModule ,FormsModule,AngularFireModule.initializeApp(firebaseConfig)
      ],
      providers:[{provide: ManageService, useValue: AppServiceStub }]
    });
    TestBed.compileComponents();
  });

  it('should create the app home', async(() => {
    let fixture = TestBed.createComponent(AddCategoryComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  

  // it(`should have as title 'app works!'`, async(() => {
  //   let fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   let app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app works!');
  // }));

  // it('should render title in a h1 tag', async(() => {
  //   let fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   let compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('.toolbar-subtext').textContent).toContain('A Mobile Shopping List');
  // }));
});
