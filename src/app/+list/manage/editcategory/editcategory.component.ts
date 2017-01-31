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
    selector: 'editcategory',
    templateUrl:'./editcategory.component.html',
    styleUrls: ['./editcategory.component.scss'],
    providers: [ListService]
})

export class EditCategoryComponent implements OnInit {
    private url;
    private user;
    private sId;
    private catId;
	private modelValue;
    af: AngularFire;
    catalogs:catalog[]=[];
    title:string='Edit Category';
    list:Array<any>=[];
    category:Object={};
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
				this.sId=params['id'];
                this.catId=params['catId'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(c=>console.log(c));
        this.getCategory()
    }
    

    getCategory(){
        let getCategory$=this._listService.getCategoryById(this.catId);
        getCategory$.subscribe(x=>{
            this.category=x;
            debugger
            this.modelValue=x.order;

        })

         let categoryObs=this._listService.getAllCategoriesForUser(this.url);
        categoryObs.subscribe(x=>{
            var flags = [], output = [], l = x.length, i;
            for( i=0; i<l; i++) {
                if( flags[x[i].$key]) continue;
                flags[x[i].$key] = true;
                output.push(x[i].$key);
            }
			let listArr=Array.apply(1, {length: output.length}).map(Number.call, Number);
			this.list= listArr.map(function(val){return ++val;});
        });
    }
	
	onSaved(obj){
		obj.isDefault=false;
		this._listService.editCategory(obj,this.sId,this.catId);
		
	}

}