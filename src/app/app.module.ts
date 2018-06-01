import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PanModule } from '../pan/pan.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PanModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
