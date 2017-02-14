import { Component, OnInit, Input,Output,EventEmitter} from '@angular/core';

import { Router } from '@angular/router';


@Component({
    selector: 'sharedaddoredit',
    templateUrl:'./sharedaddoredit.component.html',
    styleUrls: ['./sharedaddoredit.component.scss'],
})


// manage module shared component
export class SharedAddOrEditComponent implements OnInit {
    @Input() title:string;
    @Input() list: Array<any>;
	@Input() titleValue:string;
	@Input() modelValue:string;
	@Input() showLanguage:Boolean;
	@Input() language:string;
	@Output() onSaved = new EventEmitter<any>();
	languages = ['Select catalog language','English', 'German'];
	constructor(private router: Router){
		
	}

	ngOnInit() {
		this.language=this.languages[0];
	}
	// save option click
	Save() {
		let obj:any={};
		obj.name=this.titleValue;
		obj.order=this.modelValue;
		if (this.showLanguage){
			obj.language=this.language;
		}
		this.onSaved.emit(obj);
	}
	// Cancel redirect to manage page
	Cancel() {
		this.router.navigate(['manage']);
	}
	
}