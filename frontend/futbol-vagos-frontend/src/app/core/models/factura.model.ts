export interface Factura {
  id?: number;
  reservacion: number; // ID de la reservación
  cliente: number; // ID del cliente
  fecha_emision?: string; // Usaremos string para la fecha (ISO 8601)
  subtotal?: number;
  impuestos?: number;
  total: number;
  metodo_pago: 'Efectivo' | 'Tarjeta' | 'Transferencia';
}

// Interfaz para mostrar datos relacionados (opcional)
export interface FacturaDetail extends Factura {
  cliente_nombre?: string; // Nombre del cliente
  reservacion_detalle?: string; // Algún detalle de la reservación (ej: fecha y cancha)
}
