import { Component, OnInit ,Inject} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SharedComponent } from './../../shared/shared.component';
import { ManageService } from './../manage.service';
import { user } from './../../model/user';

import { Observable } from 'rxjs/Observable';

import { list } from './../../model/user';
import { Subject } from 'rxjs/Subject';
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
    selector: 'manage',
    templateUrl:'./manage.component.html',
    styleUrls: ['./manage.component.scss'],
    providers: [ManageService]
})

export class ManageComponent implements OnInit {
    private url;
    private user;
    db:any;
    af: AngularFire;
    catalogs:catalog[]=[];
    usersCatalogs:catalog[]=[];
    searchitems: Observable<Array<string>>;
    articles:Array<any>=[];
    searchArticles:Array<any>=[];
    private searchTerms = new Subject<string>();
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
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(x=>{
            this.syncChanges();
        });
            
    }
    // get email id from the local database(PouchDB)
    syncChanges(){
        let self=this;
        this.db.allDocs({include_docs: true, descending: true}, function(err, docs) {
            if(err){
            console.log(err);
            return err;
            }
            if(docs && docs.rows.length>0){
            self.url=docs.rows[0].doc.user;
                self.getCatalog();
                self.getUsersCatalog();
                self.getAllArticles(); 
            }
        });
    }
    // get all articles
    getAllArticles(){
        let articles$=this._manageService.getAllArticles();
        articles$.subscribe(x=>{
            this.articles=x;
        });
    }

   
    // get users from catalog by language english and german (user defined)
    getUsersCatalog(){
        let self=this;
        let englishitems = this.af.database.list('/catalog/english',{
                        query:{
                        orderByChild: 'isDefault',
                        equalTo:false
                        }
                    }).map(x=>{
                        for(let i=0;i<x.length;i++){
                            x[i].language='english';
                        }
                        return x;
                    });
        let germanitems = this.af.database.list('/catalog/german',{
            query:{
            orderByChild: 'isDefault',
            equalTo:false
            }
        }).map(x=>{
            for(let i=0;i<x.length;i++){
                    x[i].language='german';
                }
            return x;
        });
                    
            englishitems.concat(germanitems).subscribe(x=>{
                let self=this;
                this.usersCatalogs=[];
                if(x!=undefined){
                for(let i=0;i<x.length;i++){
                    let item={
                        name:x[i].name,
                        id:x[i].$key,
                        language:x[i].language,
                        articles:[]
                    };
                        this.usersCatalogs.push(item);
                        for (var property in x[i].articles) {
                        if (x[i].articles.hasOwnProperty(property)) {
                            self.af.database.object(`/articles/${x[i].articles[property]}`).subscribe(x=>{
                                this.usersCatalogs[i].articles.push(x);
                            });
                        }
                    }
                }
            }
        });
    }
   
// get users from catalog by language english and german (default)
    getCatalog(){
        let self=this;
        let englishitems = this.af.database.list('/catalog/english',{
                        query:{
                        orderByChild: 'isDefault',
                        equalTo:true
                        }
                    }).map(x=>{
                        for(let i=0;i<x.length;i++){
                            x[i].language='english';
                        }
                        return x.sort(function(a, b){
                            var keyA = a.order,
                                keyB = b.order;
                            // Compare the 2 dates
                            if(keyA < keyB) return -1;
                            if(keyA > keyB) return 1;
                            return 0;
                        });
                    })
            let germanitems = this.af.database.list('/catalog/german',{
                query:{
                orderByChild: 'isDefault',
                equalTo:true
                }
            }).map(x=>{
                for(let i=0;i<x.length;i++){
                    x[i].language='german';
                }
                return x.sort(function(a, b){
                    var keyA = a.order,
                        keyB = b.order;
                    // Compare the 2 dates
                    if(keyA < keyB) return -1;
                    if(keyA > keyB) return 1;
                    return 0;
                });
            });
                    englishitems.concat(germanitems).subscribe(x=>{
                        let self=this;
                        this.catalogs=[];
                        if(x!=undefined){
                        for(let i=0;i<x.length;i++){
                            let item={
                                name:x[i].name,
                                articles:[]
                            };
                            this.catalogs.push(item);
                            for (var property in x[i].articles) {
                        if (x[i].articles.hasOwnProperty(property)) {
                            self.af.database.object(`/articles/${x[i].articles[property]}`).subscribe(x=>{
                                this.catalogs[i].articles.push(x);
                            });
                        }
                    }
                }
            }
        });
    }

    // add to catalog
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
    // catalog mapping (user defined)
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

    // catalog mapping (default)
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
	
    // catalog article mapping (user defined)
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

// catalog article mapping (default)
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

// toggle catalog on ui based on user interaction (tap/click events)
    toggleCatalog(evt){
        // let parentNode=evt.target.parentElement;
        // let currentEle=parentNode.getElementsByClassName('slist-articles')[0];
        if(evt.style.display=='none'){
            evt.style.display='block';
        }else{
            evt.style.display='none';
        }
    }

    // delete article
    deleteArticle(artId,catId,language){
        this._manageService.removeArticleFromCategory(artId,catId,language);
    }

    // show delete ui
    showDelete(deleteButton,deleteArticle){
        deleteButton.style.display='none';
        deleteArticle.style.display='block';
    }

    // hide delete option
    hideDelete(deleteButton,deleteArticle){
        deleteButton.style.display='flex';
        deleteArticle.style.display='none';
    }
}