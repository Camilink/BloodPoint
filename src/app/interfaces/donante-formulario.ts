export interface DonanteFormulario {
    id?: number;
    nombreCompleto: string;
    correoElectronico: string;
    fechaNacimiento: string;
    tipoSangre: string;
    telefono: string;
    sexoBiologico: 'H' | 'M';
    nuevoDonante: boolean;
    aceptaTerminos: boolean;
    recibirNotificaciones: boolean;
    ultimaDonacion?: string;
    cantidadDonada?: number;
    logros?: string[];
}