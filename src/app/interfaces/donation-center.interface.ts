export interface Schedule {
  days: string;
  hours: string;
}
export interface DonationCenter {
  id_centro: number;
  nombre_centro: string;
  direccion_centro: string;
  comuna: string;
  telefono: string;
  fecha_creacion: string;
  created_at: string;
  id_representante: number;
  distancia?: string;
  coordenadas?: [number, number];
  horario_apertura?: string;  // Hacerlo opcional
  horario_cierre?: string;    // Hacerlo opcional
}