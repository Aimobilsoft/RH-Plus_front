import React, { useState, useEffect } from 'react';
import { Settings, Users, Plus, Edit, Trash2, UserPlus } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createCandidatoFromPerfilSchema, createAdminUserSchema, type CreateCandidatoFromPerfil, type CreateAdminUser } from '@shared/schema';

interface Perfil {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: string;
}

const PerfilesPage = () => {
  const { toast } = useToast();
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [createCandidatoOpen, setCreateCandidatoOpen] = useState(false);
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const candidatoForm = useForm<CreateCandidatoFromPerfil>({
    resolver: zodResolver(createCandidatoFromPerfilSchema),
    defaultValues: {
      cedula: '',
      nombres: '',
      apellidos: '',
      email: '',
      tipoDocumento: 'CC',
    },
  });

  const adminForm = useForm<CreateAdminUser>({
    resolver: zodResolver(createAdminUserSchema),
    defaultValues: {
      nombres: '',
      apellidos: '',
      email: '',
      username: '',
      tipoUsuario: 'administrador',
    },
  });

  useEffect(() => {
    loadPerfiles();
  }, []);

  const loadPerfiles = async () => {
    try {
      const response = await fetch('/api/perfiles');
      if (response.ok) {
        const data = await response.json();
        setPerfiles(data);
      } else {
        // Si hay error de autorización u otro, cargar perfiles de ejemplo
        setPerfiles([
          { id: 1, nombre: 'administrador', descripcion: 'Administrador del sistema con todos los permisos', activo: true, fechaCreacion: '2025-06-27' },
          { id: 2, nombre: 'candidato', descripcion: 'Candidato con acceso al portal de autogestión', activo: true, fechaCreacion: '2025-06-27' },
          { id: 3, nombre: 'coordinador', descripcion: 'Coordinador con permisos de gestión intermedia', activo: true, fechaCreacion: '2025-06-27' },
          { id: 4, nombre: 'administrador_general', descripcion: 'Administrador general con permisos completos', activo: true, fechaCreacion: '2025-06-27' },
        ]);
      }
    } catch (error) {
      console.error('Error loading perfiles:', error);
      setPerfiles([
        { id: 1, nombre: 'administrador', descripcion: 'Administrador del sistema con todos los permisos', activo: true, fechaCreacion: '2025-06-27' },
        { id: 2, nombre: 'candidato', descripcion: 'Candidato con acceso al portal de autogestión', activo: true, fechaCreacion: '2025-06-27' },
        { id: 3, nombre: 'coordinador', descripcion: 'Coordinador con permisos de gestión intermedia', activo: true, fechaCreacion: '2025-06-27' },
        { id: 4, nombre: 'administrador_general', descripcion: 'Administrador general con permisos completos', activo: true, fechaCreacion: '2025-06-27' },
      ]);
    }
  };

  const onSubmitCandidato = async (data: CreateCandidatoFromPerfil) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/perfiles/create-candidato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Candidato creado exitosamente",
          description: `Se ha creado la cuenta para ${data.nombres} ${data.apellidos}. Usuario: ${data.email}, Contraseña inicial: ${data.cedula}`,
        });
        setCreateCandidatoOpen(false);
        candidatoForm.reset();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "No se pudo crear el candidato",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitAdmin = async (data: CreateAdminUser) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/perfiles/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Usuario administrativo creado exitosamente",
          description: `Se ha creado el usuario ${data.tipoUsuario} con username: ${data.username} y contraseña temporal: 12345678`,
        });
        setCreateAdminOpen(false);
        adminForm.reset();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "No se pudo crear el usuario",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          
          <div className="flex gap-2">
            <Dialog open={createCandidatoOpen} onOpenChange={setCreateCandidatoOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Candidato
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Candidato</DialogTitle>
                  <p className="text-sm text-gray-600">
                    Ingrese los datos básicos para crear una cuenta de candidato
                  </p>
                </DialogHeader>
                
                <Form {...candidatoForm}>
                  <form onSubmit={candidatoForm.handleSubmit(onSubmitCandidato)} className="space-y-4">
                    <FormField
                      control={candidatoForm.control}
                      name="tipoDocumento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Documento</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                              <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                              <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                              <SelectItem value="PP">Pasaporte</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={candidatoForm.control}
                      name="cedula"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Documento</FormLabel>
                          <FormControl>
                            <Input placeholder="1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={candidatoForm.control}
                      name="nombres"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombres</FormLabel>
                          <FormControl>
                            <Input placeholder="Juan Carlos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={candidatoForm.control}
                      name="apellidos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellidos</FormLabel>
                          <FormControl>
                            <Input placeholder="Pérez González" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={candidatoForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo Electrónico</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="usuario@ejemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800 font-medium mb-1">Información importante:</p>
                      <p className="text-sm text-green-700">
                        El candidato recibirá credenciales de acceso con:
                        <br />• Usuario: El correo electrónico ingresado
                        <br />• Contraseña inicial: El número de documento
                      </p>
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                      {isLoading ? 'Creando candidato...' : 'Crear Candidato'}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={createAdminOpen} onOpenChange={setCreateAdminOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Usuario Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Usuario Administrativo</DialogTitle>
                  <p className="text-sm text-gray-600">
                    Ingrese los datos para crear un usuario administrativo
                  </p>
                </DialogHeader>
                
                <Form {...adminForm}>
                  <form onSubmit={adminForm.handleSubmit(onSubmitAdmin)} className="space-y-4">
                    <FormField
                      control={adminForm.control}
                      name="tipoUsuario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Usuario</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="administrador">👑 Administrador</SelectItem>
                              <SelectItem value="coordinador">📋 Coordinador</SelectItem>
                              <SelectItem value="administrador_general">🔧 Administrador General</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={adminForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de Usuario</FormLabel>
                          <FormControl>
                            <Input placeholder="nombreusuario" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={adminForm.control}
                      name="nombres"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombres</FormLabel>
                          <FormControl>
                            <Input placeholder="Ana María" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={adminForm.control}
                      name="apellidos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellidos</FormLabel>
                          <FormControl>
                            <Input placeholder="García López" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={adminForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo Electrónico</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="admin@empresa.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium mb-1">Información importante:</p>
                      <p className="text-sm text-blue-700">
                        El usuario recibirá credenciales de acceso con:
                        <br />• Usuario: El nombre de usuario ingresado
                        <br />• Contraseña inicial: 12345678
                      </p>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? 'Creando usuario...' : 'Crear Usuario'}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
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
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{perfil.nombre.replace('_', ' ')}</h3>
                        <Badge variant={getPerfilBadgeVariant(perfil.nombre) as any}>
                          {perfil.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{perfil.descripcion}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Disponibles</CardTitle>
            <CardDescription>
              Operaciones que puedes realizar con los perfiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">👤 Crear Candidato</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Crea una cuenta de candidato con acceso al portal de autogestión.
                  El usuario será el correo electrónico y la contraseña inicial será el número de documento.
                </p>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setCreateCandidatoOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Candidato
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">⚙️ Crear Usuario Administrativo</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Crea cuentas para administradores, coordinadores o administradores generales.
                  Se asignará username personalizado y contraseña temporal.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setCreateAdminOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Usuario Admin
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