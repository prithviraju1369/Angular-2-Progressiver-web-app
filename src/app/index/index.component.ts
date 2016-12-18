import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
@Component({
    selector: 'index',
    template:''
})
export class IndexComponent implements OnInit {
    
    constructor(private router: Router) {
        this.router.navigate(['home']);
    }

    ngOnInit() {
        
    }
     

};