import { Component, OnInit } from '@angular/core';
import { Pojazd } from '../parking';
import { ParkingService } from '../parking.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  cars : Pojazd[]

  constructor(
    private parkingService : ParkingService
  ) { }

  ngOnInit() {
    this.parkingService.getCars().subscribe(cars => this.cars = cars)
  }

}
