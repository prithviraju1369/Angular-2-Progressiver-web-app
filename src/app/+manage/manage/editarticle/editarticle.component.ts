import { Component, OnInit ,Inject,OnDestroy} from '@angular/core';
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
    selector: 'editarticle',
    templateUrl:'./editarticle.component.html',
    styleUrls: ['./editarticle.component.scss'],
    providers: [ManageService]
})

export class EditArticleComponent implements OnInit,OnDestroy {
    private url;
	db:any;
    private user;
    af: AngularFire;
	private catId;
	private sId;
	private modelValue;
	private aId;
	private article;
	private checkArticle$;
    catalogs:catalog[]=[];
	titleValue:string;
    title:string='Edit Article';
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
                // this.url = '-K_PcS3U-bzP0Jgye_Xo';
				this.sId=params['id'];
                this.catId=params['catId'];
				this.modelValue=params['catId'];
				debugger
				this.aId=params['artId'];
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
			// get all Category for user
            self.getAllCategoriesForUser();
			// get article for user
			self.getArticle();
            }
        });
    }

	ngOnDestroy() {
		
	}
	
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
	
	getArticle() {
		let article=this._manageService.getArticle(this.aId)
			.map(x=>x);
		article.subscribe(x=>{
			if (x){
				this.article=x;
				this.titleValue=x.name;
			}
		});
	}

	// on save click from shared component
	onSaved(obj){
		obj.isDefault=false;
		//this._manageService.editCategory(obj,this.sId,this.catId);
		if (this.objChanged(obj)){
			this.checkArticleExists(obj);
		}
		this.router.navigate(['manage']);
	}
	
	// check if categoryObs changed 
	objChanged(obj):boolean{
		let objChangedValue=true;
		if (obj.name == this.article.name && obj.order == this.catId){
			objChangedValue =false;
		}
		return objChangedValue;
	}
	
	// check if article exists
	checkArticleExists(obj){
		let languageObj=this.list.find(function(item){
            return item.value==obj.order;
        })
		let self=this;
		this.checkArticle$=this._manageService.checkArticleExists(obj.name);
			this.checkArticle$.subscribe(x=>{
				if (x && x.length>0){
					self._manageService.addArticleToCategory(x[0].$key,obj.order,languageObj.language)
				} else {
					let item={
						name:obj.name,
						isDefault:false
					};
					self._manageService.addArticleAndAddToCategory(item,obj.order,languageObj.language)
				}
				if (obj.order != this.catId && x && x.length >0){
					self._manageService.removeArticleFromCategory(x[0].$key,this.catId,languageObj.language)
				}
			});
	}
}