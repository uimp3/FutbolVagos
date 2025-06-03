import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reservacion, ReservacionDetail } from '../models/reservacion.model';

@Injectable({
  providedIn: 'root'
})
export class ReservacionService {
  private apiUrl = `${environment.apiUrl}/reservaciones`;

  constructor(private http: HttpClient) { }

  // Obtener todas las reservaciones
  getReservaciones(): Observable<ReservacionDetail[]> {
    return this.http.get<ReservacionDetail[]>(this.apiUrl);
  }

  // Obtener una reservacion por ID
  getReservacion(id: number): Observable<ReservacionDetail> {
    return this.http.get<ReservacionDetail>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva reservacion
  createReservacion(reservacion: Reservacion): Observable<Reservacion> {
    return this.http.post<Reservacion>(this.apiUrl, reservacion);
  }

  // Actualizar una reservacion existente
  updateReservacion(id: number, reservacion: Reservacion): Observable<Reservacion> {
    return this.http.put<Reservacion>(`${this.apiUrl}/${id}`, reservacion);
  }

  // Eliminar una reservacion
  deleteReservacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Buscar reservaciones por término
  searchReservaciones(termino: string): Observable<ReservacionDetail[]> {
    return this.http.get<ReservacionDetail[]>(`${this.apiUrl}/search?q=${termino}`);
  }
}
