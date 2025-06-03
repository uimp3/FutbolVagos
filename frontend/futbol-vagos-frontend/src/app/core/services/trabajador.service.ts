import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Trabajador } from '../models/trabajador.model';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  private apiUrl = `${environment.apiUrl}/trabajadores/`;

  constructor(private http: HttpClient) { }

  // Obtener todos los trabajadores
  getTrabajadores(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(this.apiUrl);
  }

  // Obtener un trabajador por ID
  getTrabajador(id: number): Observable<Trabajador> {
    return this.http.get<Trabajador>(`${this.apiUrl}${id}/`);
  }

  // Crear un nuevo trabajador
  createTrabajador(trabajador: Trabajador): Observable<Trabajador> {
    return this.http.post<Trabajador>(this.apiUrl, trabajador);
  }

  // Actualizar un trabajador existente
  updateTrabajador(id: number, trabajador: Trabajador): Observable<Trabajador> {
    return this.http.put<Trabajador>(`${this.apiUrl}${id}/`, trabajador);
  }

  // Eliminar un trabajador
  deleteTrabajador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // Buscar trabajadores por cédula
  searchTrabajadores(termino: string): Observable<Trabajador[]> {
    const searchUrl = `${this.apiUrl}search/`;
    return this.http.get<Trabajador[]>(searchUrl, { params: { q: termino } });
  }
}
