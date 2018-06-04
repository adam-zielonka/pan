import { Component, OnInit } from '@angular/core';
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
  avg = 0

  onSelect(studnent: Student): void {
    this.selectedStudent = studnent
    this.avg = 0
    this.selectedStudent.grades.forEach(e => this.avg += e.value)
    this.avg /= this.selectedStudent.grades.length
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
