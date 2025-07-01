import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  IdCard, 
  Save,
  UserPlus
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const candidatoSimpleSchema = z.object({
  nombres: z.string().min(2, 'Nombres requeridos'),
  apellidos: z.string().min(2, 'Apellidos requeridos'),
  cedula: z.string().min(6, 'Cédula requerida'),
  email: z.string().email('Email inválido'),
  tipoDocumento: z.string().min(1, 'Tipo de documento requerido'),
});

type CandidatoSimpleForm = z.infer<typeof candidatoSimpleSchema>;

export default function CrearCandidatoSimple() {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const form = useForm<CandidatoSimpleForm>({
    resolver: zodResolver(candidatoSimpleSchema),
    defaultValues: {
      nombres: '',
      apellidos: '',
      cedula: '',
      email: '',
      tipoDocumento: 'CC',
    },
  });

  const onSubmit = async (data: CandidatoSimpleForm) => {
    setIsSaving(true);
    try {
      // Preparar datos para crear el candidato con datos básicos
      const candidatoData = {
        nombres: data.nombres,
        apellidos: data.apellidos,
        tipoDocumento: data.tipoDocumento,
        numeroDocumento: data.cedula,
        email: data.email,
        password: data.cedula, // La cédula como contraseña inicial
        deberCambiarPassword: true, // Forzar cambio de contraseña en primer login
        perfilId: 2, // Perfil de candidato
      };

      const response = await fetch('/api/empresa/candidatos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidatoData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(
          `Candidato creado exitosamente. Usuario: ${data.email}, Contraseña inicial: ${data.cedula}`
        );
        form.reset();
        // Redirigir después de 3 segundos
        setTimeout(() => {
          navigate('/empresa/candidatos');
        }, 3000);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error creando candidato');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setIsSaving(false);
    }
  };

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
                <span>Volver al Dashboard</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Crear Candidato
                  </h1>
                  <p className="text-sm text-gray-500">
                    Registro rápido con datos básicos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Registro de Candidato</CardTitle>
            <CardDescription>
              Complete los datos básicos del candidato. Se generará automáticamente una cuenta con acceso al portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-green-200 pb-2">
                    Datos Personales
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nombres"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombres *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} placeholder="Juan Carlos" className="pl-10" />
                            </div>
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
                          <FormLabel>Apellidos *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} placeholder="Pérez González" className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tipoDocumento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Documento *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
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
                          <FormLabel>Número de Documento *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <IdCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} placeholder="1234567890" className="pl-10" />
                            </div>
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
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input {...field} type="email" placeholder="candidato@ejemplo.com" className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Información de acceso */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Información de Acceso</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>• Se creará automáticamente una cuenta para el candidato</p>
                    <p>• Usuario: El email proporcionado</p>
                    <p>• Contraseña inicial: El número de documento</p>
                    <p>• Se solicitará cambio de contraseña en el primer login</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/empresa/dashboard')}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                    {isSaving ? (
                      'Creando...'
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Crear Candidato
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}