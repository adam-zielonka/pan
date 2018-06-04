import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Student } from '../student';

@Component({
  selector: 'app-student-grades',
  templateUrl: './student-grades.component.html',
  styleUrls: ['./student-grades.component.css']
})
export class StudentGradesComponent implements OnInit {
  @Input() student: Student
  @Input() avg
  @Output() updateAvg : EventEmitter<any> = new EventEmitter();

  usun(ocena){
    for(let i=0; i<this.student.grades.length; i++)
      if(this.student.grades[i] === ocena){
        this.student.grades.splice(i,1)
        break
      }
      this.updateAvg.emit(null)
  }



  constructor() { }

  ngOnInit() {
  }

}
