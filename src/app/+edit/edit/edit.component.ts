import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {MdSnackBar} from '@angular/material';
import { SharedComponent } from './../../shared/shared.component';
import { EditService } from './../edit.service';
import {user} from './../../model/user';

import { Observable } from 'rxjs/Observable';

import { list } from './../../model/user';
import {AngularFire,FirebaseListObservable,FirebaseObjectObservable,FirebaseRef} from 'angularfire2';


declare var PouchDB: any;

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    providers:[EditService,MdSnackBar]
})
export class EditComponent implements OnInit,OnDestroy {
    // shoppingList :list; 
    model=new list(false);
    title:string;
    users=[];
    af: AngularFire;
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
    snackBar;
    db:any;
    constructor(
        public _editService: EditService,
        private router: Router,snackBar: MdSnackBar,af: AngularFire,) {
            this.router=router;
            this.snackBar=snackBar;
            this.db = new PouchDB("sList");
            this.af=af;
    }

    ngOnInit() {
        this.getUsers();
        this.getSId();
        this.showSideMenu();
    }
    showSideMenu(){
        
        document.getElementById('edit').style.display='block';
        document.getElementById('clear').style.display='block';
        document.getElementById('finished').style.display='block';
        document.getElementById('delete').style.display='block';
    }

    getSId(){
        let self=this;
    this.db.allDocs({include_docs: true, descending: true}, function(err, docs) {
        if(err){
          console.log(err);
          return err;
        }
        if(docs && docs.rows.length>0){
            self.sList=docs.rows[0].doc.sList;
          self.setSid(docs.rows[0].doc);
          self.getSIdUsers(docs.rows[0].doc);
        }
      });
    }

    setSid(obj){
        let sListData=this._editService.getSListData(obj.sList);
        sListData.subscribe(x=>{
            if(x){
                this.model=x;
            }
        })
    }
    getSIdUsers(obj){
        let self=this;
        let sListData=this._editService.getSListUsersData(obj.sList);
        sListData.subscribe(x=>{
            if(x){
                for (var property in x) {
                        if (x.hasOwnProperty(property)) {
                            self.af.database.object(`/users/${property}`).subscribe(p=>{
                                debugger
                                if(p.email !=self.model.email)
                                this.users.push(p.email);
                            });
                        }
                    }
            }
        })
    }
    ngOnDestroy(){
        // this.reqSubscribe.unsubscribe();
    }
    EditList(){
        console.log(this.model);
        // this.model.users.push(this.model.email);
        // this.model.users.push(this.initialEmail);
        this.array=[];
        this.inviteUsers=JSON.parse(JSON.stringify(this.users));
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
        self.emailedUsers=[];
        for(let i=0;i<this.inviteUsers.length;i++){
            if(this.inviteUsers && this.inviteUsers[i]!=""){
                let obj={
                    email:this.inviteUsers[i]
                }
                self.array.push(obj);
            }
        }
        
        this.model.isFinished=false;
        let sListTemp:list =this.model;
        sListTemp.users=[];
        let sListCreated$=self._editService.editSList(this.sList,sListTemp);
        
        self._editService.resetSList();
        
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
                            if(self.sList) 
                            {
                                let userEmailKey=self.emailedUsers.find(self.findUserEmailKey,self);
                                self.router.navigate([`list/${self.sListKey}`,{email:userEmailKey.$key}])
                            }
                        }
                    }
                    console.log(val);
                }
            );
        // if(!window.navigator.onLine)
        // {
        //     self.snackBar.open('Shopping List will be Created and email will be sent, once device comes online, Don\'t close the Browser', 'Okay');
        // }
        
    }
    findUserEmailKey(item:any):boolean{
        return item.email==this.model.email;
    }
    sendKeys(data: any):Observable<any>{
        return data;
    }
    
    sendEmail(usr:any):void{
        if(usr){
            this._editService.sendEmailToUser(usr);
        }
    }
    
    createSListUser(usr) : void{
        if(usr){
            this._editService.createSListUser(usr);
            console.log(usr);
        }
    }
    getUserObjs(usr:user):Observable<user>{
        var self=this;
        return self._editService.getItemFromFirebase(usr.email)
            .map(x=>x);
    }
    
    addIfnotExists(usr:user):Observable<user> {
        var self=this;
        let exists=self.usersFirebase.filter((item)=>item.email==usr.email);
        if(exists && exists.length>0){}
        else{
            self._editService.addtoFirebase(usr);
        }
        let arr=[];
        arr.push(usr);
        return Observable.from(arr);
    }
    getUsers() {
        this._editService.getUsersFirebase()
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