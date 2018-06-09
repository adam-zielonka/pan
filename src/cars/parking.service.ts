import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Parking } from './parking';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  private parkingURL = 'https://web20.adamzielonka.pro/api/parking/';

  constructor(
    private http: HttpClient
  ) { }
  getParking(): Observable<Parking[]> {
    // return of(PARKING)
    return this.http.get<Parking[]>(this.parkingURL)
  }
}
