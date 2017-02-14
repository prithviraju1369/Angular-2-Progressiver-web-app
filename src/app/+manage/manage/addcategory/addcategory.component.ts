import { Component, OnInit, Inject} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseRef } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import { SharedComponent } from './../../../shared/shared.component';
import { ManageService } from './../../manage.service';
import { user } from './../../../model/user';
import { list } from './../../../model/user';

declare var PouchDB: any;

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
    providers: [ManageService]
})

export class AddCategoryComponent implements OnInit {
    private url;
    db:any;
    private user;
	private sId;
	private modelValue;
    title:string='Add Category';
    list:Array<any>=[];
    af: AngularFire;
    catalogs:catalog[]=[];
    constructor(  af: AngularFire,
        public _manageService: ManageService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.af = af;
        this.db = new PouchDB("sList");
    }

    ngOnInit() {
        this.user=this.route.params
            .switchMap((params: Params) => {
                // this.url = '-K_PcS3U-bzP0Jgye_Xo';
                this.sId = params['id'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(c=>{
            this.syncChanges();
        });
    }
    // get user email from local databas(pouch db)
    syncChanges() {
        let self=this;
        this.db.allDocs({include_docs: true, descending: true}, function(err, docs) {
            if (err){
            console.log(err);
            return err;
            }
            if (docs && docs.rows.length>0){
            self.url=docs.rows[0].doc.user;
            self.getAllCategoriesForUser();
            }
        });
    }

    // get all Category for user
    getAllCategoriesForUser() {
        // this.list.push({name:'Category'});
        let categoryObs=this._manageService.getAllCategoriesForUser(this.url);
        categoryObs.subscribe(x=>{
            this.modelValue=x.length+1;
			let listArr=Array.apply(1, {length: this.modelValue}).map(Number.call, Number);
			let listArrMap= listArr.map(function(val){return ++val;});
			for (let i=0;i<listArrMap.length;i++){
			let val=listArrMap[i];
				let item={
					name:val,
					value:val
				}
				this.list.push(item);
			}
        });
    }
	
    // on save click from SharedComponent
	onSaved(obj){
        let item:any={
            name:obj.name,
		    order:obj.order
        };
		item.isDefault=false;
        this._manageService.addCategory(item,obj.language);
		this.router.navigate(['manage']);
	}
    

}