import { Injectable, Inject, OnInit} from '@angular/core';
import { Observable } from 'rxjs/Rx';
declare var PouchDB: any;

@Injectable()
export class AppService {
    
    
    constructor() {
        
    }

    PouchInstance(){
        return new PouchDB("sList");
    }
    
}