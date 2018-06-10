import { Component, OnInit } from '@angular/core';
import { Pojazd } from '../parking';
import { ActivatedRoute } from '@angular/router';
import { ParkingService } from '../parking.service';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent implements OnInit {

  car : Pojazd

  constructor(
    private route: ActivatedRoute,
    private parkingService : ParkingService
  ) { 
    this.car = new Pojazd()
  }

  ngOnInit() {
    var id = this.route.snapshot.paramMap.get('id');
    this.parkingService.getCar(id).subscribe(car => this.car = car)
  }

}
