import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { CarsComponent } from './cars.component';
import { PlaceComponent } from './place/place.component';
import { PlaceDetailComponent } from './place-detail/place-detail.component';
import { RegisterComponent } from './register/register.component';
import { CarComponent } from './car/car.component';
import { CarDetailComponent } from './car-detail/car-detail.component';

@NgModule({
  declarations: [
    CarsComponent,
    PlaceComponent,
    PlaceDetailComponent,
    RegisterComponent,
    CarComponent,
    CarDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    CarsComponent
  ],
  providers: [],
  bootstrap: [CarsComponent]
})
export class CarsModule { }
