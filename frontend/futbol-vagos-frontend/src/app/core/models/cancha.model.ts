export interface Cancha {
    id?: number;
    sede: number;  // ID de la sede
    precio_hora: number;
    capacidad_jugadores: number;
    estado: 'Disponible' | 'En mantenimiento';
}

export interface CanchaWithSede extends Cancha {
    sede_nombre?: string;  // Nombre de la sede para mostrar
}
