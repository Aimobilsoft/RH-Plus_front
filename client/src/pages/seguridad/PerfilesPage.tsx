import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Settings, Users, UserPlus, Crown, Briefcase, Building, UserCheck, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
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
      case 'cliente':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getPerfilIcon = (nombre: string) => {
    switch (nombre) {
      case 'administrador':
        return <Crown className="h-5 w-5 text-red-600" />;
      case 'candidato':
        return <User className="h-5 w-5 text-green-600" />;
      case 'coordinador':
        return <Briefcase className="h-5 w-5 text-blue-600" />;
      case 'administrador_general':
        return <Settings className="h-5 w-5 text-purple-600" />;
      case 'cliente':
        return <Building className="h-5 w-5 text-yellow-600" />;
      default:
        return <User className="h-5 w-5 text-gray-600" />;
    }
  };

  const userTypes = [
    {
      id: 'administrador',
      name: 'Administrador',
      description: 'Usuario con permisos para gestionar candidatos y coordinadores dentro de su ámbito',
      color: 'red',
      bgColor: 'bg-red-50 hover:bg-red-100',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      icon: <Crown className="h-6 w-6 text-red-600" />,
      route: '/seguridad/perfiles/crear-administrador',
      buttonText: 'Crear Administrador'
    },
    {
      id: 'coordinador',
      name: 'Coordinador',
      description: 'Usuario especializado en coordinar procesos y gestionar equipos de trabajo',
      color: 'blue',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      icon: <Briefcase className="h-6 w-6 text-blue-600" />,
      route: '/seguridad/perfiles/crear-coordinador',
      buttonText: 'Crear Coordinador'
    },
    {
      id: 'administrador_general',
      name: 'Administrador General',
      description: 'Usuario con permisos completos para gestionar todo el sistema y configuraciones globales',
      color: 'purple',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      icon: <Settings className="h-6 w-6 text-purple-600" />,
      route: '/seguridad/perfiles/crear-admin-general',
      buttonText: 'Crear Admin General'
    },
    {
      id: 'candidato',
      name: 'Candidato',
      description: 'Usuario perteneciente a candidatos que pueden acceder a su perfil y gestionar documentos',
      color: 'green',
      bgColor: 'bg-green-50 hover:bg-green-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      icon: <User className="h-6 w-6 text-green-600" />,
      route: '/seguridad/perfiles/crear-candidato',
      buttonText: 'Crear Candidato'
    },
    {
      id: 'cliente',
      name: 'Cliente',
      description: 'Usuario perteneciente a una empresa externa (cliente) que puede crear solicitudes de ingreso, consultar su estado y ver sus candidatos',
      color: 'yellow',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      icon: <Building className="h-6 w-6 text-yellow-600" />,
      route: '/seguridad/perfiles/crear-cliente',
      buttonText: 'Crear Cliente'
    }
  ];

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
                    {getPerfilIcon(perfil.nombre)}
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
              <span>Crear Usuarios</span>
            </CardTitle>
            <CardDescription>
              Crear nuevos usuarios según el tipo de perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {userTypes.map((userType) => (
                <Tooltip key={userType.id}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`p-4 border rounded-lg transition-colors ${userType.bgColor} ${userType.borderColor}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {userType.icon}
                          <h3 className={`font-medium ${userType.textColor}`}>
                            {userType.name}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {userType.description}
                      </p>
                      <Link to={userType.route}>
                        <Button 
                          size="sm" 
                          className={`w-full`}
                          variant={userType.color === 'red' ? 'destructive' : 
                                  userType.color === 'blue' ? 'default' :
                                  userType.color === 'purple' ? 'secondary' :
                                  userType.color === 'green' ? 'outline' : 'outline'}
                        >
                          {userType.buttonText}
                        </Button>
                      </Link>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{userType.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerfilesPage;