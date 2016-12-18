import { Component, OnInit } from '@angular/core';
import { SharedComponent } from './../shared/shared.component';
import { UsersService } from './../services/users.service';
import {user} from './../model/user';

import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';


@Component({
  selector: 'about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
    private abtusers:user[];
    constructor(public _userService: UsersService) {


    }

    ngOnInit() {
        this.getUsers();
    }
     getUsers(){
        // Get all comments
         this._userService.getUsers()
                           .subscribe(
                               users => this.abtusers = users, //Bind to view
                                err => {
                                    // Log errors if any
                                    console.log(err);
                                });
    }

}