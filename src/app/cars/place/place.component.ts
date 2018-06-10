import { Component, OnInit, Output, Input } from '@angular/core';
import { Parking, Miejsce } from '../parking';
import { ParkingService } from '../parking.service';

@Component({
  selector: 'parking-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit {
  parking: Parking[]
  selectedPlace: Parking

  onSelect(place: Parking): void {
    this.selectedPlace = place
  }

  constructor(private parkingService: ParkingService) {
    
  }

  getName(m: Miejsce) : string {
    return `${m.sektor}${m.linia}${m.pozycja}`
  }

  getParking() {
    this.parkingService.getParking().subscribe(parking => this.parking = parking)
  }

  ngOnInit() {
    this.getParking()
  }

}
