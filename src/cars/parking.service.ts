import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Parking, Pojazd } from './parking';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, map, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  private apiURL = 'https://web20.adamzielonka.pro/api/'
  private parkingURL = this.apiURL + 'parking/'
  private carsURL =  this.apiURL + 'car/'
  private headers = new HttpHeaders()

  constructor(
    private http: HttpClient
  ) {
    this.headers = this.headers.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjViMWJjNGYzMzI1MmQ1Mjk2MTJhY2UzNSIsInN1YiI6ImFkbWluIn0.rvjCthOwY0FA7mdoXq2LUOH7fuQGMh8IccRpvZJjNR0");
    this.headers = this.headers.append('Content-Type','application/json')
  }

  getParking() : Observable<Parking[]> {
    return this.http.get<Parking[]>(this.parkingURL)
  }

  getCars() : Observable<Pojazd[]> {
    return this.http.get<Pojazd[]>(this.carsURL)
  }

  getCar(id) : Observable<Pojazd> {
    return this.http.get<Pojazd>(this.carsURL + id)
  }

  updateCar(car : Pojazd) : Observable<any> {
    return this.http.put(this.carsURL + car._id, car, { headers : this.headers }).pipe(
      tap(_ => console.log(`aktualizacja pojazdu o id=${car._id}`)),
      catchError(this.handleError<any>('updateCar'))
    )
  }

  addCar(car : Pojazd): Observable<Pojazd> {
    return this.http.post<Pojazd>(this.carsURL, car, { headers : this.headers }).pipe(
      tap((car: Pojazd) => console.log(`dodanie pojazdu o id=${car._id}`)),
      catchError(this.handleError<Pojazd>('addCar'))
    )
  }

  deleteCar(car : Pojazd): Observable<Pojazd> {
    return this.http.delete<Pojazd>(this.carsURL + car._id, { headers : this.headers }).pipe(
      tap(_ => console.log(`deleted hero id=${car._id}`)),
      catchError(this.handleError<Pojazd>('deletePojazd'))
    )
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error)
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }
}
