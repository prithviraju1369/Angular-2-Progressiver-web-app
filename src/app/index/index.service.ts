import { Injectable, Inject, OnInit} from '@angular/core';
declare var PouchDB: any;

@Injectable()
export class IndexService {
    
    
    constructor() {
        
    }

    PouchInstance(){
        return new PouchDB("sList");
    }
    
}