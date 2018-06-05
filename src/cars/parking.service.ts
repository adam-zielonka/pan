import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Parking } from './parking';
import { PARKING } from './mock-parking';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  constructor() { }
  getParking(): Observable<Parking[]> {
    return of(PARKING)
  }
}
