import { Component, OnInit, ViewChild,OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';

declare var PouchDB: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy {
  title = 'app works!';
  localUser:any;
  db:any;
  private url;
  private user;
  private sList;
  @ViewChild('start') start;

  constructor(private route: ActivatedRoute,
        private router: Router){
    this.db = new PouchDB("sList");
  }


  
  isMobile;

  ngOnInit() {
    let self=this;
    debugger
    this.user=this.route.params
            .switchMap((params: Params) => {
              debugger
                this.url = params['email'];
                this.sList = params['id'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        this.user.subscribe(c=>console.log(c));
    this.detectDevice();
      
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
          self.setLocalUser(docs.rows[0].doc);
        }
      });
  }

  ngOnDestroy(){
  }

  hideNav(){
    this.start.toggle();
  }

  setLocalUser(obj){
    if(obj)
      this.localUser=obj.user;
  }

  detectDevice(){
    if(window.innerWidth <= 800){ 
      this.isMobile=true;
    }else{
      this.isMobile=false;
    }
  }

  
}






