import { Injectable, Inject, OnInit} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AngularFire, FirebaseListObservable, FirebaseRef } from 'angularfire2';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { user,list } from './../model/user';

@Injectable()
export class ListService {
    af: AngularFire;
    items: FirebaseListObservable<any[]>;
    private url;
    private user;
	private sId;
    private myUsers;
    constructor(private http: Http, af: AngularFire,private router: Router,private route: ActivatedRoute,) {
        this.af = af;
        this.getAllRelatedUsers();
        this.user=this.route.params
            // learned in last Angular course last thursday
            .switchMap((params: Params) => {
                this.url = params['email'];
                this.sId = params['id'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(c=>console.log(c));

    }
    // get shopping list details by shopping list id
    getSDetails(sListId){
        return this.af.database.object(`sList/${sListId}`);
    }
    // add article to list
    addArticleToList(sList,art) {
        let articleInList = this.af.database.list(`/sList/${sList}/articles`);
        // check if exists
        let findArtInList = this.af.database.list(`/sList/${sList}/articles`,{
            query:{
                orderByChild:'id',
                equalTo:art.id
            }
        }).map(x=>x).subscribe(x=>{
            if (x && x.length>0){} else {
                if (sList){
                    findArtInList.unsubscribe();
                articleInList.push(art);
                }
            }
            findArtInList.unsubscribe();
        })
        
    }

// add article and add article id to list
    addArticleAndAddToList(sList,obj){
        let addArticle=this.af.database.list('articles');
        let checkInAArticle=this.af.database.list('articles',{
            query:{
                orderByChild:'name',
                equalTo:obj.name
            }
        }).map(x=>x)
        .subscribe(x=>{
            debugger
            if (x && x.length>0){
                let obj={
                    id:x[0].$key
                }
                this.addArticleToList(sList,obj);        
            } else {
                let articleAdded:any = addArticle.push(obj);
                this.addArticleToList(sList,articleAdded.key); 
            }
            checkInAArticle.unsubscribe();
        });
    }

    // get article by id
    getArticles(data):any{
        return this.af.database.object(`/articles/${data}`).subscribe(x=>{
            return x;
        });
    }
// get articles from shopping list by shopping list id
    getArticlesForSlist(sList){
        let articles=this.af.database.list(`/sList/${sList}/articles`).map(x=>{
            return x;
        });
        return articles;
    }


    // get article by name
    getArticleByName(name):any{
        let getArticle = this.af.database.list(`/articles`, {
            query:{
                orderByChild:'name',
                equalTo:name
            }
        }).map(x=>{
            return x;
        });
        return getArticle;
    }

    // get all articles
    getAllArticles():Observable<any>{
        let items=this.af.database.list('/articles')
            .map(x=>{
                return x;
            });
        return items;
    }

    // search articles
    searchArticles(val:string):Observable<any>{
        
        return this.af.database.list('articles', {
            query: {
                orderByChild: '$value',
                equalTo: val
            }
        }).map(x=>{
            return x;
        })
    }
    // check if article exists
	
	checkArticleExists(obj):Observable<any>{
		let article=this.af.database.list(`articles`,{
			query:{
				orderByChild:'name',
				equalTo:obj
			}
		}).map(x=>{
            return x;
        });
		return article;
	}
	
	// get artcile by id
	getArticle(id):Observable<any>{
        return this.af.database.object(`/articles/${id}`).map(x=>{
            return x;
        });
    }
	

    // get all related users
    getAllRelatedUsers() {
        let sListUsers=this.af.database.list('sList').map(x=>{
            return this.getRelatedUsers(x);
        });
        sListUsers.subscribe(x=>{
            this.myUsers=[];
            if (x && x.length>0){
                this.myUsers=x;
            }
        })
    }

    getRelatedUsers(x):Array<any>{
        let arr=[];
        let arrFinal=[];
        let arrMap=x.map(function(item){ return item.users});
        for (let i=0;i<arrMap.length;i++){
            if (arrMap[i]){
                if (arrMap[i].includes(this.url)){
                    arr.push(arrMap[i]);
                }
            }
        }    
        for (let j=0;j<arr.length;j++){
            for (let k=0;k<arr[j].length;k++){
                arrFinal.push(arr[j][k]);
            }    
        }
        return arrFinal.filter((v, i, a) => a.indexOf(v) === i); ;
    }

    // make article as isbasked true
    addIsBasked(key,sListId){
        let articleItems=this.af.database.list(`sList/${sListId}/articles/`);
        let article=this.af.database.list(`sList/${sListId}/articles/`,{
            query:{
                orderByChild:'id',
                equalTo:key
            }
        }).map(
            x=>x
        ).subscribe(x=>{
            debugger
            if (x && x.length>0){
                articleItems.update(x[0].$key,{isBasked:true});
            }
            article.unsubscribe();
        })
    }


    // remove article from shopping list
    removeArticleFromSList(key,sListId){
        let self=this;
        let articleItem=this.af.database.list(`sList/${sListId}/articles/`);
        let article=this.af.database.list(`sList/${sListId}/articles/`,{
            query:{
                orderByChild:'id',
                equalTo:key
            }
        }).map(
            x=>x
        ).subscribe(x=>{
            debugger
            if (x && x.length>0){
                self.af.database.object(`sList/${sListId}/articles/${x[0].$key}`).remove();
                article.unsubscribe();
            }
            article.unsubscribe();
        })
    }
        // update shopping list by articles
    updateSList(item,sListId){
        let articleItem=this.af.database.list(`sList/${sListId}/articles/`);
        let article=this.af.database.list(`sList/${sListId}/articles/`,{
            query:{
                orderByChild:'id',
                equalTo:item.id
            }
        }).map(
            x=>x
        ).subscribe(x=>{
            debugger
            if (x && x.length>0){
                articleItem.update(x[0].$key,{
                    isBasked:item.isBasked ?item.isBasked:false,
                    description:item.description?item.description:'',
                    amount:item.amount?item.amount:''
                });
            }
            article.unsubscribe();
        })       
    }
    // get recent articles (to be used later)
    getRecentSListArticles(sList){
        return this.af.database.list(`sList/${sList}/articles`).map(arr=>{
            debugger
            return arr;
        });
    }
}