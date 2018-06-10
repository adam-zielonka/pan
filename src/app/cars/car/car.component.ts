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
  car : Pojazd
  editCar : Pojazd

  constructor(
    private parkingService : ParkingService
  ) { }

  ngOnInit() {
    this.editCar = new Pojazd()
    this.parkingService.getCars().subscribe(cars => this.cars = cars)
  }

  editMode(car : Pojazd) {
    this.car = car
    this.editCar = Object.assign({}, car)
  }

  isEdit(car : Pojazd) {
    if(!this.editCar) return false
    return car._id == this.editCar._id
  }

  afterEnd() {
    for (const key in this.car)
      if (this.car.hasOwnProperty(key))
        this.car[key] = this.editCar[key]
    this.editCar._id = undefined
  }

  cancel() {
    this.editCar._id = undefined
  }

  save() {
    this.parkingService.updateCar(this.editCar).subscribe(() => this.afterEnd())
  }

  add(car : Pojazd) {
    this.parkingService.addCar(car).subscribe(car => {
      if(car._id)
        this.cars.push(car)
    })
  }

  delete(car : Pojazd) {
    this.cars = this.cars.filter(c => c !== car)
    this.parkingService.deleteCar(car).subscribe()
  }

}
