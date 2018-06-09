import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Parking, Pojazd } from './parking';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  private apiURL = 'https://web20.adamzielonka.pro/api/'
  private parkingURL = this.apiURL + 'parking/'
  private carsURL =  this.apiURL + 'car/'

  constructor(
    private http: HttpClient
  ) { }

  getParking() : Observable<Parking[]> {
    return this.http.get<Parking[]>(this.parkingURL)
  }

  getCars() : Observable<Pojazd[]> {
    return this.http.get<Pojazd[]>(this.carsURL)
  }

  getCar(id) : Observable<Pojazd> {
    return this.http.get<Pojazd>(this.carsURL + id)
  }
}
