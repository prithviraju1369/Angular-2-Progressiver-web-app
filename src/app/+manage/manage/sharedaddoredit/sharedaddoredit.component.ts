import { Component, OnInit, Input,Output,EventEmitter} from '@angular/core';

import { Router } from '@angular/router';


@Component({
    selector: 'sharedaddoredit',
    templateUrl:'./sharedaddoredit.component.html',
    styleUrls: ['./sharedaddoredit.component.scss'],
})

export class SharedAddOrEditComponent {
    @Input() title:string;
    @Input() list: Array<any>;
	@Input() titleValue:string;
	@Input() modelValue:string;
	@Output() onSaved = new EventEmitter<any>();
	
	constructor(private router: Router){

	}

	Save(){
		let obj:any={};
		obj.name=this.titleValue;
		obj.order=this.modelValue;
		this.onSaved.emit(obj);
	}

	Cancel(){
		this.router.navigate(['manage']);
	}
	
}