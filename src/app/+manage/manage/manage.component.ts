import { Component, OnInit ,Inject} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SharedComponent } from './../../shared/shared.component';
import { ManageService } from './../manage.service';
import { user } from './../../model/user';

import { Observable } from 'rxjs/Observable';

import { list } from './../../model/user';
import { Subject } from 'rxjs/Subject';
import {AngularFire,FirebaseListObservable,FirebaseObjectObservable,FirebaseRef} from 'angularfire2';

export class catalog{
    constructor(
        public id?: string,
        public name?: string,
        public articles?:Array<any>    
        ){}   
}

@Component({
    selector: 'manage',
    templateUrl:'./manage.component.html',
    styleUrls: ['./manage.component.scss'],
    providers: [ManageService]
})

export class ManageComponent implements OnInit {
    private url;
    private user;
    af: AngularFire;
    catalogs:catalog[]=[];
    usersCatalogs:catalog[]=[];
    searchitems: Observable<Array<string>>;
    articles:Array<any>=[];
    searchArticles:Array<any>=[];
    private searchTerms = new Subject<string>();
    constructor(@Inject(FirebaseRef) public fb,  af: AngularFire,
        public _manageService: ManageService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.af = af;
    }

    ngOnInit() {
        this.user=this.route.params
            .switchMap((params: Params) => {
                this.url = '-K_PcS3U-bzP0Jgye_Xo';
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(c=>console.log(c));
        this.getCatalog();
        this.getUsersCatalog();
        
        
        this.getAllArticles();     
    }

    getAllArticles(){
        let articles$=this._manageService.getAllArticles();
        articles$.subscribe(x=>{
            this.articles=x;
        });
    }

    getUsersCatalog(){
        let self=this;
        
        let items = this.af.database.list('/catalog/english',{
				query:{
				orderByChild: `users/${self.url}`,
				equalTo:true
				}
			})
        .map(x=>{
			return x.sort(function(a, b){
				var keyA = a.order,
					keyB = b.order;
				// Compare the 2 dates
				if(keyA < keyB) return -1;
				if(keyA > keyB) return 1;
				return 0;
			});
		}).subscribe(x=>{
            if(x!=undefined){
			debugger
                x.forEach(function(item){
                    let it:catalog={};
                    it.id=item.$key;
                    it.name=item.name;
                    it.articles=[];
                    self.pushToUsersCatalog(it);
					debugger
                    for (var property in item.articles) {
                        if (item.articles.hasOwnProperty(property)) {
                            self.af.database.object(`/articles/${item.articles[property]}`).subscribe(x=>{
                                debugger
                                if(x!=undefined){
                                    self.usersCatalogs.forEach(function(ob){
                                        if(ob.name==item.name){
                                            self.changeInUsersCatalogs(x,item.$key);
                                        }
                                    });
                                }
                            })
                        }
                    }
                })
            }
        });
	}
   

    getCatalog(){
        let self=this;
        
        let items = this.af.database.list('/catalog/english',{
				query:{
				orderByChild: 'isDefault',
				equalTo:true
				}
			})
        .map(x=>x).subscribe(x=>{
            if(x!=undefined){
                x.forEach(function(item){
                    let it:catalog={};
                    it.id=item.$key;
                    it.name=item.name;
                    it.articles=[];
                    self.pushToCatalog(it);
                    for (var property in item.articles) {
                        if (item.articles.hasOwnProperty(property)) {
                            self.af.database.object(`/articles/${item.articles[property]}`).subscribe(x=>{
                                debugger
                                if(x!=undefined){
                                    self.catalogs.forEach(function(ob){
                                        if(ob.name==item.name){
                                            self.changeInCatalogs(x,item.$key);
                                        }
                                    });
                                }
                            })
                        }
                    }
                })
            }
        });
    }

    pushToCatalog(item){
        let updated:boolean=false;
        for(let i=0;i<this.catalogs.length;i++){
            if(this.catalogs[i].id==item.id)
            {
                this.catalogs[i].name=item.name;
                updated=true;
            }
        }
        if(!updated)
            this.catalogs.push(item);
        
    }

    changeInCatalogs( item, id ) {
        for(var i = 0; i <= this.catalogs.length; i++){
            if(this.catalogs[i] && this.catalogs[i].id==id){
                var obj:catalog={};
                obj.name=item.name;
                obj.id=item.$key;
                this.pushToArticles(obj,this.catalogs[i].id);
                console.log(this.catalogs);
            }
        }
    }

    	pushToUsersCatalog(item){
        let updated:boolean=false;
        for(let i=0;i<this.usersCatalogs.length;i++){
            if(this.usersCatalogs[i].id==item.id)
            {
                this.usersCatalogs[i].name=item.name;
                this.usersCatalogs[i].id=item.id;
                updated=true;
            }
        }
        if(!updated)
            this.usersCatalogs.push(item);
        
    }

    changeInUsersCatalogs( item, id ) {
        for(var i = 0; i <= this.catalogs.length; i++){
            if(this.usersCatalogs[i] && this.usersCatalogs[i].id==id){
                var obj:catalog={};
                obj.name=item.name;
                obj.id=item.$key;
                this.pushToUserArticles(obj,this.usersCatalogs[i].id);
            }
        }
    }
	
	pushToUserArticles(item,id){
        let updated:boolean=false;
        for(let i=0;i<this.usersCatalogs.length;i++){
            if(this.usersCatalogs[i].id==id)
            {
                for(let j=0;j<this.usersCatalogs[i].articles.length;j++)
                {
                    if(this.usersCatalogs[i].articles[j].id==item.id){
                        this.usersCatalogs[i].articles[j].name=item.name;
                        updated=true;
                    }
                }
                if(!updated)
                {
                    this.usersCatalogs[i].articles.push(item);
                }
            }
        }
    }


    pushToArticles(item,id){
        let updated:boolean=false;
        for(let i=0;i<this.catalogs.length;i++){
            if(this.catalogs[i].id==id)
            {
                for(let j=0;j<this.catalogs[i].articles.length;j++)
                {
                    if(this.catalogs[i].articles[j].id==item.id){
                        this.catalogs[i].articles[j].name=item.name;
                        updated=true;
                    }
                }
                if(!updated)
                {
                    this.catalogs[i].articles.push(item);
                }
            }
        }
    }


    toggleCatalog(evt){
        let parentNode=evt.target.parentElement;
        let currentEle=parentNode.getElementsByClassName('slist-articles')[0];
        if(currentEle.style.display=='none'){
            currentEle.style.display='block';
        }else{
            currentEle.style.display='none';
        }
    }

    deleteArticle(artId,catId){
        this._manageService.removeArticleFromCategory(artId,catId);
    }
}