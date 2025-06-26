import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Candidato {
  identificacion?: string;
  tipoDocumento?: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  correo?: string;
  empresa?: string;
  ciudad?: string;
  direccion?: string;
  horarioTrabajo?: string;
  cargoAspira?: string;
  actividadEconomica?: string;
  eps?: string;
  arl?: string;
  fondoPensiones?: string;
  nivelEducativo?: string;
  remuneracionSalarial?: string | number;
  fechaNacimiento?: string;
  sexo?: string;
  estadoCivil?: string;
  grupoSanguineo?: string;
  contactoEmergenciaNombre?: string;
  contactoEmergenciaCelular?: string;
  contactoEmergenciaCorreo?: string;
}

interface DatosPersonalesFormProps {
  formData: Partial<Candidato>;
  onChange: (field: string, value: any) => void;
}

export const DatosPersonalesForm: React.FC<DatosPersonalesFormProps> = ({ formData, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Datos de Identificación */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo de Documento *</label>
        <Select value={formData.tipoDocumento} onValueChange={(value) => onChange('tipoDocumento', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
            <SelectItem value="CE">Cédula de Extranjería</SelectItem>
            <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
            <SelectItem value="PP">Pasaporte</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Número de Identificación *</label>
        <Input
          value={formData.identificacion || ''}
          onChange={(e) => onChange('identificacion', e.target.value)}
          placeholder="Número de identificación"
        />
      </div>

      {/* Datos Personales */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Nombres *</label>
        <Input
          value={formData.nombre || ''}
          onChange={(e) => onChange('nombre', e.target.value)}
          placeholder="Nombres"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Apellidos *</label>
        <Input
          value={formData.apellido || ''}
          onChange={(e) => onChange('apellido', e.target.value)}
          placeholder="Apellidos"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Fecha de Nacimiento</label>
        <Input
          type="date"
          value={formData.fechaNacimiento || ''}
          onChange={(e) => onChange('fechaNacimiento', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Sexo</label>
        <Select value={formData.sexo} onValueChange={(value) => onChange('sexo', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione sexo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="M">Masculino</SelectItem>
            <SelectItem value="F">Femenino</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Estado Civil</label>
        <Select value={formData.estadoCivil} onValueChange={(value) => onChange('estadoCivil', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione estado civil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Soltero">Soltero(a)</SelectItem>
            <SelectItem value="Casado">Casado(a)</SelectItem>
            <SelectItem value="Union Libre">Unión Libre</SelectItem>
            <SelectItem value="Divorciado">Divorciado(a)</SelectItem>
            <SelectItem value="Viudo">Viudo(a)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Grupo Sanguíneo</label>
        <Select value={formData.grupoSanguineo} onValueChange={(value) => onChange('grupoSanguineo', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione grupo sanguíneo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A+">A+</SelectItem>
            <SelectItem value="A-">A-</SelectItem>
            <SelectItem value="B+">B+</SelectItem>
            <SelectItem value="B-">B-</SelectItem>
            <SelectItem value="AB+">AB+</SelectItem>
            <SelectItem value="AB-">AB-</SelectItem>
            <SelectItem value="O+">O+</SelectItem>
            <SelectItem value="O-">O-</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Datos de Contacto */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Teléfono</label>
        <Input
          value={formData.telefono || ''}
          onChange={(e) => onChange('telefono', e.target.value)}
          placeholder="Número de teléfono"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Correo Electrónico</label>
        <Input
          type="email"
          value={formData.correo || ''}
          onChange={(e) => onChange('correo', e.target.value)}
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Dirección</label>
        <Input
          value={formData.direccion || ''}
          onChange={(e) => onChange('direccion', e.target.value)}
          placeholder="Dirección de residencia"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Ciudad</label>
        <Input
          value={formData.ciudad || ''}
          onChange={(e) => onChange('ciudad', e.target.value)}
          placeholder="Ciudad"
        />
      </div>

      {/* Datos Laborales */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Empresa</label>
        <Input
          value={formData.empresa || ''}
          onChange={(e) => onChange('empresa', e.target.value)}
          placeholder="Empresa actual"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Cargo Aspirado</label>
        <Input
          value={formData.cargoAspira || ''}
          onChange={(e) => onChange('cargoAspira', e.target.value)}
          placeholder="Cargo al que aspira"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Horario de Trabajo</label>
        <Input
          value={formData.horarioTrabajo || ''}
          onChange={(e) => onChange('horarioTrabajo', e.target.value)}
          placeholder="Horario de trabajo"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Actividad Económica</label>
        <Input
          value={formData.actividadEconomica || ''}
          onChange={(e) => onChange('actividadEconomica', e.target.value)}
          placeholder="Actividad económica"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Remuneración Salarial</label>
        <Input
          type="number"
          value={formData.remuneracionSalarial || ''}
          onChange={(e) => onChange('remuneracionSalarial', e.target.value)}
          placeholder="Salario"
        />
      </div>

      {/* Datos de Seguridad Social */}
      <div className="space-y-2">
        <label className="text-sm font-medium">EPS</label>
        <Input
          value={formData.eps || ''}
          onChange={(e) => onChange('eps', e.target.value)}
          placeholder="EPS"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">ARL</label>
        <Input
          value={formData.arl || ''}
          onChange={(e) => onChange('arl', e.target.value)}
          placeholder="ARL"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Fondo de Pensiones</label>
        <Input
          value={formData.fondoPensiones || ''}
          onChange={(e) => onChange('fondoPensiones', e.target.value)}
          placeholder="Fondo de pensiones"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Nivel Educativo</label>
        <Select value={formData.nivelEducativo} onValueChange={(value) => onChange('nivelEducativo', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione nivel educativo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Primaria">Primaria</SelectItem>
            <SelectItem value="Bachillerato">Bachillerato</SelectItem>
            <SelectItem value="Técnico">Técnico</SelectItem>
            <SelectItem value="Tecnólogo">Tecnólogo</SelectItem>
            <SelectItem value="Profesional">Profesional</SelectItem>
            <SelectItem value="Especialización">Especialización</SelectItem>
            <SelectItem value="Maestría">Maestría</SelectItem>
            <SelectItem value="Doctorado">Doctorado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contacto de Emergencia */}
      <div className="md:col-span-2">
        <h3 className="text-lg font-medium mb-4">Contacto de Emergencia</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre Completo</label>
            <Input
              value={formData.contactoEmergenciaNombre || ''}
              onChange={(e) => onChange('contactoEmergenciaNombre', e.target.value)}
              placeholder="Nombre del contacto"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Teléfono</label>
            <Input
              value={formData.contactoEmergenciaCelular || ''}
              onChange={(e) => onChange('contactoEmergenciaCelular', e.target.value)}
              placeholder="Teléfono de emergencia"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Correo</label>
            <Input
              type="email"
              value={formData.contactoEmergenciaCorreo || ''}
              onChange={(e) => onChange('contactoEmergenciaCorreo', e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
};