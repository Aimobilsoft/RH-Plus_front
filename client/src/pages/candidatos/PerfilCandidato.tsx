import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Upload, 
  LogOut,
  Save,
  AlertCircle,
  CheckCircle,
  Settings,
  Key,
  ChevronDown,
  Building
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ExperienciaLaboralTab } from '@/components/candidatos/ExperienciaLaboralTab';
import { EducacionTab } from '@/components/candidatos/EducacionTab';

const perfilSchema = z.object({
  nombres: z.string().min(2, 'Los nombres son requeridos'),
  apellidos: z.string().min(2, 'Los apellidos son requeridos'),
  fechaNacimiento: z.string().optional(),
  edad: z.coerce.number().min(18, 'Debe ser mayor de edad').max(100).optional(),
  sexo: z.string().optional(),
  estadoCivil: z.string().optional(),
  telefono: z.string().min(10, 'Teléfono requerido'),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  cargoAspirado: z.string().optional(),
  eps: z.string().optional(),
  arl: z.string().optional(),
  grupoSanguineo: z.string().optional(),
  nivelEducativo: z.string().optional(),
  contactoEmergenciaNombre: z.string().optional(),
  contactoEmergenciaTelefono: z.string().optional(),
  contactoEmergenciaRelacion: z.string().optional(),
});

type PerfilForm = z.infer<typeof perfilSchema>;

interface Candidato {
  id: number;
  email: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento?: string;
  edad?: number;
  sexo?: string;
  estadoCivil?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  cargoAspirado?: string;
  eps?: string;
  arl?: string;
  grupoSanguineo?: string;
  nivelEducativo?: string;
  contactoEmergenciaNombre?: string;
  contactoEmergenciaTelefono?: string;
  contactoEmergenciaRelacion?: string;
  hojaDeVida?: string;
  fotografia?: string;
  completado: boolean;
  estado: string;
  fechaRegistro: string;
}

interface ExperienciaLaboral {
  id?: number;
  empresa: string;
  fechaInicio: string;
  fechaFin: string;
  cargo: string;
  responsabilidades: string;
  salario: string | number;
  motivoRetiro?: string;
}

interface Educacion {
  id?: number;
  titulo: string;
  institucion: string;
  fechaInicio: string;
  fechaFin: string;
  ciudad: string;
  nivelEducativo: string;
}

