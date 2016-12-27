import { Component, OnInit } from '@angular/core';
import { SharedComponent } from './../../shared/shared.component';
import { CreateService } from './../create.service';
import {user} from './../../model/user';

import { Observable } from 'rxjs/Observable';

import { list } from './../../model/user';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

@Component({
    selector: 'create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    providers:[CreateService]
})
export class CreateComponent implements OnInit {
    // shoppingList :list; 
    model=new list();
    title:string;
    users=[];
    usersFirebase=[];
    initialEmail:string;
    inviteUsers:Array<string>;
    languages = ['English', 'German'];
    exists:user[];
    notexists:user[];
    array:Array<any>=[];
    sList:Array<any>=[];
    constructor(
        public _createService: CreateService) {
    }

    ngOnInit() {
        this.getUsers();
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
    usersChange(ind,val){
        this.users[ind]=val;
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
        sListCreated$.subscribe(x=>this.sList=x);
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
                })
                .map(data=>{
                    this.sendEmail(data);
                    return this.sendKeys(data);
                });
                
        let reqSubscribe=request$.subscribe(
                val=>{
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