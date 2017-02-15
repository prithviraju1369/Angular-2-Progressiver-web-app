import { Component, OnInit,Inject } from '@angular/core';
import { SharedComponent } from './../shared/shared.component';
import { Observable } from 'rxjs/Observable';
import { AngularFire,FirebaseListObservable,FirebaseObjectObservable,FirebaseRef } from 'angularfire2';
import { Router, ActivatedRoute, Params } from '@angular/router';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

import { UsersService } from './../services/users.service';
import { user } from './../model/user';
import { ListsService } from './lists.service';
declare var PouchDB: any;

@Component({
  selector: 'lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
  providers: [ListsService]
})
export class ListsComponent implements OnInit {
    private abtusers:user[];
    private name;
    private email;
    private sLists=[];
    private url;
    sListsEmpty:Boolean;
    af:any;
    db:any;
    constructor(public _listservice: ListsService,  af: AngularFire,
        private route: ActivatedRoute,
        private router: Router) {
        this.db = new PouchDB("sList");
        this.af = af;
        this.sListsEmpty = false;
    }

    ngOnInit() {
        this.syncChanges();
        this.sLists=[];
        this.getAllLists();
        // this.getUsers();
    }
// get user email from local databas(pouch db)
    syncChanges() {
        let self = this;
        this.db.allDocs({include_docs: true, descending: true}, function(err, docs) {
            if (err){
            console.log(err);
            return err;
            }
            if (docs && docs.rows.length>0){
                // this.getSLists(docs.rows[0].doc.user);
                self.url = docs.rows[0].doc.user;
                
            }
        });
    }
// search sLists based on name and email id
    searchSLists() {
        let self = this;
        this.af.database.list(`users`,{
            query:{
                orderByChild: `email`,
                equalTo:this.email
            }
        }).map(x=>x).subscribe(p=>{
            if (p && p.length>0){
                self.url = p[0].$key;
                self.getAllLists();
            } 
        })
    }

// get all list and map user shpping lists

    getAllLists() {
        let self=this;
        let sListUsers=this._listservice.getSListUsers()
        .subscribe(x=>{
            self.sLists = [];
            if(!self.url){
                this.sListsEmpty = true;
            }
            else if (x && x.length>0){
                this.sListsEmpty = false;
                for (let i=0;i<x.length;i++){
                     for (var property in x[i]) {
                        if (x[i].hasOwnProperty(property)) {
                            if (x[i][property].toString() == "true" || x[i][property].toString() == "false"){
                                if (property == self.url){
                                    self.af.database.object(`sList/${x[i].$key}`).map(x=>x)
                                        .subscribe(x=>{
                                            if (x && x.title!==undefined){
                                                self.updateSLists(x);
                                            }
                                        })
                                }
                            }
                        }
                    }
                }
            } else {
                this.sListsEmpty = true;
            }
            sListUsers.unsubscribe();
        })
    }

    //update/push sList array
    updateSLists(x){
        let p=x;
        console.log('a');
        this.sLists.push(p);
    }

//go to shopping list page on click
    goToSlist(item){
        this.router.navigate(['list',item.$key,{email:this.url}]);
    }

// create new shopping list go to create page 
    createNewList() {
        this.router.navigate(['create']);
    }

}