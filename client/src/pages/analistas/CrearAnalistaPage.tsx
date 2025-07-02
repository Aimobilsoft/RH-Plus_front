import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Schema de validación
const analistaSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Ingrese un email válido'),
  telefono: z.string().optional(),
  regional: z.string().min(1, 'Seleccione una regional'),
  clienteAsignado: z.string().optional(),
  nivelPrioridad: z.enum(['alto', 'medio', 'bajo']),
  estado: z.enum(['activo', 'inactivo']),
  fechaIngreso: z.string().optional(),
});

type AnalistaFormData = z.infer<typeof analistaSchema>;

export default function CrearAnalistaPage() {
  const navigate = useNavigate();

  const form = useForm<AnalistaFormData>({
    resolver: zodResolver(analistaSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      regional: '',
      clienteAsignado: '',
      nivelPrioridad: 'medio',
      estado: 'activo',
      fechaIngreso: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: AnalistaFormData) => {
    try {
      const response = await fetch('/api/analistas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Analista creado exitosamente');
        navigate('/analistas');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al crear analista');
      }
    } catch (error) {
      console.error('Error creando analista:', error);
      toast.error('Error al crear analista');
    }
  };

  const regionales = [
    'Bogotá',
    'Medellín', 
    'Cali',
    'Barranquilla',
    'Cartagena',
    'Bucaramanga',
    'Pereira',
    'Manizales',
    'Ibagué',
    'Cúcuta'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate('/analistas')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Analista</h1>
          <p className="text-gray-600 mt-2">
            Registra un nuevo analista en el sistema
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Datos del Analista</CardTitle>
          <CardDescription>
            Complete la información básica del nuevo analista
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Información Personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del analista" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apellido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido *</FormLabel>
                      <FormControl>
                        <Input placeholder="Apellido del analista" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="correo@ejemplo.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="Número de teléfono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Asignaciones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="regional"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regional *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una regional" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regionales.map(regional => (
                            <SelectItem key={regional} value={regional}>
                              {regional}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clienteAsignado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente Asignado</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del cliente" {...field} />
                      </FormControl>
                      <FormDescription>
                        Cliente específico asignado al analista
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Configuración */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="nivelPrioridad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nivel de Prioridad *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Nivel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="alto">Alto</SelectItem>
                          <SelectItem value="medio">Medio</SelectItem>
                          <SelectItem value="bajo">Bajo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="activo">Activo</SelectItem>
                          <SelectItem value="inactivo">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fechaIngreso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Ingreso</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/analistas')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={form.formState.isSubmitting}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {form.formState.isSubmitting ? 'Guardando...' : 'Crear Analista'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}