import { NgModule } from '@angular/core';

import { IndexRoutingModule } from './index.routing';
import { IndexComponent }   from './index.component';

@NgModule({
  imports: [
    IndexRoutingModule
  ],
  exports: [],
  declarations: [IndexComponent]
})
export class IndexModule { }
