import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Plus, 
  List, 
  LogOut, 
  BarChart3,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStats {
  totalCandidatos: number;
  candidatosPendientes: number;
  candidatosAprobados: number;
  candidatosRechazados: number;
}

interface Empresa {
  id: number;
  nombreEmpresa: string;
  email: string;
  nit: string;
  direccion?: string;
  telefono?: string;
  ciudad?: string;
  contactoPrincipal?: string;
  cargoContacto?: string;
}

export default function DashboardEmpresa() {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load empresa profile
      const profileResponse = await fetch('/api/empresa/profile');
      if (!profileResponse.ok) {
        if (profileResponse.status === 401) {
          navigate('/empresa/login');
          return;
        }
        throw new Error('Error loading profile');
      }
      const empresaData = await profileResponse.json();
      setEmpresa(empresaData);

      // Load dashboard stats
      const statsResponse = await fetch('/api/empresa/dashboard-stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error cargando información');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/empresa/logout', { method: 'POST' });
      navigate('/empresa/login');
    } catch (error) {
      console.error('Error en logout:', error);
      navigate('/empresa/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
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
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {empresa?.nombreEmpresa}
                </h1>
                <p className="text-sm text-gray-500">Portal de Empresas</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenido, {empresa?.contactoPrincipal || 'Usuario'}
          </h2>
          <p className="text-gray-600">
            Gestiona tus candidatos y procesos de selección desde este panel
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Candidatos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCandidatos}</div>
                <p className="text-xs text-muted-foreground">
                  Candidatos registrados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.candidatosPendientes}</div>
                <p className="text-xs text-muted-foreground">
                  En proceso de revisión
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.candidatosAprobados}</div>
                <p className="text-xs text-muted-foreground">
                  Candidatos aprobados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rechazados</CardTitle>
                <UserX className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.candidatosRechazados}</div>
                <p className="text-xs text-muted-foreground">
                  Candidatos rechazados
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Crear Candidato</span>
              </CardTitle>
              <CardDescription>
                Registra un nuevo candidato para tu empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/empresa/candidatos/crear')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Candidato
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <List className="w-5 h-5 text-green-600" />
                <span>Ver Candidatos</span>
              </CardTitle>
              <CardDescription>
                Consulta la lista completa de candidatos registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/empresa/candidatos')}
              >
                <List className="w-4 h-4 mr-2" />
                Ver Lista
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Company Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Información de la Empresa</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">NIT</p>
                <p className="text-base">{empresa?.nit}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base">{empresa?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ciudad</p>
                <p className="text-base">{empresa?.ciudad || 'No especificada'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="text-base">{empresa?.telefono || 'No especificado'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}