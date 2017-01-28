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
        let test=this.af.database.list('articles', {
            query: {
                orderByChild: '$value',
                equalTo: val
            }
        });
        debugger
        return this.af.database.list('articles', {
            query: {
                orderByChild: '$value',
                equalTo: val
            }
        })
    }
}