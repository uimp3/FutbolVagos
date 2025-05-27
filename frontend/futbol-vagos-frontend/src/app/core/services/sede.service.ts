import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sede } from '../models/sede.model';
import { environment } from '../../../environments/environment';

// Servicio que maneja todas las operaciones CRUD para las sedes
// @Injectable indica que este servicio puede ser inyectado en otros componentes
@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class SedeService {
  // URL base para las operaciones de API relacionadas con sedes
  private apiUrl = `${environment.apiUrl}/sedes`;

  constructor(private http: HttpClient) { }

  // Obtiene la lista de todas las sedes
  getSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(this.apiUrl);
  }

  // Obtiene una sede específica por su ID
  getSede(id: number): Observable<Sede> {
    return this.http.get<Sede>(`${this.apiUrl}/${id}`);
  }

  // Crea una nueva sede
  createSede(sede: Sede): Observable<Sede> {
    return this.http.post<Sede>(this.apiUrl, sede);
  }

  // Actualiza una sede existente
  updateSede(id: number, sede: Sede): Observable<Sede> {
    return this.http.put<Sede>(`${this.apiUrl}/${id}`, sede);
  }

  // Elimina una sede por su ID
  deleteSede(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
