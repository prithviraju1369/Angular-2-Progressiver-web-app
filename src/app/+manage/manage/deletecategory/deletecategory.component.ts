import { Component, OnInit ,Inject} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SharedComponent } from './../../../shared/shared.component';
import { ManageService } from './../../manage.service';
import { user } from './../../../model/user';

import { Observable } from 'rxjs/Observable';

import { list } from './../../../model/user';

import {AngularFire,FirebaseListObservable,FirebaseObjectObservable,FirebaseRef} from 'angularfire2';
declare var PouchDB: any;

export class catalog{
    constructor(
        public id?: string,
        public name?: string,
        public articles?:Array<any>    
        ){}   
}

@Component({
    selector: 'deletecategory',
    templateUrl:'./deletecategory.component.html',
    styleUrls: ['./deletecategory.component.scss'],
    providers: [ManageService]
})

export class DeleteCategoryComponent implements OnInit {
    private url;
    db:any;
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
				this.catId=params['id'];
                // this.catId=params['catId'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe({

        });
        this.getCategory();
    }
    
    syncChanges(){
        let self=this;
        this.db.allDocs({include_docs: true, descending: true}, function(err, docs) {
            if(err){
            console.log(err);
            return err;
            }
            if(docs && docs.rows.length>0){
            self.url=docs.rows[0].doc.email;
            this.getAllCategoriesForUser();
            }
        });
    }

    getCategory(){
        let getCategory$=this._manageService.getCategoryById(this.catId);
        getCategory$.subscribe(x=>{
            this.category=x;
            this.modelValue=x.name;
        })
    }
	cancelDeleteCategory(){
        this.router.navigate(['manage']);
    }
    deleteCategory(id){
        this._manageService.deleteCategory(id);
        this.router.navigate(['manage']);
    }
	

}