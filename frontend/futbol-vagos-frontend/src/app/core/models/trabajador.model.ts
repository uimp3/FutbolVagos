export interface Trabajador {
  id?: number;
  nombre: string;
  cedula: string;
  telefono: string;
  email?: string;
  cargo: string;
  salario: number;
  fecha_registro?: string; 
}
