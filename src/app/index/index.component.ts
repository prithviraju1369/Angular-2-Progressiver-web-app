import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
@Component({
    selector: 'index',
    template:''
})
export class IndexComponent implements OnInit {
    
    // redirect to home page
    constructor(private router: Router) {
        this.router.navigate(['home']);
    }

    ngOnInit() {
        
    }
     

};