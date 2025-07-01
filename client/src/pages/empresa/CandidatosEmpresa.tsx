import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  Search, 
  Eye, 
  Users, 
  Plus,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Candidato {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  numeroDocumento: string;
  tipoDocumento: string;
  telefono?: string;
  cargoAspirado?: string;
  estado: string;
  fechaRegistro: string;
  completado: boolean;
}

export default function CandidatosEmpresa() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [filteredCandidatos, setFilteredCandidatos] = useState<Candidato[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const navigate = useNavigate();

  useEffect(() => {
    loadCandidatos();
  }, []);

  useEffect(() => {
    filterCandidatos();
  }, [candidatos, searchTerm, filterEstado]);

  const loadCandidatos = async () => {
    try {
      const response = await fetch('/api/empresa/candidatos');
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/empresa/login');
          return;
        }
        throw new Error('Error loading candidatos');
      }
      const data = await response.json();
      setCandidatos(data);
    } catch (error) {
      console.error('Error loading candidatos:', error);
      toast.error('Error cargando candidatos');
    } finally {
      setIsLoading(false);
    }
  };

  const filterCandidatos = () => {
    let filtered = candidatos;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(candidato =>
        candidato.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidato.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidato.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidato.numeroDocumento.includes(searchTerm)
      );
    }

    // Filter by estado
    if (filterEstado !== 'todos') {
      filtered = filtered.filter(candidato => candidato.estado === filterEstado);
    }

    setFilteredCandidatos(filtered);
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      pendiente: <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Pendiente</Badge>,
      aprobado: <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprobado</Badge>,
      rechazado: <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rechazado</Badge>,
    };
    return badges[estado as keyof typeof badges] || <Badge variant="outline">{estado}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando candidatos...</p>
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
                onClick={() => navigate('/empresa/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Candidatos
                  </h1>
                  <p className="text-sm text-gray-500">
                    {filteredCandidatos.length} de {candidatos.length} candidatos
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => navigate('/empresa/candidatos/crear')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Candidato
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre, email o documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Filter className="w-4 h-4" />
                      <span>Estado: {filterEstado === 'todos' ? 'Todos' : filterEstado}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterEstado('todos')}>
                      Todos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterEstado('pendiente')}>
                      Pendientes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterEstado('aprobado')}>
                      Aprobados
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterEstado('rechazado')}>
                      Rechazados
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidatos List */}
        {filteredCandidatos.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {candidatos.length === 0 ? 'No hay candidatos registrados' : 'No se encontraron candidatos'}
              </h3>
              <p className="text-gray-500 mb-6">
                {candidatos.length === 0 
                  ? 'Crea tu primer candidato para comenzar'
                  : 'Prueba cambiando los filtros de búsqueda'
                }
              </p>
              {candidatos.length === 0 && (
                <Button
                  onClick={() => navigate('/empresa/candidatos/crear')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Candidato
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCandidatos.map((candidato) => (
              <Card key={candidato.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {candidato.nombres} {candidato.apellidos}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>{candidato.email}</span>
                            <span>•</span>
                            <span>{candidato.tipoDocumento}: {candidato.numeroDocumento}</span>
                            {candidato.telefono && (
                              <>
                                <span>•</span>
                                <span>{candidato.telefono}</span>
                              </>
                            )}
                          </div>
                          {candidato.cargoAspirado && (
                            <p className="text-sm text-gray-600 mt-1">
                              Cargo aspirado: {candidato.cargoAspirado}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        {getEstadoBadge(candidato.estado)}
                        <p className="text-xs text-gray-500 mt-1">
                          Registrado: {formatDate(candidato.fechaRegistro)}
                        </p>
                        {candidato.completado && (
                          <p className="text-xs text-green-600 mt-1">
                            Perfil completo
                          </p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => navigate(`/empresa/candidatos/${candidato.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}