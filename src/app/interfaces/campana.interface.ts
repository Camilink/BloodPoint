export interface CampanaActiva {
    id_campana: number;
    fecha_campana: string;
    fecha_termino: string;
    apertura: string;
    cierre: string;
    meta: string;
    latitud: string;
    longitud: string;
    id_centro: number;
    centro: string;
    id_solicitud: number | null;
    validada: boolean;
    estado: string;
  }
  