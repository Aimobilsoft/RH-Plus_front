import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, UserCheck } from 'lucide-react';
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
import CascadingSelects from '@/components/CascadingSelects';

// Schema de validación
const analistaSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Ingrese un email válido'),
  telefono: z.string().optional(),
  clienteAsignado: z.string().optional(),
  nivelPrioridad: z.number().min(1).max(5, 'El nivel de prioridad debe estar entre 1 y 5'),
  estado: z.enum(['activo', 'inactivo']),
  fechaIngreso: z.string().optional(),
});

type AnalistaFormData = z.infer<typeof analistaSchema>;

// Datos de clientes disponibles
const clientesDisponibles = [
  'Empresa ABC S.A.S.',
  'TechCorp Colombia',
  'Industrias XYZ Ltda.',
  'Comercial Los Andes',
  'Servicios Integrales S.A.',
  'Constructora del Norte',
  'Grupo Empresarial Sur',
  'Compañía del Valle'
];

export default function CrearAnalistaPage() {
  const navigate = useNavigate();
  
  // Estado para manejar la selección de ubicación
  const [locationData, setLocationData] = useState<{
    regionId: number | null;
    zonaId: number | null;
    sucursalId: number | null;
  }>({
    regionId: null,
    zonaId: null,
    sucursalId: null,
  });

  const form = useForm<AnalistaFormData>({
    resolver: zodResolver(analistaSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      clienteAsignado: '',
      nivelPrioridad: 3,
      estado: 'activo',
      fechaIngreso: new Date().toISOString().split('T')[0],
    },
  });

  // Función para manejar cambios en los selects encadenados
  const handleLocationChange = (regionId: number | null, zonaId: number | null, sucursalId: number | null) => {
    setLocationData({ regionId, zonaId, sucursalId });
  };

  const onSubmit = async (data: AnalistaFormData) => {
    try {
      // Validar que se hayan seleccionado ubicaciones
      if (!locationData.regionId || !locationData.zonaId || !locationData.sucursalId) {
        toast.error('Debe seleccionar regional, zona y sucursal');
        return;
      }

      // Combinar datos del formulario con datos de ubicación
      const analistaData = {
        ...data,
        regional: `Regional-${locationData.regionId}`, // Temporal para compatibilidad
        regionId: locationData.regionId,
        zonaId: locationData.zonaId,
        sucursalId: locationData.sucursalId,
      };

      const response = await fetch('/api/analistas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analistaData),
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

  // Validación para habilitar el botón de submit
  const isFormValid = () => {
    return locationData.regionId && locationData.zonaId && locationData.sucursalId && 
           form.formState.isValid;
  };

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
        <div className="flex items-center gap-3">
          <UserCheck className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Analista</h1>
            <p className="text-gray-600 mt-2">
              Registra un nuevo analista en el sistema con ubicación y asignaciones específicas
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <UserCheck className="w-5 h-5" />
            Datos del Analista
          </CardTitle>
          <CardDescription>
            Complete la información básica y asignación del nuevo analista
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Información Personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-blue-800 border-b border-blue-200 pb-2">
                  Información Personal
                </h3>
                
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
              </div>

              {/* Ubicación */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-blue-800 border-b border-blue-200 pb-2">
                  Ubicación de Trabajo
                </h3>
                
                <CascadingSelects 
                  onSelectionChange={handleLocationChange}
                  disabled={form.formState.isSubmitting}
                />
              </div>

              {/* Asignaciones y Configuración */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-blue-800 border-b border-blue-200 pb-2">
                  Asignaciones y Configuración
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="clienteAsignado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente Asignado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Sin asignación específica</SelectItem>
                            {clientesDisponibles.map(cliente => (
                              <SelectItem key={cliente} value={cliente}>
                                {cliente}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Cliente específico asignado al analista (opcional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nivelPrioridad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nivel de Prioridad *</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar nivel" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 - Muy Alto</SelectItem>
                            <SelectItem value="2">2 - Alto</SelectItem>
                            <SelectItem value="3">3 - Medio</SelectItem>
                            <SelectItem value="4">4 - Bajo</SelectItem>
                            <SelectItem value="5">5 - Muy Bajo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Nivel de prioridad del analista (1=Muy Alto, 5=Muy Bajo)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              {/* Información de depuración */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Información de Debug:</h4>
                  <p className="text-sm">Regional ID: {locationData.regionId || 'No seleccionada'}</p>
                  <p className="text-sm">Zona ID: {locationData.zonaId || 'No seleccionada'}</p>
                  <p className="text-sm">Sucursal ID: {locationData.sucursalId || 'No seleccionada'}</p>
                  <p className="text-sm">Form Valid: {form.formState.isValid ? 'Sí' : 'No'}</p>
                  <p className="text-sm">Location Valid: {(locationData.regionId && locationData.zonaId && locationData.sucursalId) ? 'Sí' : 'No'}</p>
                </div>
              )}

              {/* Botones */}
              <div className="flex justify-end gap-4 pt-6 border-t">
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
                  disabled={form.formState.isSubmitting || !isFormValid()}
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