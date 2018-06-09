import { Component, OnInit, Input } from '@angular/core';
import { Parking, Miejsce } from '../parking';

@Component({
  selector: 'car-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.css']
})
export class PlaceDetailComponent implements OnInit {
  @Input() place: Parking

  constructor() { }

  getName(m: Miejsce) : string {
    return `${m.sektor}${m.linia}${m.pozycja}`
  }

  ngOnInit() {
  }

}
