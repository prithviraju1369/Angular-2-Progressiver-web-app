import { Component, OnInit } from '@angular/core';
import { IndexService } from './index.service';
import { Router } from '@angular/router';
@Component({
    selector: 'index',
    template: '',
    providers: [IndexService]
})
export class IndexComponent implements OnInit {
    db: any;
    // redirect to home page
    constructor(private router: Router, private _indexService: IndexService) {

    }

    ngOnInit() {
        this.db = this._indexService.PouchInstance();
        this.syncChanges();
    }

    syncChanges() {
        let self=this;
        this.db.allDocs({ include_docs: true, descending: true }, function (err, docs) {
            if (err) {
                console.log(err);
                return err;
            }
            if (docs && docs.rows.length > 0) {
                if (docs.rows[0].doc.sList) {
                    self.router.navigate(['lists']);
                } else {
                    self.router.navigate(['home']);
                }
            } else {
                self.router.navigate(['home']);
            }
        });
    }

};