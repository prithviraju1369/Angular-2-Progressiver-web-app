import { Injectable, Inject, OnInit} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AngularFire, FirebaseListObservable, FirebaseRef } from 'angularfire2';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { user,list } from './../model/user';

@Injectable()
export class ListsService {
    af: AngularFire;
    items: FirebaseListObservable<any[]>;
    private url;
    private user;
	private sId;
    private myUsers;
    constructor(private http: Http, af: AngularFire,private router: Router,private route: ActivatedRoute,) {
        this.af = af;
    }
    // get shopping list details by shopping list id
    getSListUsers(){
        return this.af.database.list('sListUsers');;
    }
}