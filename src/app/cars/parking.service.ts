import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Parking, Pojazd, Miejsce } from './parking';
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

  updatePlace(place : Parking) : Observable<any> {
    return this.http.put(this.parkingURL + place._id, place, { headers : this.headers }).pipe(
      tap(_ => console.log(`aktualizacja mejsca parkingowego o id=${place._id}`)),
      catchError(this.handleError<any>('updatePlace'))
    )
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
      tap(_ => console.log(`usunięcie pojazdu id=${car._id}`)),
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
