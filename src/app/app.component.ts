import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'app works!';

  ngAfterViewInit() {
  }

  detectDevice(){
    if(window.innerWidth <= 800 && window.innerHeight <= 700){ 
      return true; 
    }else{
      return false;
    }
  }

  
}






