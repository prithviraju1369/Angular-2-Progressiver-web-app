import { Injectable, Inject}     from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFire, FirebaseListObservable,FirebaseObjectObservable, FirebaseRef} from 'angularfire2';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

import { SharedComponent } from './../shared/shared.component';
import { UsersService } from './../services/users.service';
import { user } from './../model/user';

declare var PouchDB: any;

@Component({
  selector: 'finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.scss']
})

export class FinishComponent implements OnInit {
    private abtusers:user[];
    db:any;
    af: AngularFire;
    sList:any;
    url:any;
    modelValue:any;
    localDBID;
    finished:any;
    articles:any;
    constructor(public _userService: UsersService,private route: ActivatedRoute,
        private router: Router,af: AngularFire) {
this.db = new PouchDB("sList");
        this.af = af;
    }

    ngOnInit() {
        // this.getUsers();
        this.syncChanges();
        this.showSideMenu();
    }

    // get user email id from localDB (PouchDB)
     syncChanges() {
        let self=this;
        this.db.allDocs({include_docs: true, descending: true}, function(err, docs) {
            if (err){
            console.log(err);
            return err;
            }
            if (docs && docs.rows.length>0){
                debugger
               self.sList=docs.rows[0].doc.sList;
               self.url=docs.rows[0].doc.user;
               self.localDBID=docs.rows[0].doc._id;
            }
        });
    }

    // showside menu extra
    showSideMenu() {
        
        document.getElementById('edit').style.display='block';
        document.getElementById('clear').style.display='block';
        document.getElementById('finished').style.display='block';
        document.getElementById('delete').style.display='block';
    }

    // finishSlist change isFinished to true

    finsihSlist() {
        let self=this;
        debugger
        console.log(this.finished);
        console.log(this.articles);
        if (this.finished){
            let finished=this.af.database.object(`sList/${this.sList}`);
            finished.update({isFinished:true});
        }
        if (this.articles){
            this.af.database.list(`sList/${this.sList}/articles`).remove();
        }
        this.router.navigate([`lists`,{email:this.url}]);
    }
    // cancel button click redirect to list page
    cancel() {
        this.router.navigate([`lists`,{email:this.url}]);
    }

}