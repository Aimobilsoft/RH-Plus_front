import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase,
  Users,
  Edit3,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Candidato {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  numeroDocumento: string;
  tipoDocumento: string;
  telefono?: string;
  fechaNacimiento?: string;
  edad?: number;
  sexo?: string;
  estadoCivil?: string;
  direccion?: string;
  ciudad?: string;
  cargoAspirado?: string;
  eps?: string;
  arl?: string;
  fondoPension?: string;
  nivelEducativo?: string;
  grupoSanguineo?: string;
  contactoEmergenciaNombre?: string;
  contactoEmergenciaTelefono?: string;
  contactoEmergenciaRelacion?: string;
  estado: string;
  fechaRegistro: string;
  completado: boolean;
  experienciaLaboral?: any[];
  educacion?: any[];
}

export default function DetalleCandidatoEmpresa() {
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      loadCandidato(parseInt(id));
    }
  }, [id]);

  const loadCandidato = async (candidatoId: number) => {
    try {
      const response = await fetch(`/api/empresa/candidatos/${candidatoId}`);
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/empresa/login');
          return;
        }
        if (response.status === 404) {
          toast.error('Candidato no encontrado');
          navigate('/empresa/candidatos');
          return;
        }
        throw new Error('Error loading candidato');
      }
      const data = await response.json();
      setCandidato(data);
    } catch (error) {
      console.error('Error loading candidato:', error);
      toast.error('Error cargando información del candidato');
    } finally {
      setIsLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      pendiente: <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Pendiente</Badge>,
      aprobado: <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprobado</Badge>,
      rechazado: <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rechazado</Badge>,
    };
    return badges[estado as keyof typeof badges] || <Badge variant="outline">{estado}</Badge>;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificado';
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del candidato...</p>
        </div>
      </div>
    );
  }

  if (!candidato) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Candidato no encontrado</h3>
          <Button onClick={() => navigate('/empresa/candidatos')}>
            Volver a la lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/empresa/candidatos')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {candidato.nombres} {candidato.apellidos}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Detalles del candidato
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getEstadoBadge(candidato.estado)}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Información Personal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nombres</p>
                    <p className="text-base">{candidato.nombres}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Apellidos</p>
                    <p className="text-base">{candidato.apellidos}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tipo de Documento</p>
                    <p className="text-base">{candidato.tipoDocumento}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Número de Documento</p>
                    <p className="text-base">{candidato.numeroDocumento}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha de Nacimiento</p>
                    <p className="text-base">{formatDate(candidato.fechaNacimiento)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Edad</p>
                    <p className="text-base">{candidato.edad || 'No especificada'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sexo</p>
                    <p className="text-base">{candidato.sexo || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estado Civil</p>
                    <p className="text-base">{candidato.estadoCivil || 'No especificado'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Contacto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Información de Contacto</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base">{candidato.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Teléfono</p>
                    <p className="text-base">{candidato.telefono || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ciudad</p>
                    <p className="text-base">{candidato.ciudad || 'No especificada'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Dirección</p>
                    <p className="text-base">{candidato.direccion || 'No especificada'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información Profesional */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5" />
                  <span>Información Profesional</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cargo Aspirado</p>
                    <p className="text-base">{candidato.cargoAspirado || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nivel Educativo</p>
                    <p className="text-base">{candidato.nivelEducativo || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">EPS</p>
                    <p className="text-base">{candidato.eps || 'No especificada'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">ARL</p>
                    <p className="text-base">{candidato.arl || 'No especificada'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resumen */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Estado</span>
                  {getEstadoBadge(candidato.estado)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Perfil</span>
                  <Badge variant={candidato.completado ? "default" : "secondary"}>
                    {candidato.completado ? "Completo" : "Incompleto"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Fecha de Registro</span>
                  <span className="text-sm">{formatDate(candidato.fechaRegistro)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contacto de Emergencia */}
            {candidato.contactoEmergenciaNombre && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Contacto de Emergencia</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nombre</p>
                    <p className="text-base">{candidato.contactoEmergenciaNombre}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Teléfono</p>
                    <p className="text-base">{candidato.contactoEmergenciaTelefono || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Relación</p>
                    <p className="text-base">{candidato.contactoEmergenciaRelacion || 'No especificada'}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Acciones */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar CV
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Generar Reporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}