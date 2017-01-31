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
	private sId;
	private modelValue;
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
                this.sId = params['id'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(c=>console.log(c));
        this.getAllCategoriesForUser();
    }
    getAllCategoriesForUser(){
        // this.list.push({name:'Category'});
        let categoryObs=this._listService.getAllCategoriesForUser(this.url);
        categoryObs.subscribe(x=>{
            this.modelValue=x.length+1;
			let listArr=Array.apply(1, {length: this.modelValue}).map(Number.call, Number);
			this.list= listArr.map(function(val){return ++val;});
        });
    }
	
	onSaved(obj){
		obj.isDefault=false;
		this._listService.addCategory(obj,this.sId);
		
	}
    

}