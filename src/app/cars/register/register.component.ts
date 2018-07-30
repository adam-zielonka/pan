import { Component, OnInit, Input } from '@angular/core';
import { Rejestr } from '../parking';

@Component({
  selector: 'car-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() register : Rejestr[]

  constructor() { }

  printDate(date) : String {
    if(date) return new Date(date).toString()
    else return ""
  }

  ngOnInit() {
  }

}