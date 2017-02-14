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
    selector: 'addarticle',
    templateUrl:'./addarticle.component.html',
    styleUrls: ['./addarticle.component.scss'],
    providers: [ManageService]
})

export class AddArticleComponent implements OnInit {
    private url;
    private user;
    db:any;
	private sId;
	private modelValue;
    af: AngularFire;
    catalogs:catalog[]=[];
    title:string='Add Article';
    list:Array<any>=[];
	listDup:Array<any>=[];
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
				this.sId = params['id'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(c=>
        {console.log(c);
            this.syncChanges()
            
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
			this.list=[];
            this.listDup=x;
			for (let i=0;i<x.length;i++){
				let val:any=x[i];
				let item={
					name:val.name,
					value:val.$key,
                    language:val.language
				}
				this.list.push(item);
			}
			
        });
    }
	// on save click from SharedComponent
	onSaved(obj){
		obj.isDefault=false;
		this.checkArticleExists(obj);
        this.router.navigate(['manage']);
		
	}
	
	checkArticleExists(obj){
        debugger
        let languageObj=this.list.find(function(item){
            return item.value==obj.order;
        })
		let self=this;
		this._manageService.checkArticleExists(obj.name)
			.subscribe(x=>{
				if (x && x.length>0){
					self._manageService.addArticleToCategory(x[0].$key,obj.order,languageObj.language)
				} else {
					let item={
						name:obj.name,
						isDefault:false
					};
					self._manageService.addArticleAndAddToCategory(item,obj.order,languageObj.language)
				}
			});
	}




}