export default function PerfilCandidato() {
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [experienciaLaboral, setExperienciaLaboral] = useState<ExperienciaLaboral[]>([]);
  const [educacion, setEducacion] = useState<Educacion[]>([]);
  const [empresasDisponibles] = useState([
    { id: 1, nombre: "TechCorp Solutions", requiredDocs: ["hojaDeVida", "diploma", "certificaciones"] },
    { id: 2, nombre: "Innovación Digital SA", requiredDocs: ["hojaDeVida", "fotografia", "referencias"] },
    { id: 3, nombre: "Consultora Estratégica", requiredDocs: ["hojaDeVida", "portafolio", "certificaciones"] }
  ]);
  const navigate = useNavigate();

  const form = useForm<PerfilForm>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {},
  });

  useEffect(() => {
    loadProfile();
  }, []);

  // Función para calcular el progreso del perfil
  const calcularProgresoPerfil = () => {
    if (!candidato) return 0;
    
    const camposRequeridos = [
      'nombres', 'apellidos', 'fechaNacimiento', 'telefono', 'direccion', 
      'ciudad', 'cargoAspirado', 'eps', 'arl', 'nivelEducativo'
    ];
    
    const camposCompletos = camposRequeridos.filter(campo => {
      const valor = candidato[campo as keyof Candidato];
      return valor && valor.toString().trim() !== '';
    });
    
    return Math.round((camposCompletos.length / camposRequeridos.length) * 100);
  };

  // Función para calcular la edad automáticamente
  const calcularEdad = (fechaNacimiento: string) => {
    if (!fechaNacimiento) return '';
    
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    const mesNacimiento = nacimiento.getMonth();
    const diaNacimiento = nacimiento.getDate();
    
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
      edad--;
    }
    
    return edad.toString();
  };

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/candidato/profile');
      if (response.ok) {
        const data = await response.json();
        setCandidato(data);
        form.reset(data);
      } else {
        toast.error('Error al cargar el perfil');
        navigate('/candidato/login');
      }
    } catch (error) {
      toast.error('Error de conexión');
      navigate('/candidato/login');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: PerfilForm) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/candidato/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, completado: true }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Perfil actualizado exitosamente');
        setCandidato(result.candidato);
      } else {
        toast.error(result.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/candidato/logout', { method: 'POST' });
      navigate('/candidato/login');
    } catch (error) {
      navigate('/candidato/login');
    }
  };

  const handleCambiarPassword = () => {
    navigate('/candidato/cambiar-password');
  };

  const handleFileUpload = async (file: File, type: 'hojaDeVida' | 'fotografia') => {
    // In a real app, you'd upload to cloud storage
    // For now, we'll just show a success message
    toast.success(`${type === 'hojaDeVida' ? 'Hoja de vida' : 'Fotografía'} cargada exitosamente`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!candidato) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600">Administra tu información personal y profesional</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Indicador de progreso */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Progreso:</span>
              <div className="w-24">
                <Progress value={calcularProgresoPerfil()} className="h-2" />
              </div>
              <span className="text-sm font-bold text-green-600">{calcularProgresoPerfil()}%</span>
            </div>
            
            {/* Menú de usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Mi Cuenta</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleCambiarPassword}>
                  <Key className="w-4 h-4 mr-2" />
                  Cambiar Contraseña
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Profile Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{candidato.nombres} {candidato.apellidos}</h2>
                <p className="text-gray-600">{candidato.email}</p>
                <p className="text-sm text-gray-500">
                  {candidato.tipoDocumento}: {candidato.numeroDocumento}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Candidato</CardTitle>
            <CardDescription>
              Complete toda la información para mejorar sus oportunidades laborales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="contacto">Contacto</TabsTrigger>
                    <TabsTrigger value="profesional">Experiencia Laboral</TabsTrigger>
                    <TabsTrigger value="educacion">Educacion</TabsTrigger>
                    <TabsTrigger value="archivos">Archivos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nombres"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombres *</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fechaNacimiento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de Nacimiento *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="date" 
                                onChange={(e) => {
                                  field.onChange(e);
                                  const edad = calcularEdad(e.target.value);
                                  if (edad) {
                                    form.setValue('edad', parseInt(edad));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="edad"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Edad</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min="18" max="100" disabled />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sexo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sexo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Masculino">Masculino</SelectItem>
                                <SelectItem value="Femenino">Femenino</SelectItem>
                                <SelectItem value="Otro">Otro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="estadoCivil"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado Civil</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Soltero">Soltero</SelectItem>
                                <SelectItem value="Casado">Casado</SelectItem>
                                <SelectItem value="Divorciado">Divorciado</SelectItem>
                                <SelectItem value="Viudo">Viudo</SelectItem>
                                <SelectItem value="Unión Libre">Unión Libre</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="grupoSanguineo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grupo Sanguíneo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="contacto" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="telefono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input {...field} className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ciudad"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ciudad</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input {...field} className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="direccion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dirección</FormLabel>
                              <FormControl>
                                <Textarea {...field} placeholder="Dirección completa" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="contactoEmergenciaNombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contacto de Emergencia - Nombre</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactoEmergenciaTelefono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contacto de Emergencia - Teléfono</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactoEmergenciaRelacion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relación con Contacto de Emergencia</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ej: Madre, Padre, Hermano" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="profesional" className="space-y-4">
                    <ExperienciaLaboralTab 
                      experienciaLaboral={experienciaLaboral}
                      onChange={setExperienciaLaboral}
                    />
                  </TabsContent>

                  <TabsContent value="educacion" className="space-y-4">
                    <EducacionTab 
                      educacion={educacion}
                      onChange={setEducacion}
                    />
                  </TabsContent>

                  <TabsContent value="archivos" className="space-y-4">
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentos por Empresa</h3>
                        <p className="text-gray-600">
                          Selecciona la empresa para la cual deseas subir documentos específicos
                        </p>
                      </div>
                      
                      <Accordion type="single" collapsible className="w-full">
                        {empresasDisponibles.map((empresa) => (
                          <AccordionItem key={empresa.id} value={`empresa-${empresa.id}`}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center space-x-3">
                                <Building className="w-5 h-5 text-blue-600" />
                                <span className="font-medium">{empresa.nombre}</span>
                                <Badge variant="outline" className="ml-2">
                                  {empresa.requiredDocs.length} documentos
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pt-4">
                                <p className="text-sm text-gray-600 mb-4">
                                  Documentos requeridos para esta empresa:
                                </p>
                                
                                <div className="grid gap-4">
                                  {empresa.requiredDocs.map((docType, index) => {
                                    const docConfig = {
                                      hojaDeVida: { 
                                        name: 'Hoja de Vida', 
                                        icon: <Upload className="w-5 h-5" />, 
                                        description: 'CV en formato PDF (máx. 5MB)',
                                        required: true
                                      },
                                      diploma: { 
                                        name: 'Diploma', 
                                        icon: <GraduationCap className="w-5 h-5" />, 
                                        description: 'Título profesional (PDF)',
                                        required: true
                                      },
                                      certificaciones: { 
                                        name: 'Certificaciones', 
                                        icon: <Upload className="w-5 h-5" />, 
                                        description: 'Certificados adicionales (PDF)',
                                        required: false
                                      },
                                      fotografia: { 
                                        name: 'Fotografía', 
                                        icon: <User className="w-5 h-5" />, 
                                        description: 'Foto profesional (JPG/PNG, máx. 2MB)',
                                        required: false
                                      },
                                      referencias: { 
                                        name: 'Referencias', 
                                        icon: <Mail className="w-5 h-5" />, 
                                        description: 'Cartas de recomendación (PDF)',
                                        required: false
                                      },
                                      portafolio: { 
                                        name: 'Portafolio', 
                                        icon: <Briefcase className="w-5 h-5" />, 
                                        description: 'Muestra de trabajos (PDF/ZIP)',
                                        required: false
                                      }
                                    };
                                    
                                    const config = docConfig[docType as keyof typeof docConfig];
                                    
                                    return (
                                      <Card key={index} className="border border-gray-200">
                                        <CardHeader className="pb-3">
                                          <CardTitle className="flex items-center text-sm">
                                            {config.icon}
                                            <span className="ml-2">
                                              {config.name}
                                              {config.required && <span className="text-red-500 ml-1">*</span>}
                                            </span>
                                          </CardTitle>
                                          <CardDescription className="text-xs">
                                            {config.description}
                                          </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                                            <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                                            <p className="text-xs text-gray-600 mb-2">
                                              Arrastra tu archivo aquí o
                                            </p>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => {
                                                // Simular subida de archivo
                                                toast.success(`${config.name} subido para ${empresa.nombre}`);
                                              }}
                                            >
                                              Seleccionar archivo
                                            </Button>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    );
                                  })}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="px-8"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Perfil
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}