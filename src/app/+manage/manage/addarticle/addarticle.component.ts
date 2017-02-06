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
				this.sId = params['id'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(c=>
        {console.log(c);
            this.syncChanges()
            
        });
        
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

   getAllCategoriesForUser(){
        // this.list.push({name:'Category'});
        let categoryObs=this._manageService.getAllCategoriesForUser(this.url);
        categoryObs.subscribe(x=>{
			this.list=[];
            this.listDup=x;
			for(let i=0;i<x.length;i++){
				let val:any=x[i];
				let item={
					name:val.name,
					value:val.$key,
				}
				this.list.push(item);
			}
			
        });
    }
	
	onSaved(obj){
		obj.isDefault=false;
		this.checkArticleExists(obj);
        this.router.navigate(['manage']);
		
	}
	
	checkArticleExists(obj){
		let self=this;
		this._manageService.checkArticleExists(obj.name)
			.subscribe(x=>{
				if(x && x.length>0){
					self._manageService.addArticleToCategory(x[0].$key,obj.order)
				}else{
					let item={
						name:obj.name,
						isDefault:false
					};
					self._manageService.addArticleAndAddToCategory(item,obj.order)
				}
			});
	}




}