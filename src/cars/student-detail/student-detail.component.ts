import { Component, OnInit, Input, Output } from '@angular/core';
import { Student } from '../student';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  @Input() student: Student
  @Input() avg

  updateAvg() {
    this.avg = 0
    this.student.grades.forEach(e => this.avg += e.value)
    this.avg /= this.student.grades.length ? this.student.grades.length : 1
    console.log(this.avg)
  }

  constructor() { }

  ngOnInit() {
  }

}
