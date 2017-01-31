import { Injectable, Inject}     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {user,list} from './../model/user';

import { AngularFire, FirebaseListObservable,FirebaseObjectObservable, FirebaseRef} from 'angularfire2';

// Import RxJs required methods
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

@Injectable()
export class CreateService {

    private users = '/users';
    af: AngularFire;
    items: FirebaseListObservable<any[]>;
    testArry: Observable<Array<user>>;
    invitedUsers: Array<any> = [];
    private sList: any;
    private sListUsersKey: any;
    roorRef;
    sListUsersRef;
    mailedUsers:Array<any>=[];
    constructor( @Inject(FirebaseRef) public fb, private http: Http, af: AngularFire) {
        this.af = af;
        this.roorRef = fb.database().ref('users');
        this.sListUsersRef=fb.database().ref('sListUsers');
    }

    createSList(list: list): FirebaseObjectObservable<any> {
        const sListRef = this.af.database.list(`sList`);

        this.sList = sListRef.push(list);
        this.sListUsersKey = this.sList.child("users");

        return this.af.database.object(`sList/${this.sList.getKey()}`);
    }
    resetSList():void{
        this.resetInvitedUsers();
        this.resetMailedUsers;
    }
    resetInvitedUsers(): void {
        this.invitedUsers.length = 0;
    }
    resetMailedUsers(): void {
        this.mailedUsers.length = 0;
    }

    createSListUser(usr: any): void {
        console.log(this.sList);
        let sListKey=usr.$key;
        let insertData={};
        insertData[sListKey]=true;
        let testme = this.af.database.object(`sListUsers`);
        if (this.invitedUsers.indexOf(usr.$key) < 0) {
            this.invitedUsers.push(usr.$key);
            // this.sListUsersKey.update(this.invitedUsers);
            this.sListUsersRef.child(this.sList.getKey()).update(insertData);
            // this.sendEmailToUser(usr.$key);
        }
    }
    sendEmailToUser(usr:any):void{
        if (this.mailedUsers.indexOf(usr.$key) < 0) {
            this.mailedUsers.push(usr.$key);
             var result = this.http.post('/api/email',usr)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
            result.subscribe(x=>console.log(x));
        }
    }
    addtoFirebase(element: user): void {
        const users = this.af.database.list(`users`);
        users.push(element);
    }

    getItemFromFirebase(email: string): Observable<user> {
        let tempUsr: user;
        const usr = this.af.database.list('users', {
            query: {
                orderByChild: 'email',
                equalTo: email,
                limitToFirst: 1
            }
        }).map(x=> {
            if (x && x.length > 0) {
                return x[0];
            } else {
                return tempUsr;
            }
        });
        return usr;
    }
    addIfNotExists(email: string): Observable<user[]> {
        const usr = this.af.database.list('users', {
            query: {
                orderByChild: 'email',
                equalTo: email
            }
        });
        return usr;
    }

    getUsers(): Observable<user[]> {
        // ...using get request
        var result = this.http.get(this.users)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return result;

    }
    getUsersFirebase(): Observable<any[]> {
        var result = this.af.database.list('/users');
        return result;
    }
    createFirebaseCatalog(catalog:Object){
         const addArticle = this.af.database.list(`articles`);
         const addCatalog = this.af.database.list(`catalog/english`);
         for (var property in catalog) {
            if (catalog.hasOwnProperty(property)) {
                let insertData={};
                let myArtcileArr=[];
                let myCatalogObj={};
                let catalogObj={};
                catalogObj["name"]=property;
				catalogObj["isDefault"]=true;
                catalogObj["articles"]=[];
               
                let propertyAdded=addCatalog.push(catalogObj)
                for(var i=0;i<catalog[property].length;i++)
                {
                      let val=catalog[property][i];
                      var obj={
                          name:val,
                          isDefault:true
                      }
                      let articleAdded= addArticle.push(obj);
                      var key=articleAdded.key;
                      insertData[key]=true;
                      let addToCatalog=this.af.database.list(`catalog/english/${propertyAdded.key}/articles`)
                      addToCatalog.push(key);
                      myArtcileArr.push(insertData);
                      catalogObj["articles"].push(key);
                }
            }
        }
    }
    
}