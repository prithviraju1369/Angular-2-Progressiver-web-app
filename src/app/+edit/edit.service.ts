import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AngularFire, FirebaseListObservable,FirebaseObjectObservable, FirebaseRef} from 'angularfire2';
// Import RxJs required methods
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

import { user, list } from './../model/user';

@Injectable()
export class EditService {

    private users = '/users';
    af: AngularFire;
    
    items: FirebaseListObservable<any[]>;
    testArry: Observable<Array<user>>;
    invitedUsers: Array<any> = [];
    private sList: any;
    private sListKey: any;
    private sListUsersKey: any;
    roorRef;
    mailedUsers:Array<any>=[];
    constructor(  private http: Http, af: AngularFire) {
        this.af = af;
        
    }

    // edit shopping list by id
    editSList(key,list: list) {
        const sListRef = this.af.database.object(`sList/${key}`);
        this.sListKey=key;
        sListRef.update(list);
        
    }

    //reset inivied and emailed users
    resetSList():void{
        this.resetInvitedUsers();
        this.resetMailedUsers;
    }

    //reset inivied users
    resetInvitedUsers(): void {
        this.invitedUsers.length = 0;
    }
    //reset emailed users
    resetMailedUsers(): void {
        this.mailedUsers.length = 0;
    }
    //create Shopping list 
    createSListUser(usr: any): void {
        console.log(this.sList);
        let userKey=usr.$key;
        let insertData={};
        insertData[userKey]=true;
        let testme = this.af.database.object(`sListUsers`);
        if (this.invitedUsers.indexOf(usr.$key) < 0) {
            this.invitedUsers.push(usr.$key);
            // this.sListUsersKey.update(this.invitedUsers);
             let dataExists=this.af.database.list(`sListUsers/${this.sListKey}`).map(x=>x)
                .subscribe(x=>{
                    debugger
                    if (x && x.length>0){
                        let exists=false;
                        for (let i=0;i<x.length;i++){
                            if (x[i].$key==userKey){
                                exists=true;
                            }
                        }
                        if (!exists)
                            this.af.database.object(`sListUsers/${this.sListKey}`).update(insertData);
                            dataExists.unsubscribe();
                    }
                })
            // this.af.database.object(`sListUsers/${this.sListKey}`).update(insertData);
            // this.sendEmailToUser(usr.$key);
        }
    }

    // send email to user (not used)
    sendEmailToUser(usr:any):void{
        if (this.mailedUsers.indexOf(usr.$key) < 0) {
            this.mailedUsers.push(usr.$key);
             var result = this.http.post('/api/email',usr)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
            result.subscribe(x=>console.log(x));
        }
    }

    // add user to users collection
    addtoFirebase(element: user): void {
        const users = this.af.database.list(`users`);
        users.push(element);
    }

    //get user by email
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

    //add id user not exists
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

    // get all users
    getUsersFirebase(): Observable<any[]> {
        var result = this.af.database.list('/users');
        return result;
    }

    // dump default cataloge english
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
                for (var i=0;i<catalog[property].length;i++)
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
    // get shopping list by id
    getSListData(id){
        this.sListKey=id;
        return this.af.database.object(`sList/${id}`).map(x=>x);
    }

    //get shopping list users by id
    getSListUsersData(id){
        return this.af.database.object(`sListUsers/${id}`).map(x=>x);
    }

    // get userid by email
    getIdFromEmail(email){
        return this.af.database.list(`users`,{
            query:{
                orderByChild:'email',
                equalTo:email
            }
        }).map(x=>x);
    }

    //remove users from list
    removeUserFromsListUsers(key){
        let item=this.af.database.object(`sListUsers/${this.sListKey}/${key}`);
        item.remove();
    }
    
}