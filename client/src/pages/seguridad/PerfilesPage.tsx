import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, UserPlus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Perfil } from "@shared/schema";

const PerfilesPage = () => {
  const { toast } = useToast();
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);

  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        const response = await fetch('/api/perfiles');
        if (response.ok) {
          const data = await response.json();
          setPerfiles(data);
        }
      } catch (error) {
        console.error('Error fetching perfiles:', error);
      }
    };

    fetchPerfiles();
  }, []);

  const getPerfilBadgeVariant = (nombre: string) => {
    switch (nombre) {
      case 'administrador':
        return 'destructive';
      case 'candidato':
        return 'secondary';
      case 'coordinador':
        return 'outline';
      case 'administrador_general':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getPerfilIcon = (nombre: string) => {
    switch (nombre) {
      case 'administrador':
        return '👑';
      case 'candidato':
        return '👤';
      case 'coordinador':
        return '📋';
      case 'administrador_general':
        return '🔧';
      default:
        return '👤';
    }
  };

  return (
    <div className="page-container p-6">
      <div className="page-header mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Gestión de Perfiles</h1>
          </div>
        </div>
        <p className="text-gray-600 mt-2">
          Administra los tipos de usuario y crea nuevas cuentas del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Perfiles del Sistema</span>
            </CardTitle>
            <CardDescription>
              Tipos de usuario disponibles en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {perfiles.map((perfil) => (
                <div key={perfil.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getPerfilIcon(perfil.nombre)}</span>
                    <div>
                      <h3 className="font-medium">{perfil.nombre}</h3>
                      <p className="text-sm text-gray-600">{perfil.descripcion}</p>
                    </div>
                  </div>
                  <Badge variant={getPerfilBadgeVariant(perfil.nombre)}>
                    {perfil.nombre}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Acciones Disponibles</span>
            </CardTitle>
            <CardDescription>
              Crear nuevos usuarios según el tipo de perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">👤 Crear Candidato</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Crea una cuenta de candidato con información básica (cédula, nombre, email).
                  El usuario será el correo electrónico y la contraseña inicial será el número de documento.
                </p>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => window.location.href = '/seguridad/perfiles/crear-candidato'}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Candidato
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-red-800 mb-2">👑 Crear Administrador</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Crea una cuenta de administrador con permisos completos del sistema.
                  Se asignará username personalizado y contraseña temporal.
                </p>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => window.location.href = '/seguridad/perfiles/crear-administrador'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Administrador
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">📋 Crear Coordinador</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Crea una cuenta de coordinador con permisos de gestión intermedia.
                  Se asignará username personalizado y contraseña temporal.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.location.href = '/seguridad/perfiles/crear-coordinador'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Coordinador
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">🔧 Crear Administrador General</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Crea una cuenta de administrador general con permisos completos.
                  Se asignará username personalizado y contraseña temporal.
                </p>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.location.href = '/seguridad/perfiles/crear-admin-general'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Admin General
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerfilesPage;