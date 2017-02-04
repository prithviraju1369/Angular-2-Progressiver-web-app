import { Injectable, Inject, OnInit}     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {user,list} from './../model/user';

import { AngularFire, FirebaseListObservable, FirebaseRef} from 'angularfire2';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Injectable()
export class ListService {
    af: AngularFire;
    items: FirebaseListObservable<any[]>;
    private url;
    private user;
	private sId;
    private myUsers;
    constructor( @Inject(FirebaseRef) public fb, private http: Http, af: AngularFire,private router: Router,private route: ActivatedRoute,) {
        this.af = af;
        this.getAllRelatedUsers();
        this.user=this.route.params
            .switchMap((params: Params) => {
                this.url = params['email'];
                debugger
                this.sId = params['id'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(c=>console.log(c));

    }

    addArticleToList(sList,art){
        let articleInList=this.af.database.list(`/sList/${sList}/articles`);
        let findArtInList=this.af.database.list(`/sList/${sList}/articles`,{
            query:{
                orderByChild:'id',
                equalTo:art.id
            }
        }).map(x=>x).subscribe(x=>{
            if(x && x.length>0){}else{
                articleInList.push(art);
            }
        })
        
    }

    addArticleAndAddToList(sList,obj){
        let addArticle=this.af.database.list('articles');
        let checkInAArticle=this.af.database.list('articles',{
            query:{
                orderByChild:'name',
                equalTo:obj.name
            }
        }).map(x=>x).subscribe(x=>{
            if(x && x.length>0){
                let obj={
                    id:x[0].$key
                }
                this.addArticleToList(sList,obj);        
            }else{
                let articleAdded:any= addArticle.push(obj);
                this.addArticleToList(sList,articleAdded.key); 
            }
        });
    }

    getAllDefaultCatalog(): any{
        let a;
        let items = this.af.database.list('/catalog/english')
        .map(x=>x).subscribe(x=>a);
        return a;
    }
    getArticles(data):any{
        return this.af.database.object(`/articles/${data}`).subscribe(x=>x);
    }

    getArticlesForSlist(sList){
        return this.af.database.list(`/sList/${sList}/articles`)
    }

    getArticleByName(name):any{
        let getArticle= this.af.database.list(`/articles`, {
            query:{
                orderByChild:'name',
                equalTo:name
            }
        });
        return getArticle;
    }

    getAllCategories():Observable<any>{
        let a;
        let items=this.af.database.list('/catalog/english')
                .map(x=>x);
        return items;
    }
    getAllArticles():Observable<any>{
        let items=this.af.database.list('/articles')
            .map(x=>x);
        return items;
    }
    searchArticles(val:string):Observable<any>{
        
        return this.af.database.list('articles', {
            query: {
                orderByChild: '$value',
                equalTo: val
            }
        })
    }
    getAllCategoriesForUser(user:string):Observable<any>{
		return this.af.database.list('/catalog/english', {
            query: {
                orderByChild: `users/${user}`,
                equalTo:true
            }
        })
	}
	
	addCategory(obj:Object):void{
		let categories=this.af.database.list('/catalog/english');
		let categoryAdded=categories.push(obj);
		let addToCatalog=this.af.database.object(`catalog/english/${categoryAdded.key}/users`)
		// let sListUsers=this.af.database.list(`/sListUsers/${sId}`);
		// sListUsers.subscribe((x:any)=>{
		// 	console.log(x);
		// 	if(x && x.length>0){
		// 		x.forEach(function(item:any){
		// 			let obj:any={};
		// 			obj[item.$key]=true;
		// 			addToCatalog.update(obj);
		// 		})
				
		// 	}
		// })
        this.myUsers.forEach(function(item){
            let obj:any={};
            obj[item]=true;
            addToCatalog.update(obj);
        });

	}
	
	editCategory(obj:any,catId:string):void{
		let categories=this.af.database.object(`/catalog/english/${catId}`);
		let categoryAdded=categories.update({name:obj.name,order:obj.order});
		let addToCatalog=this.af.database.object(`catalog/english/${catId}/users`)
        this.myUsers.forEach(function(item){
            let obj:any={};
            obj[item]=true;
            addToCatalog.update(obj);
        });

	}

    getCategoryById(id:string):Observable<any>{
        let category=this.af.database.object(`catalog/english/${id}`).map(x=>x);

        return category;
    }
	
	checkArticleExists(obj):Observable<any>{
		let article=this.af.database.list(`articles`,{
			query:{
				orderByChild:'name',
				equalTo:obj
			}
		}).map(x=>x);
		return article;
	}
	
	addArticleToCategory(key:string,catKey:string):void{
		if(key){
			let addArticleToCategory=this.af.database.list(`catalog/english/${catKey}/articles`);
			let checkArticleInCategory=this.af.database.list(`catalog/english/${catKey}/articles`).map(x=>{
				let exists=false;
				for(let i=0;i<x.length;i++){
					if(x[i].$value==key){
						exists=true;
					}
				}
				return exists;
			})
			
			checkArticleInCategory.subscribe(x=>{
				if(!x){
					addArticleToCategory.push(key);
				}
			});
		}
	}
	
	addArticleAndAddToCategory(obj,catId){
		let addArticle=this.af.database.list('articles');
		let articleAdded= addArticle.push(obj);
		var key=articleAdded.key;
		this.addArticleToCategory(key,catId);
    }
	
	getArticle(id):Observable<any>{
        return this.af.database.object(`/articles/${id}`);
    }
	
	removeArticleFromCategory(artId,catId){
		let removeFromCategory=this.af.database.list(`catalog/english/${catId}/articles`).map(x=>{
				let val='';
				for(let i=0;i<x.length;i++){
					if(x[i].$value==artId){
						val=x[i].$key;
					}
				}
				return val;
			})
			
		removeFromCategory.subscribe(x=>{
			if(x!=''){
				this.af.database.object(`catalog/english/${catId}/articles/${x}`).remove();
			}
		})
	}

    

    getAllRelatedUsers(){
        let sListUsers=this.af.database.list('sList').map(x=>{
            return this.getRelatedUsers(x);
        });
        sListUsers.subscribe(x=>{
            this.myUsers=[];
            if(x && x.length>0){
                this.myUsers=x;
            }
        })
    }

    getRelatedUsers(x):Array<any>{
        let arr=[];
        let arrFinal=[];
        let arrMap=x.map(function(item){ return item.users});
        for(let i=0;i<arrMap.length;i++){
            if(arrMap[i]){
                if(arrMap[i].includes(this.url)){
                    arr.push(arrMap[i]);
                }
            }
        }    
        for(let j=0;j<arr.length;j++){
            for(let k=0;k<arr[j].length;k++){
                arrFinal.push(arr[j][k]);
            }    
        }

        return arrFinal.filter((v, i, a) => a.indexOf(v) === i); ;
    }

    addIsBasked(key,sListId){
        let articleItem=this.af.database.list(`sList/${sListId}/articles/`);
        let article=this.af.database.list(`sList/${sListId}/articles/`,{
            query:{
                orderByChild:'id',
                equalTo:key
            }
        }).map(
            x=>x
        ).subscribe(x=>{
            if(x && x.length>0){
                articleItem.update(x[0].$key,{isBasked:true});
            }
        })
    }

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
            if(x && x.length>0){
                self.af.database.list(`sList/${sListId}/articles/${x[0].$key}`).remove();
            }
        })
    }

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
            if(x && x.length>0){
                articleItem.update(x[0].$key,{
                    isBasked:item.isBasked,
                    description:item.description,
                    amount:item.amount
                });
            }
        })       
    }

    getRecentSListArticles(sList){
        return this.af.database.list(`sList/${sList}/articles`).map(arr=>{
            return arr;
        });
    }
}