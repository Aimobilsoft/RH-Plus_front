
import React, { useState, useEffect } from 'react';
import { Settings, Users, Plus, Edit, Trash2, UserPlus } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createCandidatoFromPerfilSchema, type CreateCandidatoFromPerfil } from '@shared/schema';

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
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateCandidatoFromPerfil>({
    resolver: zodResolver(createCandidatoFromPerfilSchema),
    defaultValues: {
      cedula: '',
      nombres: '',
      apellidos: '',
      email: '',
      tipoDocumento: 'CC',
    },
  });

  // Cargar perfiles al montar el componente
  useEffect(() => {
    loadPerfiles();
  }, []);

  const loadPerfiles = async () => {
    try {
      const response = await fetch('/api/perfiles');
      if (response.ok) {
        const data = await response.json();
        setPerfiles(data);
      }
    } catch (error) {
      console.error('Error loading perfiles:', error);
      // Datos de prueba para desarrollo
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
        const result = await response.json();
        toast({
          title: "Candidato creado exitosamente",
          description: `Se ha creado la cuenta para ${data.nombres} ${data.apellidos}. Usuario: ${data.email}, Contraseña inicial: ${data.cedula}`,
        });
        setCreateCandidatoOpen(false);
        form.reset();
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
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitCandidato)} className="space-y-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="juan@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">Información importante:</p>
                    <ul className="text-sm text-green-700 mt-1 space-y-1">
                      <li>• Usuario: El correo electrónico será el usuario</li>
                      <li>• Contraseña inicial: El número de documento</li>
                      <li>• Se requerirá cambio de contraseña en el primer acceso</li>
                    </ul>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCreateCandidatoOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                      {isLoading ? 'Creando...' : 'Crear Candidato'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Perfiles Disponibles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Tipos de Perfiles</span>
            </CardTitle>
            <CardDescription>
              Perfiles disponibles en el sistema
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
                        <h4 className="font-medium capitalize">
                          {perfil.nombre.replace('_', ' ')}
                        </h4>
                        <Badge variant={getPerfilBadgeVariant(perfil.nombre)}>
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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Información del Flujo */}
        <Card>
          <CardHeader>
            <CardTitle>Flujo de Creación de Candidatos</CardTitle>
            <CardDescription>
              Proceso para generar cuentas de candidatos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Recopilación de Datos</h4>
                  <p className="text-sm text-gray-600">Se solicita cédula, nombres, apellidos y correo electrónico</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Generación de Credenciales</h4>
                  <p className="text-sm text-gray-600">Usuario: correo electrónico, Contraseña: número de documento</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Primer Acceso</h4>
                  <p className="text-sm text-gray-600">El candidato debe cambiar la contraseña en su primer inicio de sesión</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Acceso al Portal</h4>
                  <p className="text-sm text-gray-600">Una vez actualizada la contraseña, tiene acceso completo al portal</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerfilesPage;
