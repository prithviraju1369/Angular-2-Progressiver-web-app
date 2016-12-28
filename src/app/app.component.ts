import { Component, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'app works!';

  @ViewChild('start') start;

  ngAfterViewInit() {
  }

  hideNav(){
    this.start.toggle();
  }

  detectDevice(){
    if(window.innerWidth <= 800){ 
      return true; 
    }else{
      return false;
    }
  }

  
}






