import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { SharedComponent } from './../../shared/shared.component';
import { CreateService } from './../create.service';
import {user} from './../../model/user';

import { Observable } from 'rxjs/Observable';

import { list } from './../../model/user';


import { FirebaseObjectObservable} from 'angularfire2';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

@Component({
    selector: 'create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    providers:[CreateService]
})
export class CreateComponent implements OnInit,OnDestroy {
    // shoppingList :list; 
    model=new list();
    title:string;
    users=[];
    usersFirebase=[];
    initialEmail:string;
    inviteUsers:Array<string>;
    emailedUsers:Array<any>=[];
    languages = ['English', 'German'];
    exists:user[];
    notexists:user[];
    array:Array<any>=[];
    sList:FirebaseObjectObservable<any>;
    reqSubscribe;
    sListKey:string;
    constructor(
        public _createService: CreateService,
        private router: Router) {
            this.router=router;
    }

    ngOnInit() {
        this.getUsers();
    }
    ngOnDestroy(){
        this.reqSubscribe.unsubscribe();
    }
    CreateList(){
        console.log(this.model);
        // this.model.users.push(this.model.email);
        // this.model.users.push(this.initialEmail);
        this.array=[];
        this.inviteUsers=JSON.parse(JSON.stringify(this.users));
        this.inviteUsers.push(this.initialEmail);
        this.inviteUsers.push(this.model.email);
        console.log(this.inviteUsers);
        this.CheckUsers();
    }
    addInvitedUsers(){
        this.users.push('');
    }
    customTrackBy(index: number, obj: any): any {
        return index;
    }
    ItemNotIn(obj){
        let exists=this.exists.filter(function(item){
            return item.email === obj.email;
        });
        if(exists && exists.length>0){
            return false;
        }else{
            return true;
        }
    }
    CheckUsers(){
        let self=this;
        for(let i=0;i<this.inviteUsers.length;i++){
            if(this.inviteUsers && this.inviteUsers[i]!=""){
                let obj={
                    email:this.inviteUsers[i]
                }
                self.array.push(obj);
            }
        }
        
        
        let sListTemp:list =this.model;
        sListTemp.users=[];
        let sListCreated$=self._createService.createSList(sListTemp);
        sListCreated$.subscribe(x=>{
            this.sList=x;
            this.sListKey=x.$key;
        });
        self._createService.resetSList();
        
        let request$=Observable.from(this.array)
                .mergeMap(data=>{
                    return this.addIfnotExists(data);
                })
                .mergeMap(data=>{
                    return this.getUserObjs(data);
                })
                .map(data=>{
                    this.createSListUser(data);
                    return this.sendKeys(data);
                });
                // .map(data=>{
                //     this.sendEmail(data);
                //     return this.sendKeys(data);
                // });
                
        this.reqSubscribe=request$.subscribe(
                val=>{
                    if(val){
                        self.emailedUsers.push(val);
                        if(self.emailedUsers.length == self.inviteUsers.length)
                        {
                            if(self.sList){
                                self.router.navigate([`list/${self.sListKey}`,{email:self.model.email}])
                            }
                        }
                    }
                    console.log(val);
                }
            );
        
    }
    sendKeys(data: any):Observable<any>{
        return data;
    }
    
    sendEmail(usr:any):void{
        if(usr){
            this._createService.sendEmailToUser(usr);
        }
    }
    
    createSListUser(usr) : void{
        if(usr){
            this._createService.createSListUser(usr);
            console.log(usr);
        }
    }
    getUserObjs(usr:user):Observable<user>{
        var self=this;
        return self._createService.getItemFromFirebase(usr.email)
            .map(x=>x);
    }
    
    addIfnotExists(usr:user):Observable<user> {
        var self=this;
        let exists=self.usersFirebase.filter((item)=>item.email==usr.email);
        if(exists && exists.length>0){}
        else{
            self._createService.addtoFirebase(usr);
        }
        let arr=[];
        arr.push(usr);
        return Observable.from(arr);
    }
    getUsers() {
        this._createService.getUsersFirebase()
            .subscribe(
                
            users => {
                this.usersFirebase = users;    
        }, //Bind to view
            err => {
                // Log errors if any
                console.log(err);
            });
    }

}