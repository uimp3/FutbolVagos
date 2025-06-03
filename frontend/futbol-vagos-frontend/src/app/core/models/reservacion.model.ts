export interface Reservacion {
  id?: number;
  cliente: number; // ID del cliente
  cancha: number; // ID de la cancha
  fecha: string; // Usaremos string para la fecha (ISO 8601)
  hora: string; // Usaremos string para la hora (HH:mm)
  estado: 'Confirmada' | 'Cancelada' | 'Pagada';
  monto_total: number;
  fecha_creacion?: string; // Usaremos string para la fecha y hora (ISO 8601)
}

// Interfaz para mostrar datos relacionados (opcional, si la API los proporciona)
export interface ReservacionDetail extends Reservacion {
  cliente_nombre?: string; // Nombre del cliente
  cancha_nombre?: string; // Nombre/descripción de la cancha
}
