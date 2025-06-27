import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createAdminUserSchema, type CreateAdminUser } from "@shared/schema";

const CrearCoordinadorPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateAdminUser>({
    resolver: zodResolver(createAdminUserSchema),
    defaultValues: {
      nombres: '',
      apellidos: '',
      email: '',
      username: '',
      tipoUsuario: 'coordinador',
    },
  });

  const onSubmit = async (data: CreateAdminUser) => {
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
          title: "Coordinador creado exitosamente",
          description: `Se ha creado el coordinador ${data.nombres} ${data.apellidos}. Usuario: ${data.username}, Contraseña temporal: 12345678`,
        });
        form.reset();
        // Redirigir de vuelta a la página de perfiles después de 2 segundos
        setTimeout(() => {
          window.location.href = '/seguridad/perfiles';
        }, 2000);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "No se pudo crear el coordinador",
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

  return (
    <div className="page-container p-6">
      <div className="page-header mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/seguridad/perfiles'}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Crear Coordinador</h1>
            <p className="text-gray-600">
              Crea una nueva cuenta de coordinador con permisos de gestión intermedia
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Clipboard className="h-5 w-5" />
              <span>Información del Coordinador</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de Usuario</FormLabel>
                      <FormControl>
                        <Input placeholder="coordinador.usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="coordinador@empresa.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">Información importante:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• El coordinador tendrá permisos de gestión intermedia</li>
                    <li>• Usuario para iniciar sesión: el nombre de usuario ingresado</li>
                    <li>• Contraseña temporal: 12345678</li>
                    <li>• Se recomienda cambiar la contraseña en el primer inicio de sesión</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => window.location.href = '/seguridad/perfiles'}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creando coordinador...' : 'Crear Coordinador'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrearCoordinadorPage;