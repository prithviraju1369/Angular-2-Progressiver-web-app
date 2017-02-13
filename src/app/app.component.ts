import { Component, OnInit, ViewChild,OnDestroy,HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';

declare var PouchDB: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// App component initilization with OnInit and OnDestroy life cycle callbacks
export class AppComponent implements OnInit,OnDestroy {
  title = 'app works!';
  localUser:any;
  db:any;
  private url;
  private user;
  private sList;
  @ViewChild('start') start;
  
  // window resize check for the device dimenions
  @HostListener('window:resize', ['$event'])  onResize(event) {
    this.detectDevice();
  }

  constructor(private route: ActivatedRoute,
        private router: Router){
    this.db = new PouchDB("sList");
  }
 

  
  isMobile;

  // called on component creation
  ngOnInit() {
    let self=this;
    
    // get emal or slistid on page route if exists
    this.user=this.route.params
            .switchMap((params: Params) => {
                this.url = params['email'];
                this.sList = params['id'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(c=>console.log(c));

    this.detectDevice();
    // get user email id from local database(pouch db)
    this.syncChanges();

        
  }
  syncChanges(){
    let self=this;
    this.db.allDocs({include_docs: true, descending: true}, function(err, docs) {
        if(err){
          console.log(err);
          return err;
        }
        if(docs && docs.rows.length>0){
          self.sList=docs.rows[0].doc.sList;
          self.setLocalUser(docs.rows[0].doc);
        }
      });
  }

  goToShoppingLIst(){
    if(this.sList){
      this.router.navigate(['list',this.sList,{email:this.localUser}]);
    }else{
      this.router.navigate(['home']);
    }
  }

  ngOnDestroy(){
  }

  // hide side nav
  hideNav(){
    this.start.toggle();
  }

  setLocalUser(obj){
    if(obj)
      this.localUser=obj.user;
  }

  
  // device specifications for mobile
  detectDevice(){
    if(window.innerWidth <= 800){ 
      this.isMobile=true;
    }else{
      this.isMobile=false;
    }
  }

  
}






