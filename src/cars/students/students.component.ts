import { Component, OnInit, Output, Input } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students: Student[]
  selectedStudent: Student
  avg

  onSelect(studnent: Student): void {
    this.selectedStudent = studnent
    this.updateAvg()
  }

  updateAvg() {
    this.avg = 0
    this.selectedStudent.grades.forEach(e => this.avg += e.value)
    this.avg /= this.selectedStudent.grades.length
    console.log(this.selectedStudent)
  }

  constructor(private studentService: StudentService) {
    
  }

  getStudent() {
    this.studentService.getStudents().subscribe(students => this.students = students)
  }

  ngOnInit() {
    this.getStudent()
  }

}
