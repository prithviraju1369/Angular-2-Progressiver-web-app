import { Component, OnInit, ViewChild,OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy {
  title = 'app works!';

  @ViewChild('start') start;
  
  isMobile;

  ngOnInit() {
    this.detectDevice();
  }

  ngOnDestroy(){
    
  }

  hideNav(){
    this.start.toggle();
  }

  detectDevice(){
    if(window.innerWidth <= 800){ 
      this.isMobile=true;
    }else{
      this.isMobile=false;
    }
  }

  
}






