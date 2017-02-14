import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { user } from './../model/user';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
// Import RxJs required methods
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

@Injectable()
export class UsersService{
    
     private users = '/users';
    af:AngularFire;
    constructor(private http:Http,af:AngularFire){
        this.af = af;
    }
    getUsers() : Observable<user[]>{
         // ...using get request
         var result=this.http.get(this.users)
                         .map((res:Response) => res.json())
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
         return result;

        
     }

     getUsersFirebase():Observable<any[]>{
         return this.af.database.list('/users');
     }
    
}