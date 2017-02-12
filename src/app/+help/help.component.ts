import { Component, OnInit } from '@angular/core';
import { SharedComponent } from './../shared/shared.component';
import { UsersService } from './../services/users.service';
import {user} from './../model/user';

import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';


@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
    private abtusers:user[];
    constructor(public _userService: UsersService) {


    }

    ngOnInit() {
        // this.getUsers();
    }
     

}