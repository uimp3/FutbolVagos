import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reservacion, ReservacionDetail } from '../models/reservacion.model';

@Injectable({
  providedIn: 'root'
})
export class ReservacionService {
  private apiUrl = `${environment.apiUrl}/reservaciones/`;

  constructor(private http: HttpClient) { }

  // Obtener todas las reservaciones
  getReservaciones(): Observable<ReservacionDetail[]> {
    return this.http.get<ReservacionDetail[]>(this.apiUrl);
  }

  // Obtener una reservacion por ID
  getReservacion(id: number): Observable<ReservacionDetail> {
    return this.http.get<ReservacionDetail>(`${this.apiUrl}${id}/`);
  }

  // Crear una nueva reservacion
  createReservacion(reservacion: Reservacion): Observable<Reservacion> {
    return this.http.post<Reservacion>(this.apiUrl, reservacion);
  }

  // Actualizar una reservacion existente
  updateReservacion(id: number, data: Partial<ReservacionDetail>): Observable<ReservacionDetail> {
    console.log('Llamando a updateReservacion para ID:', id, 'con datos:', data);
    return this.http.patch<ReservacionDetail>(`${this.apiUrl}${id}/`, data);
  }

  // Eliminar una reservacion
  deleteReservacion(id: number): Observable<void> {
    console.log('Llamando a deleteReservacion para ID:', id);
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // Buscar reservaciones por término
  searchReservaciones(termino: string): Observable<ReservacionDetail[]> {
    return this.http.get<ReservacionDetail[]>(`${this.apiUrl}search/?q=${termino}`);
  }

  // Obtener reservaciones por ID de cliente 
  getReservacionesByCliente(clienteId: number): Observable<ReservacionDetail[]> {
 
    return this.http.get<ReservacionDetail[]>(`${this.apiUrl}by_cliente/${clienteId}/`);
  }


  getWeeklyReservations(): Observable<ReservacionDetail[]> {
    console.log('Llamando a getWeeklyReservations...');
    

    return new Observable<ReservacionDetail[]>(observer => {
      console.log('getWeeklyReservations: Devolviendo datos de ejemplo/vacíos.');
      observer.next([]); 
      observer.complete();
    });
  }
}
