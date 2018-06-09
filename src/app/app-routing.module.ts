import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanComponent } from '../pan/pan.component';
import { CarsComponent } from '../cars/cars.component';
import { CarComponent } from '../cars/car/car.component';
import { CarDetailComponent } from '../cars/car-detail/car-detail.component';

const routes: Routes = [
  { path: 'pan', component: PanComponent },
  { path: 'parking', component: CarsComponent },
  { path: 'cars', component: CarComponent },
  { path: 'cars/:id', component: CarDetailComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
