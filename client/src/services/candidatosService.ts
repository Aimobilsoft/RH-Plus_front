import { api } from './api';

export interface Candidato {
  id: number;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  tipoDocumento: string;
  telefono?: string;
  correoElectronico?: string;
  direccion?: string;
  fechaNacimiento?: string;
  sexo?: string;
  estadoCivil?: string;
  cargoAspirado?: string;
  eps?: string;
  arl?: string;
  fondoPension?: string;
  experiencia?: any[];
  educacion?: any[];
  
  // Original API fields for compatibility
  numero_documento?: string;
  tipo_documento?: string;
  correo_electronico?: string;
  fecha_nacimiento?: string;
  estado_civil?: string;
  cargo_aspirado?: string;
  fondo_pension?: string;
}

export const candidatosService = {
  getAll: async () => {
    try {
      const response = await api.post<{ filas: any[], mensaje: string, status: boolean }>('/candidatos');
      console.log('API Response getAll candidatos:', response);
      if (response && response.filas && Array.isArray(response.filas)) {
        // Map the API response to match our Typescript interface
        return response.filas.map(candidato => ({
          id: candidato.id,
          nombres: candidato.nombres,
          apellidos: candidato.apellidos,
          numeroDocumento: candidato.numero_documento,
          tipoDocumento: candidato.tipo_documento,
          telefono: candidato.telefono,
          correoElectronico: candidato.correo_electronico,
          direccion: candidato.direccion,
          fechaNacimiento: candidato.fecha_nacimiento,
          sexo: candidato.sexo,
          estadoCivil: candidato.estado_civil,
          cargoAspirado: candidato.cargo_aspirado,
          eps: candidato.eps,
          arl: candidato.arl,
          fondoPension: candidato.fondo_pension,
          experiencia: candidato.experiencia,
          educacion: candidato.educacion,
          // Keep original API fields for compatibility
          numero_documento: candidato.numero_documento,
          tipo_documento: candidato.tipo_documento,
          correo_electronico: candidato.correo_electronico,
          fecha_nacimiento: candidato.fecha_nacimiento,
          estado_civil: candidato.estado_civil,
          cargo_aspirado: candidato.cargo_aspirado,
          fondo_pension: candidato.fondo_pension
        }));
      }
      return [];
    } catch (error) {
      console.error('Error in candidatosService.getAll:', error);
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const response = await api.post<{ filas: any[], mensaje: string, status: boolean }>('/candidatos/by/', { id });
      console.log('API Response getById candidato:', response);
      if (response && response.filas && response.filas.length > 0) {
        const candidato = response.filas[0];
        return {
          id: candidato.id,
          nombres: candidato.nombres,
          apellidos: candidato.apellidos,
          numeroDocumento: candidato.numero_documento,
          tipoDocumento: candidato.tipo_documento,
          telefono: candidato.telefono,
          correoElectronico: candidato.correo_electronico,
          direccion: candidato.direccion,
          fechaNacimiento: candidato.fecha_nacimiento,
          sexo: candidato.sexo,
          estadoCivil: candidato.estado_civil,
          cargoAspirado: candidato.cargo_aspirado,
          eps: candidato.eps,
          arl: candidato.arl,
          fondoPension: candidato.fondo_pension,
          experiencia: candidato.experiencia,
          educacion: candidato.educacion
        };
      }
      return null;
    } catch (error) {
      console.error('Error in candidatosService.getById:', error);
      throw error;
    }
  },

  create: async (candidato: Partial<Candidato>) => {
    try {
      const response = await api.post<{ mensaje: string, status: boolean }>('/candidatos/create/', candidato);
      console.log('API Response create candidato:', response);
      return response;
    } catch (error) {
      console.error('Error in candidatosService.create:', error);
      throw error;
    }
  },

  update: async (id: number, candidato: Partial<Candidato>) => {
    try {
      const response = await api.post<{ mensaje: string, status: boolean }>('/candidatos/update/', { id, ...candidato });
      console.log('API Response update candidato:', response);
      return response;
    } catch (error) {
      console.error('Error in candidatosService.update:', error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      const response = await api.post<{ mensaje: string, status: boolean }>('/candidatos/delete/', { id });
      console.log('API Response delete candidato:', response);
      return response;
    } catch (error) {
      console.error('Error in candidatosService.delete:', error);
      throw error;
    }
  }
};