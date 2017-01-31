import { Component, OnInit, Input,Output,EventEmitter} from '@angular/core';



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
	
	Save(){
		let obj:any={};
		obj.name=this.titleValue;
		obj.order=this.modelValue;
		this.onSaved.emit(obj);
	}
	
}