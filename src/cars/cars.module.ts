import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CarsComponent } from './cars.component';
import { StudentsComponent } from './students/students.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { StudentGradesComponent } from './student-grades/student-grades.component';

@NgModule({
  declarations: [
    CarsComponent,
    StudentsComponent,
    StudentDetailComponent,
    StudentGradesComponent
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
