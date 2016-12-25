import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'app works!';

  ismobile:boolean=true;

  ngAfterViewInit() {
    this.detectDevice()
  }

  detectDevice(){
    if(window.innerWidth <= 800 && window.innerHeight <= 600){ 
      return this.mobileDevice(); 
    }else{
      return this.desktopDevice()
    }
  }

  mobileDevice(){
      this.ismobile=true;
  }

  desktopDevice(){
      this.ismobile=false;
  }
}






