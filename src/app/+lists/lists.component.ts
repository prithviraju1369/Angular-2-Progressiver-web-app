import { Component, OnInit,Inject } from '@angular/core';
import { SharedComponent } from './../shared/shared.component';
import { Observable } from 'rxjs/Observable';
import { AngularFire,FirebaseListObservable,FirebaseObjectObservable,FirebaseRef } from 'angularfire2';
import { Router, ActivatedRoute, Params } from '@angular/router';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

import { UsersService } from './../services/users.service';
import { user } from './../model/user';

declare var PouchDB: any;

@Component({
  selector: 'lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
    private abtusers:user[];
    private name;
    private email;
    private sLists;
    private url;
    sListsEmpty:Boolean;
    af:any;
    db:any;
    constructor(public _userService: UsersService,  af: AngularFire,
        private route: ActivatedRoute,
        private router: Router) {
        this.db = new PouchDB("sList");
        this.af = af;
        this.sListsEmpty = false;
    }

    ngOnInit() {
        this.syncChanges();
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
                self.getAllLists()
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
        this.af.database.list('sListUsers').map(x=>{
            return x;
        }).subscribe(x=>{
            this.sLists = [];
            debugger
            if (x && x.length>0){
                // for (let i=0;i<x.length;i++){
                //     if (x[i] && x[i].users && x[i].users.length){
                //         for (let j=0;j<x[i].users.length;j++){
                //             if (x[i].users[j]==this.url){
                //                 self.sLists.push(x[i]);
                //             }    
                //         }
                //     }
                // }
                for (let i=0;i<x.length;i++){
                     for (var property in x[i]) {
                        if (x[i].hasOwnProperty(property)) {
                            if (x[i][property].toString() == "true" || x[i][property].toString() == "false"){
                                if (property == this.url){

                                    self.af.database.object(`sList/${x[i].$key}`).map(x=>x)
                                        .subscribe(x=>{
                                            if (x && x.title){
                                                self.sLists.push(x);
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
        })
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