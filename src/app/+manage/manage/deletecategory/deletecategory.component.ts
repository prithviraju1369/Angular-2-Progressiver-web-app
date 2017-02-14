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
    private language;
    af: AngularFire;
    catalogs:catalog[]=[];
    title:string='Edit Category';
    list:Array<any>=[];
    category:Object={};
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
				this.catId=params['id'];
                this.language=params['lan'];
                // this.catId=params['catId'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(x=>{
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
    // get category
    getCategory() {
        let getCategory$=this._manageService.getCategoryById(this.catId,this.language);
        getCategory$.subscribe(x=>{
            this.category=x;
            this.modelValue=x.name;
        })
    }

    // cancelDeleteCategory click redirect to manage page
	cancelDeleteCategory() {
        this.router.navigate(['manage']);
    }

    // delete category by id and language
    deleteCategory(id){
        this._manageService.deleteCategory(id,this.language);
        this.router.navigate(['manage',{lan:this.language}]);
    }
}