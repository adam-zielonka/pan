import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PanComponent } from './pan.component';

@NgModule({
  declarations: [
    PanComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    PanComponent
  ],
  providers: [],
  bootstrap: [PanComponent]
})
export class PanModule { }
