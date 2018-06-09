import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanComponent } from '../pan/pan.component';
import { CarsComponent } from '../cars/cars.component';

const routes: Routes = [
  { path: 'pan', component: PanComponent },
  { path: 'parking', component: CarsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
