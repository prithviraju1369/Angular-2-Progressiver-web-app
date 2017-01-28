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
    selector: 'addcategory',
    templateUrl:'./addcategory.component.html',
    styleUrls: ['./addcategory.component.scss'],
    providers: [ListService]
})

export class AddCategoryComponent implements OnInit {
    private url;
    private user;
    title:string='Add Category';
    list:Array<any>=[];
    af: AngularFire;
    catalogs:catalog[]=[];
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
        this.getAllCategories();
    }
    getAllCategories(){
        // this.list.push({name:'Category'});
        let categoryObs=this._listService.getAllCategories();
        categoryObs.subscribe(x=>{
            this.list=this.list.concat(x);
        });
    }
    

}