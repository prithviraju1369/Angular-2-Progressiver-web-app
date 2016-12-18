import { Component, OnInit } from '@angular/core';
import { SharedComponent } from './../shared/shared.component';
import { UsersService } from './../services/users.service';
import {user} from './../model/user';

import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    providers:[UsersService]
})
export class HomeComponent implements OnInit {
    private commentsUrl = 'api';
    private users:user[];
    constructor(
        public _userService: UsersService) {
    }

    ngOnInit() {
        this.getUsers();
    }
     getUsers(){
        // Get all comments
         this._userService.getUsersFirebase()
                           .subscribe(
                               users => this.users = users, //Bind to view
                                err => {
                                    // Log errors if any
                                    console.log(err);
                                });
    }

}