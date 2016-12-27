import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SharedComponent } from './../../shared/shared.component';
import { CreateService } from './../list.service';
import { user } from './../../model/user';

import { Observable } from 'rxjs/Observable';

import { list } from './../../model/user';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

@Component({
    selector: 'list',
    templateUrl:'./list.component.html',
    providers: [CreateService]
})
export class ListComponent implements OnInit {
    private url;
    private user;
    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {

    }

    ngOnInit() {
        this.user=this.route.params
            .switchMap((params: Params) => {
                this.url = params['email'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(c=>console.log(c));
    }
}