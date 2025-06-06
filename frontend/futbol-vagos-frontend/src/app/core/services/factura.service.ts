import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Factura, FacturaDetail } from '../models/factura.model';
import { ReservacionDetail } from '../models/reservacion.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = `${environment.apiUrl}/facturas/`;
  private reservacionApiUrl = `${environment.apiUrl}/reservaciones/`;

  constructor(private http: HttpClient) { }

  // Obtener todas las facturas
  getFacturas(): Observable<FacturaDetail[]> {
    return this.http.get<FacturaDetail[]>(this.apiUrl);
  }

  // Obtener una factura por ID
  getFactura(id: number): Observable<FacturaDetail> {
    return this.http.get<FacturaDetail>(`${this.apiUrl}${id}/`);
  }

  // Crear una nueva factura
  createFactura(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(this.apiUrl, factura);
  }

  // Actualizar una factura existente
  updateFactura(id: number, factura: Factura): Observable<Factura> {
    return this.http.put<Factura>(`${this.apiUrl}${id}/`, factura);
  }

  // Eliminar una factura
  deleteFactura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // Buscar facturas por término
  searchFacturas(termino: string): Observable<FacturaDetail[]> {
    return this.http.get<FacturaDetail[]>(`${this.apiUrl}search/?q=${termino}`);
  }

  // Método para obtener reservaciones pendientes 
  getReservacionesPendientes(): Observable<ReservacionDetail[]> {
    return this.http.get<ReservacionDetail[]>(`${this.reservacionApiUrl}?estado=Confirmada`);
  }

  // Método para buscar reservaciones pendientes
  searchReservacionesPendientes(term: string): Observable<ReservacionDetail[]> {
    return this.http.get<ReservacionDetail[]>(`${this.reservacionApiUrl}?search=${term}&estado=Confirmada`);
  }
}
