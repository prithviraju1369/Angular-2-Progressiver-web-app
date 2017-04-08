import { Injectable, Inject, OnInit}     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {user,list} from './../model/user';
import { AngularFire, FirebaseListObservable, FirebaseRef} from 'angularfire2';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var PouchDB: any;
@Injectable()
export class ManageService implements OnInit{
    af: AngularFire;
    items: FirebaseListObservable<any[]>;
    private url;
    private user;
	private sId;
    private myUsers;
     db:any;


    constructor(  private http: Http, af: AngularFire,private router: Router,private route: ActivatedRoute,) {
        this.af = af;
        // this.getAllRelatedUsers();

        
        this.user=this.route.params
            .switchMap((params: Params) => {
                if(params['email'])
                this.url = params['email'];
                this.sId = params['id'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(c=>{
            this.syncChanges();
        });

    }
    ngOnInit() {
        // PouchDB instances
        this.db = this.PouchDBRef();
    }
    // sync user email id from local PouchDB
    syncChanges() {
        
        let self=this;
        if(this.db){
        this.db.allDocs({include_docs: true, descending: true}, function(err, docs) {
            if (err){
            console.log(err);
            return err;
            }
            if (docs && docs.rows.length>0){
            self.url=docs.rows[0].doc.user;
            }
        });
        }
    }


    PouchDBRef(){
        if(PouchDB)
        return new PouchDB("sList");
    }

    // get article by id
    getArticles(data):any{
        return this.af.database.object(`/articles/${data}`).subscribe(x=>x);
    }
    // get all articles
    getAllArticles():Observable<any>{
        let items=this.af.database.list('/articles')
            .map(x=>x);
        return items;
    }
    //search article by value
    searchArticles(val:string):Observable<any>{
        
        return this.af.database.list('articles', {
            query: {
                orderByChild: '$value',
                equalTo: val
            }
        })
    }

    // get all categories by user both german and english
    getAllCategoriesForUser(user:string):Observable<any>{
		let english=this.af.database.list('/catalog/english', {
            query: {
                orderByChild: `users/${user}`,
                equalTo:true
            }
        }).map(x=>{
            for (let i=0;i<x.length;i++){
                x[i].language='english';
            }
            return x;
        });
        let german=this.af.database.list('/catalog/german', {
            query: {
                orderByChild: `users/${user}`,
                equalTo:true
            }
        }).map(x=>{
            for (let i=0;i<x.length;i++){
                x[i].language='english';
            }
            return x;
        });
        return english.concat(german);
	}
	
    // add category from manage component
	addCategory(obj:Object,language:any,user):void{

		let categories=this.af.database.list(`/catalog/${language}`);
		let categoryAdded=categories.push(obj);
		let addToCatalog=this.af.database.object(`catalog/${language}/${categoryAdded.key}/users`)
        this.getAllRelatedUsers(categoryAdded.key,language,user);

	}
    // edit category
	editCategory(obj:any,catId:string,language:string,user):void{
		let categories=this.af.database.object(`/catalog/${language}/${catId}`);
		let categoryAdded=categories.update({name:obj.name,order:obj.order});
		let addToCatalog=this.af.database.object(`catalog/${language}/${catId}/users`)
        this.getAllRelatedUsers(catId,language,user);

	}
    // get category by id
    getCategoryById(id:string,language:string):Observable<any>{
        let category=this.af.database.object(`catalog/${language}/${id}`).map(x=>x);

        return category;
    }
	
    // get article by name (exists or not)
	checkArticleExists(obj):Observable<any>{
		let article=this.af.database.list(`articles`,{
			query:{
				orderByChild:'name',
				equalTo:obj
			}
		}).map(x=>x);
		return article;
	}
	

    // add article to category
	addArticleToCategory(key:string,catKey:string,language:string):void{
		if (key){
			let addArticleToCategory=this.af.database.list(`catalog/${language}/${catKey}/articles`);
			let checkArticleInCategory=this.af.database.list(`catalog/${language}/${catKey}/articles`).map(x=>{
				let exists=false;
				for (let i=0;i<x.length;i++){
					if (x[i].$value==key){
						exists=true;
					}
				}
				return exists;
			})
			
			checkArticleInCategory.subscribe(x=>{
				if (!x){
					addArticleToCategory.push(key);
				}
			});
		}
	}
	

    // add article 
    //add article id to category
	addArticleAndAddToCategory(obj,catId,language){
		let addArticle=this.af.database.list('articles');
		let articleAdded= addArticle.push(obj);
		var key=articleAdded.key;
		this.addArticleToCategory(key,catId,language);
	}
	
    // add article
	addArticle(obj){
		let addArticle=this.af.database.list('articles');
		let articleAdded= addArticle.push(obj);
	}

    // get article by id
	getArticle(id):Observable<any>{
        return this.af.database.object(`/articles/${id}`);
    }

    // remove article id from category
	removeArticleFromCategory(artId,catId,language){

        //check if article exists in articles collection
		let removeFromCategory=this.af.database.list(`catalog/${language}/${catId}/articles`).map(x=>{
				let val='';
				for (let i=0;i<x.length;i++){
					if (x[i].$value==artId){
					debugger;
						val=x[i].$key;
					}
				}
				return val;
			})
			
		removeFromCategory.subscribe(x=>{
			if (x!=''){
				this.af.database.object(`catalog/${language}/${catId}/articles/${x}`).remove();
			}
		})
	}

    getOwnArticles(usr:string){
        let ownarticles = this.af.database.list(`/ownarticles`,{
            query:{
                orderByChild:'user',
                equalTo:usr
            }
        }).map(x=>x);
        return ownarticles;
    }

    // delete category by lanaguage and id
    deleteCategory(id,language){
        let category=this.af.database.object(`catalog/${language}/${id}`);
        category.remove();
    }

    // get all related users by language from category
    getAllRelatedUsers(catId,language,user){
        let addToCatalog=this.af.database.object(`catalog/${language}/${catId}/users`)
        let sListUsers=this.af.database.list('sList').map(x=>{
            return this.getRelatedUsers(x,user);
        });
        sListUsers.subscribe(x=>{
            debugger
            this.myUsers=[];
            if (x && x.length>0){
                this.myUsers=x;
                this.myUsers.forEach(function(item){
                    let obj:any={};
                    obj[item]=true;
                    addToCatalog.update(obj);
                });
            }
        })
    }

    // related users mapping
    getRelatedUsers(x,user):Array<any>{
        let arr=[];
        let arrFinal=[];
        let arrMap=x.map(function(item){ return item.users});
        debugger
        for (let i=0;i<arrMap.length;i++){
            if (arrMap[i]){
                let u=this.url||user;
                if (arrMap[i].includes(u)){
                    arr.push(arrMap[i]);
                }
            }
        }    
        for (let j=0;j<arr.length;j++){
            for (let k=0;k<arr[j].length;k++){
                arrFinal.push(arr[j][k]);
            }    
        }
        debugger
        return arrFinal.filter((v, i, a) => a.indexOf(v) === i); ;
    }

    removeIfExistsMyOwnArticles(art,user){
        let ownarticles = this.af.database.list(`/ownarticles`,{
            query:{
                orderByChild:'articleId',
                equalTo:art
            }
        }).map(x=>x).subscribe(x=>{
            if(x && x.length>0){
                debugger
                let filteredVal=x.filter(function(i){
                    return i.user==user;
                });
                for(let i=0;i<filteredVal.length;i++){
                    const items = this.af.database.list('/ownarticles');
                    // to get a key, check the Example app below
                    items.remove(filteredVal[i].$key);
                }
            }
        })
        
    }
}