import { Injectable, Inject}     from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { SharedComponent } from './../shared/shared.component';
import { UsersService } from './../services/users.service';
import {user} from './../model/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFire, FirebaseListObservable,FirebaseObjectObservable, FirebaseRef} from 'angularfire2';

// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
declare var PouchDB: any;

@Component({
  selector: 'clear',
  templateUrl: './clear.component.html',
  styleUrls: ['./clear.component.scss']
})
export class ClearComponent implements OnInit {
    private abtusers:user[];
    db:any;
    af: AngularFire;
    sList:any;
    url:any;
    constructor(public _userService: UsersService,private route: ActivatedRoute,
        private router: Router,@Inject(FirebaseRef) public fb,af: AngularFire) {
        this.db = new PouchDB("sList");
        this.af = af;
    }

    ngOnInit() {
        // this.getUsers();
        this.syncChanges();
        this.showSideMenu()
    }
     syncChanges(){
        let self=this;
        this.db.allDocs({include_docs: true, descending: true}, function(err, docs) {
            if(err){
            console.log(err);
            return err;
            }
            if(docs && docs.rows.length>0){
                debugger
               self.sList=docs.rows[0].doc.sList;
               self.url=docs.rows[0].doc.user;
            }
        });
    }
    showSideMenu(){
        
        document.getElementById('edit').style.display='block';
        document.getElementById('clear').style.display='block';
        document.getElementById('finished').style.display='block';
        document.getElementById('delete').style.display='block';
    }

    clearArticles(evt){
        evt.preventDefault();
        this.af.database.list(`sList/${this.sList}/articles`).remove();
        this.router.navigate([`list/${this.sList}`,{email:this.url,clearArticle:true}]);
    }

    cancelClearArticles(){
        this.router.navigate([`list/${this.sList}`,{email:this.url}]);
    }

}