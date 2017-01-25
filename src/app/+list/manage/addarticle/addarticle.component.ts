import { Component, OnInit ,Inject} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SharedComponent } from './../../../shared/shared.component';
import { ListService } from './../../list.service';
import { user } from './../../../model/user';
import { Observable } from 'rxjs/Observable';
import { list } from './../../../model/user';

import {AngularFire,FirebaseListObservable,FirebaseObjectObservable,FirebaseRef} from 'angularfire2';

export class catalog{
    constructor(
        public id?: string,
        public name?: string,
        public articles?:Array<any>    
        ){}   
}

@Component({
    selector: 'addarticle',
    templateUrl:'./addarticle.component.html',
    styleUrls: ['./addarticle.component.scss'],
    providers: [ListService]
})

export class AddArticleComponent implements OnInit {
    private url;
    private user;
    af: AngularFire;
    catalogs:catalog[]=[];
    constructor(@Inject(FirebaseRef) public fb,  af: AngularFire,
        public _listService: ListService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.af = af;
    }

    ngOnInit() {
        this.user=this.route.params
            .switchMap((params: Params) => {
                this.url = params['email'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(c=>console.log(c));
        this.getCatalog();
    }

    getCatalog(){
        let catalogs$=this._listService.getAllDefaultCatalog();
        // .map(x=>{
        //    return x;
        // });

        //  catalogs$.subscribe(x=>{
        //     this.catalogs=x;
        //     if(this.catalogs && this.catalogs.length>0){
        //         this.catalogs.forEach(function(item){
        //             for (var property in item.articles) {
        //                 if (item.articles.hasOwnProperty(property)) {
        //                     var a=this._listService.getArticles(item.articles[property]);
        //                     debugger
        //                     item.articlesName.push()
        //                 }
        //             }
        //         })
        //     }
        // });

        let self=this;
        
        let items = this.af.database.list('/catalog/english')
        .map(x=>x).subscribe(x=>{
            if(x!=undefined){
                x.forEach(function(item){
                    let it:catalog={};
                    it.id=item.$key;
                    it.name=item.name;
                    it.articles=[];
                    self.pushToCatalog(it);
                    for (var property in item.articles) {
                        if (item.articles.hasOwnProperty(property)) {
                            self.af.database.object(`/articles/${item.articles[property]}`).subscribe(x=>{
                                if(x!=undefined){
                                    self.catalogs.forEach(function(ob){
                                        if(ob.name==item.name){
                                            self.changeInCatalogs(x,item.$key);
                                        }
                                    });
                                }
                            })
                        }
                    }
                })
            }
        });



    }

    pushToCatalog(item){
        let updated:boolean=false;
        for(let i=0;i<this.catalogs.length;i++){
            if(this.catalogs[i].id==item.id)
            {
                this.catalogs[i].name=item.name;
                updated=true;
            }
        }
        if(!updated)
            this.catalogs.push(item);
        
    }

    changeInCatalogs( item, id ) {
        for(var i = 0; i <= this.catalogs.length; i++){
            if(this.catalogs[i] && this.catalogs[i].id==id){
                var obj:catalog={};
                obj.name=item.$value;
                obj.id=item.$key;
                this.pushToArticles(obj,this.catalogs[i].id);
                console.log(this.catalogs);
            }
        }
    }

    pushToArticles(item,id){
        let updated:boolean=false;
        for(let i=0;i<this.catalogs.length;i++){
            if(this.catalogs[i].id==id)
            {
                for(let j=0;j<this.catalogs[i].articles.length;j++)
                {
                    if(this.catalogs[i].articles[j].id==item.id){
                        this.catalogs[i].articles[j].name=item.name;
                        updated=true;
                    }
                }
                if(!updated)
                {
                    this.catalogs[i].articles.push(item);
                }
            }
        }
    }

    toggleCatalog(evt){
        let parentNode=evt.target.parentElement;
        let currentEle=parentNode.getElementsByClassName('slist-articles')[0];
        if(currentEle.style.display=='none'){
            currentEle.style.display='block';
        }else{
            currentEle.style.display='none';
        }

    }


}