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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900">Información del Aspirante</h3>
        <p className="text-sm text-gray-600 mt-1">Complete los datos personales del candidato</p>
      </div>

      {/* Identification Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Identificación</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tipo de Documento *</label>
            <Select value={formData.tipoDocumento} onValueChange={(value) => onChange('tipoDocumento', value)}>
              <SelectTrigger className="bg-white">
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
            <label className="text-sm font-medium text-gray-700">Número de Identificación *</label>
            <Input
              className="bg-white"
              value={formData.identificacion || ''}
              onChange={(e) => onChange('identificacion', e.target.value)}
              placeholder="Número de identificación"
            />
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Datos Personales</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nombres *</label>
            <Input
              className="bg-white"
              value={formData.nombre || ''}
              onChange={(e) => onChange('nombre', e.target.value)}
              placeholder="Nombres"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Apellidos *</label>
            <Input
              className="bg-white"
              value={formData.apellido || ''}
              onChange={(e) => onChange('apellido', e.target.value)}
              placeholder="Apellidos"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            <Input
              className="bg-white"
              type="date"
              value={formData.fechaNacimiento || ''}
              onChange={(e) => onChange('fechaNacimiento', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Sexo</label>
            <Select value={formData.sexo} onValueChange={(value) => onChange('sexo', value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Seleccione sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Femenino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Estado Civil</label>
            <Select value={formData.estadoCivil} onValueChange={(value) => onChange('estadoCivil', value)}>
              <SelectTrigger className="bg-white">
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
            <label className="text-sm font-medium text-gray-700">Grupo Sanguíneo</label>
            <Select value={formData.grupoSanguineo} onValueChange={(value) => onChange('grupoSanguineo', value)}>
              <SelectTrigger className="bg-white">
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
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Información de Contacto</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Teléfono</label>
            <Input
              className="bg-white"
              value={formData.telefono || ''}
              onChange={(e) => onChange('telefono', e.target.value)}
              placeholder="Número de teléfono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
            <Input
              className="bg-white"
              type="email"
              value={formData.correo || ''}
              onChange={(e) => onChange('correo', e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Dirección</label>
            <Input
              className="bg-white"
              value={formData.direccion || ''}
              onChange={(e) => onChange('direccion', e.target.value)}
              placeholder="Dirección de residencia"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ciudad</label>
            <Input
              className="bg-white"
              value={formData.ciudad || ''}
              onChange={(e) => onChange('ciudad', e.target.value)}
              placeholder="Ciudad"
            />
          </div>
        </div>
      </div>

      {/* Work Information Section */}
      <div className="bg-orange-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Información Laboral</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Empresa</label>
            <Input
              className="bg-white"
              value={formData.empresa || ''}
              onChange={(e) => onChange('empresa', e.target.value)}
              placeholder="Empresa actual"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Cargo Aspirado</label>
            <Input
              className="bg-white"
              value={formData.cargoAspira || ''}
              onChange={(e) => onChange('cargoAspira', e.target.value)}
              placeholder="Cargo al que aspira"
            />
          </div>
        </div>
      </div>

      {/* Health Information Section */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Información de Salud y Seguridad Social</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">EPS</label>
            <Input
              className="bg-white"
              value={formData.eps || ''}
              onChange={(e) => onChange('eps', e.target.value)}
              placeholder="EPS"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">ARL</label>
            <Input
              className="bg-white"
              value={formData.arl || ''}
              onChange={(e) => onChange('arl', e.target.value)}
              placeholder="ARL"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Fondo de Pensiones</label>
            <Input
              className="bg-white"
              value={formData.fondoPensiones || ''}
              onChange={(e) => onChange('fondoPensiones', e.target.value)}
              placeholder="Fondo de pensiones"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nivel Educativo</label>
            <Select value={formData.nivelEducativo} onValueChange={(value) => onChange('nivelEducativo', value)}>
              <SelectTrigger className="bg-white">
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
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="bg-red-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Contacto de Emergencia</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
            <Input
              className="bg-white"
              value={formData.contactoEmergenciaNombre || ''}
              onChange={(e) => onChange('contactoEmergenciaNombre', e.target.value)}
              placeholder="Nombre del contacto"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Teléfono</label>
            <Input
              className="bg-white"
              value={formData.contactoEmergenciaCelular || ''}
              onChange={(e) => onChange('contactoEmergenciaCelular', e.target.value)}
              placeholder="Teléfono de emergencia"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Correo</label>
            <Input
              className="bg-white"
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