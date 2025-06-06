export interface Cliente {
    id?: number;
    nombre: string;
    cedula: string;
    telefono: string;
    email?: string;
    fecha_registro?: Date;
}
