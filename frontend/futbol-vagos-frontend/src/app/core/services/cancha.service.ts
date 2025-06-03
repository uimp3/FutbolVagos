import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cancha, CanchaWithSede } from '../models/cancha.model';

@Injectable({
  providedIn: 'root'
})
export class CanchaService {
  private apiUrl = `${environment.apiUrl}/canchas/`;

  constructor(private http: HttpClient) { }

  // Obtener todas las canchas
  getCanchas(): Observable<CanchaWithSede[]> {
    return this.http.get<CanchaWithSede[]>(this.apiUrl);
  }

  // Obtener una cancha por ID
  getCancha(id: number): Observable<CanchaWithSede> {
    return this.http.get<CanchaWithSede>(`${this.apiUrl}${id}/`);
  }

  // Crear una nueva cancha
  createCancha(cancha: Cancha): Observable<Cancha> {
    return this.http.post<Cancha>(this.apiUrl, cancha);
  }

  // Actualizar una cancha existente
  updateCancha(id: number, cancha: Cancha): Observable<Cancha> {
    return this.http.put<Cancha>(`${this.apiUrl}${id}/`, cancha);
  }

  // Eliminar una cancha
  deleteCancha(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // Buscar canchas por término
  searchCanchas(termino: string): Observable<CanchaWithSede[]> {
    return this.http.get<CanchaWithSede[]>(`${this.apiUrl}search/?q=${termino}`);
  }

  // Obtener canchas por sede
  getCanchasBySede(sedeId: number): Observable<CanchaWithSede[]> {
    return this.http.get<CanchaWithSede[]>(`${this.apiUrl}/sede/${sedeId}/`);
  }
}
