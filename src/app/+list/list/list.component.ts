import { Component, OnInit ,Inject,OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SharedComponent } from './../../shared/shared.component';
import { ListService } from './../list.service';
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

export class listArticle{
    constructor(
        public isBasked?: boolean,
        public id?: string,
        public name?: string,
        public description?: string,
        public amount?: string,   
        public price?: string,
        
        ){}   
}

@Component({
    selector: 'list',
    templateUrl:'./list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [ListService]
})

export class ListComponent implements OnInit,OnDestroy  {
    private url;
    private sList;
    private user;
    db:any;
    clearArticle:any;
    af: AngularFire;
    catalogs:catalog[]=[];
    usersCatalogs:catalog[]=[];
    searchitems: Observable<Array<string>>;
    articles:Array<any>=[];
    searchArticles:Array<any>=[];
    articlesList:Array<listArticle>=[];
    selectedArticleList:listArticle={};
    private searchTerms = new Subject<string>();
    constructor(@Inject(FirebaseRef) public fb,  af: AngularFire,
        public _listService: ListService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.af = af;
        this.db = new PouchDB("sList");
    }

     ngOnDestroy(){
        // document.removeEventListener('tap', this.enter, false);
        console.log("Removed event listener"); 
        
    }

    ngOnInit() {
        this.user=this.route.params
            .switchMap((params: Params) => {
                this.url = params['email'];
                this.sList = params['id'];
                this.clearArticle = params['clearArticle'];
                if( params['again'] =="true"){
                    this.af.database.list(`sList/${this.sList}/articles`).remove();
                }
                else if(this.clearArticle=="true"){
                    this.router.navigate([`list/${this.sList}`,{email:this.url,clearArticle:true,again:true}]);                    
                    window.location.reload();
                }
                this.getOrAddUsernameToLocalDB();
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(c=>console.log(c));
        this.getCatalog();
        this.getUsersCatalog();

        this.getArticleBySlist();
        
        const search=document.getElementById("listSearch");
        let search$=Observable.fromEvent(search,"keyup")
            .map((x:any)=>x.target.value)
            .map(x=>{
                return this.performSearch(x);
            });
       
        search$.subscribe(x=>{
            this.searchArticles=x;
        });   
        this.getAllArticles();     
        this.showSideMenu();
    }
    showSideMenu(){
        
        document.getElementById('edit').style.display='block';
        document.getElementById('clear').style.display='block';
        document.getElementById('finished').style.display='block';
        document.getElementById('delete').style.display='block';
    }

    getOrAddUsernameToLocalDB(){
        let self=this;
        self.db.allDocs({include_docs: true, descending: true}, function(err, doc) {
                if(err){
                    console.log(err)
                    return;
                }
                if(doc.rows.length>0){
                    self.setLocalUser(doc.rows[0].doc);
                }else{
                    self.addUserToLocalDB();
                }
            });
    }

    setLocalUser(obj){
        let self=this;
        if(this.url==obj.user){
            this.db.get(obj._id).then(function (doc) {
                debugger
                doc.sList=self.sList;
                doc.user = self.url;
                return self.db.put(doc);
            });
        }else{
            this.db.get(obj._id).then(function (doc) {
                debugger
                doc.user = self.url;
                doc.sList=self.sList;
                return self.db.put(doc);
            });
        }
    }

    addUserToLocalDB(){
        this.db.post({user:this.url});
    }

    

    performSearch(inp):Array<any>{
        if(inp.trim()==''){
            return [];
        }
        let arr=[]
        for(let i=0;i<this.articles.length;i++){
            if(this.articles[i].name.search(inp)>-1){
                let item=this.articles[i];
                if(this.findInListArticles(item.$key)){
                    item.backGroundColor='#F24646';
                }else{
                    item.backGroundColor='#6B8E23';
                }
                arr.push(this.articles[i]);
            }
        }
        if(arr.length==0)
        {
            var obj={
                name:inp,
                default:false
            };
            arr.push(obj);
        }
        return arr;
    }

    findInListArticles(nameKey){
        let exists=false;
        for (var i=0; i < this.articlesList.length; i++) {
            if (this.articlesList[i].id === nameKey) {
                exists=true;;
            }
        }
        return exists;
    }


    getAllArticles(){
        let articles$=this._listService.getAllArticles();
        articles$.subscribe(x=>{
            this.articles=x;
        });
    }

    getArticleBySlist(){
        this._listService.getArticlesForSlist(this.sList).map(x=>x)
            .subscribe(x=>{
                this.articlesList=[];
                if(x && x.length){
                    for(let i=0;i<x.length;i++){
                        let item:listArticle={};
                        item.id=x[i].id;
                        item.description=x[i].description;
                        item.isBasked=x[i].isBasked;
                        item.amount=x[i].amount;
                        item.price=x[i].price;
                        this.articlesList.push(item);
                        this.af.database.object(`/articles/${x[i].id}`).subscribe(p=>{
                            if(p){
                                for(let j=0;j<this.articlesList.length;j++){
                                    if(this.articlesList[j].id==p.$key){
                                        this.articlesList[j].name=p.name;
                                    }
                                }
                            }
                                
                            });
                    }
                }
            })
    }

    addToLIst(item:any){
        this.searchArticles=[];
        if(item.$key){
            this.addArticleToLIst(item.$key);
        }else{
            let obj={
                name:item.name,
                isDefault:false
            }
            let article$=this._listService.getArticleByName(obj.name).map(x=>x);
               article$.subscribe(x=>{
                    if(item){
                        article$.unsubscribe();
                        if(x && x.length>0){
                            item.$key=x[0].$key;
                            this.addArticleToLIst(x[0].$key);    
                        }else{
                            this._listService.addArticleAndAddToList(this.sList,obj);
                        }
                    }
                    
                })
            
        }
    }

    addArticleToLIst(key:string){
        let obj:listArticle={
            id:key
        };
        this._listService.addArticleToList(this.sList,obj);

    }

    getUsersCatalog(){
        let self=this;
        let items = this.af.database.list('/catalog/english',{
                        query:{
                        orderByChild: 'isDefault',
                        equalTo:false
                        }
                    }).map(x=>{
                        return x;
                    }).subscribe(x=>{
                        let self=this;
                        this.usersCatalogs=[];
                        if(x!=undefined){
                        for(let i=0;i<x.length;i++){
                            let item={
                                name:x[i].name,
                                id:x[i].$key,
                                articles:[]
                            };
                            this.usersCatalogs.push(item);
                            for (var property in x[i].articles) {
                        if (x[i].articles.hasOwnProperty(property)) {
                            self.af.database.object(`/articles/${x[i].articles[property]}`).subscribe(p=>{
                                this.usersCatalogs[i].articles.push(p);
                            });
                        }
                    }
                }
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
                    }).map(x=>{
                        return x.sort(function(a, b){
                            var keyA = a.order,
                                keyB = b.order;
                            // Compare the 2 dates
                            if(keyA < keyB) return -1;
                            if(keyA > keyB) return 1;
                            return 0;
                        });
                    }).subscribe(x=>{
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
        // let parentNode=evt.target.parentElement;
        // let currentEle=parentNode.getElementsByClassName('slist-articles')[0];
        if(evt.style.display=='none'){
            evt.style.display='block';
        }else{
            evt.style.display='none';
        }
    }

    selectedArticleInList(a){
        this.selectedArticleList=a;
        let box:any=document.getElementsByClassName('slist-article-details');
        box[0].style.display='block';
    }

    addArticleAmount(amount){
        var regex = /(\d+)/g;
        let split='';
        let num=amount.match(regex);
        num=this.getNumberFromString(amount);
        if(num){
            if(this.isKg(amount)){
                num=parseFloat(num)+parseFloat("0.1");
                split=amount.split("k");
                this.selectedArticleList.amount=(Math.round(num*10)/10)+"k"+split[1].toLowerCase();
            }else if(this.isg(amount)){
                if(num<100){
                    num=parseFloat(num)+parseFloat("10");
                    this.selectedArticleList.amount=(Math.round(num*10)/10)+"g";
                }else{
                    num=parseFloat(num)+parseFloat("50");
                    this.selectedArticleList.amount=(Math.round(num*10)/10)+"g";
                }
            }else{
                this.selectedArticleList.amount=(parseFloat((Math.round(amount*10)/10).toString())+parseFloat("1")).toString();
            }
        }
    }

    getNumberFromString(str){
        var regex = /[+-]?\d+(\.\d+)?/g;
        var floats = str.match(regex).map(function(v) { return parseFloat(v); });
        if(floats && floats.length>0){
            return floats[0];
        }else{
            return null;
        }
    }

    reduceArticleAmount(amount){
        var regex = /(\d+)/g;
        let split='';
        let num=amount.match(regex);
        num=this.getNumberFromString(amount);
        if(num){
            if(this.isKg(amount)){
                num=parseFloat(num)-parseFloat("0.1");
                split=amount.split("k");
                this.selectedArticleList.amount=(Math.round(num*10)/10)+"k"+split[1].toLowerCase();
            }else if(this.isg(amount)){
                if(num<100){
                    num=parseFloat(num)-parseFloat("10");
                    this.selectedArticleList.amount=(Math.round(num*10)/10)+"g";
                }else{
                    num=parseFloat(num)-parseFloat("50");
                    this.selectedArticleList.amount=(Math.round(num*10)/10)+"g";
                }
            }else{
                this.selectedArticleList.amount=(parseFloat((Math.round(amount*10)/10).toString())-parseFloat("1")).toString();
            }
        }
    }

    isKg(amount){
        return amount.toLowerCase().indexOf('kg') !== -1
    }

    isg(amount){
        return amount.toLowerCase().indexOf('g') !== -1
    }

    addToBasked(item){
        this._listService.addIsBasked(item.id,this.sList);
        let box:any=document.getElementsByClassName('slist-article-details');
        box[0].style.display='none';       
    }
    removeArticleFromSList(item){
        this._listService.removeArticleFromSList(item.id,this.sList);
        let box:any=document.getElementsByClassName('slist-article-details');
        box[0].style.display='none';   
    }

    updateSList(item){
        this._listService.updateSList(item,this.sList);
        let box:any=document.getElementsByClassName('slist-article-details');
        box[0].style.display='none';   
    }
}