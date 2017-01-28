import { Component, OnInit ,Inject} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SharedComponent } from './../../../shared/shared.component';
import { ListService } from './../../list.service';
import { user } from './../../../model/user';

import { Observable } from 'rxjs/Observable';

import { list } from './../../../model/user';

import {AngularFire,FirebaseListObservable,FirebaseObjectObservable,FirebaseRef} from 'angularfire2';

export class catalog{
    constructor(
        public id?: string,
        public name?: string,
        public articles?:Array<any>    
        ){}   
}

@Component({
    selector: 'editarticle',
    templateUrl:'./editarticle.component.html',
    styleUrls: ['./editarticle.component.scss'],
    providers: [ListService]
})

export class EditArticleComponent implements OnInit {
    private url;
    private user;
    af: AngularFire;
    catalogs:catalog[]=[];
    title:string='Edit Article';
    list:Array<any>=[];
    constructor(@Inject(FirebaseRef) public fb,  af: AngularFire,
        public _listService: ListService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.af = af;
    }

    ngOnInit() {
        this.user=this.route.params
            .switchMap((params: Params) => {
                this.url = params['email'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(c=>console.log(c));
        this.getAllArticles();
    }

    getAllArticles(){
        // this.list.push({name:'Article'});
        let articleObs=this._listService.getAllArticles();
            articleObs.subscribe(x=>{
                for(let i=0;i<x.length;i++){
                        x[i].name=x[i].$value;  
                    }
                this.list=this.list.concat(x);
            });
    }
}