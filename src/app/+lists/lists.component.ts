import { Component, OnInit,Inject} from '@angular/core';
import { SharedComponent } from './../shared/shared.component';
import { UsersService } from './../services/users.service';
import {user} from './../model/user';

import { Observable } from 'rxjs/Observable';

import {AngularFire,FirebaseListObservable,FirebaseObjectObservable,FirebaseRef} from 'angularfire2';

import { Router, ActivatedRoute, Params } from '@angular/router';

// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

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
    af:any;
    db:any;
    constructor(public _userService: UsersService,@Inject(FirebaseRef) public fb,  af: AngularFire,
        private route: ActivatedRoute,
        private router: Router) {
        this.db = new PouchDB("sList");
        this.af = af;
    }

    ngOnInit() {
        this.syncChanges();
        // this.getUsers();
    }

    syncChanges(){
        let self=this;
        this.db.allDocs({include_docs: true, descending: true}, function(err, docs) {
            if(err){
            console.log(err);
            return err;
            }
            if(docs && docs.rows.length>0){
                // this.getSLists(docs.rows[0].doc.user);
                self.url=docs.rows[0].doc.user;
                self.getAllLists()
            }
        });
    }

    searchSLists(){
        let self=this;
        this.af.database.list(`users`,{
            query:{
                orderByChild: `email`,
                equalTo:this.email
            }
        }).map(x=>x).subscribe(p=>{
            if(p && p.length>0){
                self.url=p[0].$key;
                self.getAllLists();
            } 
        })
    }



    getAllLists(){
        let self=this;
        this.af.database.list('sList').map(x=>{
            return x;
        }).subscribe(x=>{
            this.sLists=[];
            if(x && x.length>0){
                for(let i=0;i<x.length;i++){
                    if(x[i] && x[i].users && x[i].users.length){
                        for(let j=0;j<x[i].users.length;j++){
                            if(x[i].users[j]==this.url){
                                self.sLists.push(x[i]);
                            }    
                        }
                    }
                }
            }
        })
    }

    goToSlist(item){
        this.router.navigate(['list',item.$key,{email:this.url}]);
    }

    createNewList(){
        this.router.navigate(['create']);
    }

}