import { Component, OnInit } from '@angular/core';
import { SharedComponent } from './../../shared/shared.component';
import { UsersService } from './../../services/users.service';
import {user} from './../../model/user';

import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

@Component({
    selector: 'create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    providers:[UsersService]
})
export class CreateComponent implements OnInit {
    constructor(
        public _userService: UsersService) {
    }

    ngOnInit() {
    }
 

}