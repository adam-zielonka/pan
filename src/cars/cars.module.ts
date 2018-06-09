import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CarsComponent } from './cars.component';
import { PlaceComponent } from './place/place.component';
import { PlaceDetailComponent } from './place-detail/place-detail.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    CarsComponent,
    PlaceComponent,
    PlaceDetailComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    CarsComponent
  ],
  providers: [],
  bootstrap: [CarsComponent]
})
export class CarsModule { }
