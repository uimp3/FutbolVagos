// Interfaz que define la estructura de datos de una Sede
// Esta interfaz debe coincidir con el modelo del backend (Django)
export interface Sede {
    id?: number;              // ID opcional (no se requiere al crear, solo al actualizar)
    nombre: string;           // Nombre de la sede
    direccion: string;        // Dirección física de la sede
    barrio?: string;          // Barrio opcional
    ciudad: string;           // Ciudad donde se encuentra la sede
    horario_apertura: string; // Hora de apertura en formato HH:mm
    horario_cierre: string;   // Hora de cierre en formato HH:mm
}
