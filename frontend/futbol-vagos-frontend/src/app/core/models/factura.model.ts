export interface Factura {
  id?: number;
  reservacion: number; 
  cliente: number; 
  fecha_emision?: string; 
  subtotal?: number;
  impuestos?: number;
  total: number;
  metodo_pago: 'Efectivo' | 'Tarjeta' | 'Transferencia';
}

// Interfaz para mostrar datos relacionados
export interface FacturaDetail extends Factura {
  cliente_nombre?: string; 
  reservacion_detalle?: string; 
}
