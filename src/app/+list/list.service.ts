import { Injectable, Inject}     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {user,list} from './../model/user';

import { AngularFire, FirebaseListObservable, FirebaseRef} from 'angularfire2';

@Injectable()
export class ListService {
    af: AngularFire;
    items: FirebaseListObservable<any[]>;

    constructor( @Inject(FirebaseRef) public fb, private http: Http, af: AngularFire) {
        this.af = af;
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
	
	addCategory(obj:Object,sId:string):void{
		let categories=this.af.database.list('/catalog/english');
		let categoryAdded=categories.push(obj);
		let addToCatalog=this.af.database.object(`catalog/english/${categoryAdded.key}/users`)
		let sListUsers=this.af.database.list(`/sListUsers/${sId}`);
		sListUsers.subscribe((x:any)=>{
			console.log(x);
			if(x && x.length>0){
				x.forEach(function(item:any){
					let obj:any={};
					obj[item.$key]=true;
					addToCatalog.update(obj);
				})
				
			}
		})
	}
	
	editCategory(obj:any,sId:string,catId:string):void{
        debugger
		let categories=this.af.database.object(`/catalog/english/${catId}`);
		let categoryAdded=categories.update({name:obj.name,order:obj.order});
		let addToCatalog=this.af.database.object(`catalog/english/${catId}/users`)
		let sListUsers=this.af.database.list(`/sListUsers/${sId}`);
		sListUsers.subscribe((x:any)=>{
			console.log(x);
			if(x && x.length>0){
				
				x.forEach(function(item:any){
					let obj:any={};
					obj[item.$key]=true;
					addToCatalog.update(obj);
				})
				
			}
		})
	}

    getCategoryById(id:string):Observable<any>{
        let category=this.af.database.object(`catalog/english/${id}`).map(x=>x);

        return category;
    }
}