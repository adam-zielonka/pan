import { Component, OnInit, Input } from '@angular/core';
import { Parking, Miejsce } from '../parking';
import { ParkingService } from '../parking.service';

@Component({
  selector: 'car-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.css']
})
export class PlaceDetailComponent implements OnInit {
  @Input() place: Parking
  isSave : boolean = false

  constructor(
    private parkingService : ParkingService
  ) { }

  getName(m: Miejsce) : string {
    return `${m.sektor}${m.linia}${m.pozycja}`
  }

  save() {
    this.isSave = true
    this.parkingService.updatePlace(this.place).subscribe(() => {
      this.isSave = false
    })
  }

  ngOnInit() {
  }

}
