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
    selector: 'editcategory',
    templateUrl:'./editcategory.component.html',
    styleUrls: ['./editcategory.component.scss'],
    providers: [ManageService]
})

export class EditCategoryComponent implements OnInit {
    private url;
    private user;
    private sId;
    private catId;
    private language;
	private modelValue;
    af: AngularFire;
    catalogs:catalog[]=[];
    title:string='Edit Category';
    list:Array<any>=[];
    category:Object={};
    db:any;
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
				this.sId=params['id'];
                this.catId=params['catId'];
                this.language=params['lan'];
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
            self.getCategory();
            }
        });
    }
    // get category by category id from route and language
    getCategory() {
        let getCategory$=this._manageService.getCategoryById(this.catId,this.language);
        getCategory$.subscribe(x=>{
            this.category=x;
            this.modelValue=x.order;

        })

         let categoryObs=this._manageService.getAllCategoriesForUser(this.url);
        categoryObs.subscribe(x=>{
			this.list=[];
            var flags = [], output = [], l = x.length, i;
            for( i=0; i<l; i++) {
                if ( flags[x[i].$key]) continue;
                flags[x[i].$key] = true;
                output.push(x[i].$key);
            }
			let listArr=Array.apply(1, {length: output.length}).map(Number.call, Number);
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
	

    // on save click from shared component
	onSaved(obj){
		obj.isDefault=false;
		this._manageService.editCategory(obj,this.catId,this.language);
		this.router.navigate(['manage']);
	}

    // deleteCategory click redirect to deletecategory component
    deleteCategory(id){
        this.router.navigate(['manage/deletecategory',id])
    }

}