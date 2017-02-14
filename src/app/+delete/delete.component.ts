import { Injectable, Inject}     from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFire, FirebaseListObservable,FirebaseObjectObservable, FirebaseRef } from 'angularfire2';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

import { SharedComponent } from './../shared/shared.component';
import { UsersService } from './../services/users.service';
import { user } from './../model/user';

declare var PouchDB: any;

@Component({
  selector: 'delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {
    private abtusers:user[];
    db:any;
    af: AngularFire;
    sList:any;
    url:any;
    modelValue:any;
    localDBID;
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

    // show side nav extras
    showSideMenu() {
        
        document.getElementById('edit').style.display='block';
        document.getElementById('clear').style.display='block';
        document.getElementById('finished').style.display='block';
        document.getElementById('delete').style.display='block';
    }

    //get or set email id from localDB
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
               self.getSListDetail();
            }
        });
    }

    // get shopping list details by id
    getSListDetail() {
        this.af.database.object(`sList/${this.sList}`).map(x=>x).subscribe(x=>{
            this.modelValue=x.title;
        })
    }

    // delete shopping list by id

    deleteSList() {
        let self=this;
        this.af.database.list(`sList/${this.sList}`).remove();
        this.db.get(this.localDBID).then(function (doc) {
                debugger
                doc.user = self.url;
                doc.sList=null;
                return self.db.put(doc);
            });
        this.router.navigate([`lists`,{email:this.url}]);
    }

// cancel redirect ti lists
    cancel() {
        this.router.navigate([`lists`,{email:this.url}]);
    }

}