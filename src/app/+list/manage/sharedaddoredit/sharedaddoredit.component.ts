import { Component, OnInit, Input } from '@angular/core';



@Component({
    selector: 'sharedaddoredit',
    templateUrl:'./sharedaddoredit.component.html',
    styleUrls: ['./sharedaddoredit.component.scss'],
})

export class SharedAddOrEditComponent {
    @Input() title:string;
    @Input() list: Array<any>;
}