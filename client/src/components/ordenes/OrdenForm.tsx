
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Trash2, Plus, Building, User, Pen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Orden, OrdenServicio } from '@/services/ordenesService';
import { 
  Form, 
  FormControl, 
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ServicioSelector from './ServicioSelector';
import SignatureCanvas from './SignatureCanvas';
import { api } from '@/services/api';

// Define schema for form validation
const formSchema = z.object({
  empresaId: z.coerce.number({
    required_error: "Empresa es requerida",
  }),
  aspiranteId: z.coerce.number({
    required_error: "Candidato es requerido",
  }),
  tipoOrden: z.enum(['Ingreso', 'Egreso'], {
    required_error: "Tipo de Orden es requerido",
  }),
});

interface OrdenFormProps {
  orden?: Orden;
  onSubmit: (data: Orden) => void;
  onCancel: () => void;
}

interface Candidato {
  id: number;
  nombres: string;
  apellidos: string;
  numeroDocumento?: string;
  telefono?: string;
  correoElectronico?: string;
  direccion?: string;
  fechaNacimiento?: string;
  genero?: string;
  estadoCivil?: string;
  tipoDocumento?: string;
}

interface Empresa {
  Id?: number;
  empresaId?: number;
  nit?: string;
  dv?: string;
  razonSocial: string;
  nombreComercial?: string;
  direccion?: string;
  telefono?: string;
  correoElectronico?: string;
}

// Define structure for API response
interface ApiResponse<T> {
  filas: T[];
  [key: string]: unknown;
}

const OrdenForm = ({ orden, onSubmit, onCancel }: OrdenFormProps) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [isLoading, setIsLoading] = useState({
    empresas: false,
    candidatos: false
  });
  
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);
  const [servicios, setServicios] = useState<OrdenServicio[]>(orden?.servicios || []);
  const [signatureData, setSignatureData] = useState<string | null>(orden?.firma || null);
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      empresaId: orden?.empresaId || 0,
      aspiranteId: orden?.aspiranteId || 0,
      tipoOrden: (orden?.tipoOrden as 'Ingreso' | 'Egreso') || 'Ingreso',
    },
  });

  // Load data on component mount - optimize by loading both at once
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading({ empresas: true, candidatos: true });
      
      try {
        // Fetch both resources in parallel
        const [empresasResponse, candidatosResponse] = await Promise.all([
          api.post('/empresas'),
          api.post('/candidatos')
        ]);
        
        // Process empresas
        if (empresasResponse && typeof empresasResponse === 'object' && 'filas' in empresasResponse) {
          const response = empresasResponse as ApiResponse<any>;
          const formattedEmpresas = response.filas.map((empresa: any) => ({
            Id: empresa.id || empresa.EmpresaId || empresa.empresaId,
            empresaId: empresa.id || empresa.EmpresaId || empresa.empresaId,
            nit: empresa.nit || empresa.NIT || '',
            dv: empresa.dv || empresa.DV || '',
            razonSocial: empresa.razon_social || empresa.RazonSocial || empresa.razonSocial || '',
            nombreComercial: empresa.nombre_comercial || empresa.NombreComercial || empresa.nombreComercial || '',
            direccion: empresa.direccion || empresa.Direccion || '',
            telefono: empresa.telefono || empresa.Telefono || '',
            correoElectronico: empresa.correo_electronico || empresa.CorreoElectronico || empresa.correoElectronico || '',
          }));
          
          setEmpresas(formattedEmpresas);
        }
        
        // Process candidatos
        if (candidatosResponse && typeof candidatosResponse === 'object' && 'filas' in candidatosResponse) {
          // Fix for the TypeScript error: properly type the response and check it has filas
          const response = candidatosResponse as ApiResponse<Candidato>;
          setCandidatos(response.filas);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast.error("Error al cargar los datos del formulario");
      } finally {
        setIsLoading({ empresas: false, candidatos: false });
      }
    };

    fetchData();
  }, []);

  // Update selected empresa and aspirante when orden changes
  useEffect(() => {
    if (orden) {
      console.log("Setting form values from orden:", orden);
      
      form.setValue('empresaId', orden.empresaId || 0);
      form.setValue('aspiranteId', orden.aspiranteId || 0);
      form.setValue('tipoOrden', (orden.tipoOrden as 'Ingreso' | 'Egreso') || 'Ingreso');
      
      if (orden.servicios && Array.isArray(orden.servicios)) {
        setServicios(orden.servicios);
      }
      
      setSignatureData(orden.firma || null);

      // Find and set selected empresa
      const empresaId = orden.empresaId;
      if (empresaId && empresas.length > 0) {
        const empresa = empresas.find(e => (e.Id === empresaId || e.empresaId === empresaId));
        if (empresa) setSelectedEmpresa(empresa);
      }

      // Find and set selected candidato
      const candidatoId = orden.aspiranteId;
      if (candidatoId && candidatos.length > 0) {
        const candidato = candidatos.find(c => c.id === candidatoId);
        if (candidato) setSelectedCandidato(candidato);
      }
    }
  }, [orden, empresas, candidatos, form]);

  const handleEmpresaChange = (value: string) => {
    const empresaId = parseInt(value);
    form.setValue('empresaId', empresaId);
    const empresa = empresas.find(e => (e.Id === empresaId || e.empresaId === empresaId));
    setSelectedEmpresa(empresa || null);
  };

  const handleCandidatoChange = (value: string) => {
    const candidatoId = parseInt(value);
    form.setValue('aspiranteId', candidatoId);
    const candidato = candidatos.find(c => c.id === candidatoId);
    setSelectedCandidato(candidato || null);
  };

  const addServicio = (servicio: OrdenServicio) => {
    // Check if service already exists
    if (servicios.some(s => s.id === servicio.id)) {
      toast.error('Este servicio ya está en la lista');
      return;
    }
    setServicios([...servicios, servicio]);
  };

  const removeServicio = (index: number) => {
    const updatedServicios = [...servicios];
    updatedServicios.splice(index, 1);
    setServicios(updatedServicios);
  };

  const calculateTotal = () => {
    return servicios.reduce((sum, servicio) => sum + (servicio.precio || 0), 0);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (servicios.length === 0) {
      toast.error('Debe agregar al menos un servicio');
      return;
    }

    const ordenData: Orden = {
      id: orden?.id || 0,
      ...values,
      servicios,
      total: calculateTotal(),
      firma: signatureData ?? undefined,
      estado: orden?.estado || 'pendiente',
      fechaCreacion: orden?.fechaCreacion,
      fecha: orden?.fecha
    };

    onSubmit(ordenData);
  };

  return (
    <div className="space-y-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <div className="flex justify-between items-center mb-2 bg-primary/5 p-2 rounded-md">
            <h3 className="text-sm font-medium">Información General</h3>
            <FormField
              control={form.control}
              name="tipoOrden"
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-32 h-8 text-xs bg-white">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Ingreso">Ingreso</SelectItem>
                    <SelectItem value="Egreso">Egreso</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Empresa Card */}
            <Card className="shadow-sm border-primary/20">
              <CardHeader className="pb-2 pt-3 flex flex-row items-center justify-between">
                <CardTitle className="text-md flex items-center">
                  <Building className="mr-2 h-4 w-4 text-primary" />
                  Empresa
                </CardTitle>
                <FormField
                  control={form.control}
                  name="empresaId"
                  render={({ field }) => (
                    <Select 
                      onValueChange={handleEmpresaChange} 
                      defaultValue={field.value ? field.value.toString() : undefined}
                      disabled={isLoading.empresas}
                    >
                      <FormControl>
                        <SelectTrigger className="w-56 h-8 text-xs bg-white">
                          <SelectValue placeholder="Seleccione una empresa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {empresas.map((empresa) => (
                          <SelectItem 
                            key={empresa.Id || empresa.empresaId} 
                            value={(empresa.Id || empresa.empresaId)?.toString() || '0'}
                          >
                            {empresa.razonSocial}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                {selectedEmpresa ? (
                  <div className="bg-primary/5 p-3 rounded-md text-sm border border-primary/10 grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">NIT:</span>
                      <span className="text-left">{selectedEmpresa.nit}-{selectedEmpresa.dv}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Teléfono:</span>
                      <span className="text-left">{selectedEmpresa.telefono || 'No registrado'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Dirección:</span>
                      <span className="text-left">{selectedEmpresa.direccion || 'No registrada'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Email:</span>
                      <span className="text-left">{selectedEmpresa.correoElectronico || 'No registrado'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-2 text-xs text-muted-foreground">
                    Seleccione una empresa para ver sus detalles
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Aspirante Card */}
            <Card className="shadow-sm border-primary/20">
              <CardHeader className="pb-2 pt-3 flex flex-row items-center justify-between">
                <CardTitle className="text-md flex items-center">
                  <User className="mr-2 h-4 w-4 text-primary" />
                  Candidato
                </CardTitle>
                <FormField
                  control={form.control}
                  name="aspiranteId"
                  render={({ field }) => (
                    <Select 
                      onValueChange={handleCandidatoChange} 
                      defaultValue={field.value ? field.value.toString() : undefined}
                      disabled={isLoading.candidatos}
                    >
                      <FormControl>
                        <SelectTrigger className="w-56 h-8 text-xs bg-white">
                          <SelectValue placeholder="Seleccione un candidato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {candidatos && candidatos.length > 0 && candidatos.map((candidato) => (
                          <SelectItem 
                            key={candidato.id} 
                            value={candidato.id.toString()}
                          >
                            {candidato.nombres} {candidato.apellidos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                {selectedCandidato ? (
                  <div className="bg-primary/5 p-3 rounded-md text-sm border border-primary/10">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Nombre:</span>
                        <span className="text-right">{selectedCandidato.nombres} {selectedCandidato.apellidos}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Documento:</span>
                        <span className="text-right">
                          {selectedCandidato.tipoDocumento || 'CC'}: {selectedCandidato.numeroDocumento || 'No registrado'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Email:</span>
                        <span className="text-right">{selectedCandidato.correoElectronico || 'No registrado'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Dirección:</span>
                        <span className="text-right">{selectedCandidato.direccion || 'No registrada'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-2 text-xs text-muted-foreground">
                    Seleccione un candidato para ver sus detalles
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Servicios Card */}
          <Card className="shadow-sm border-primary/20">
            <CardHeader className="pb-2 pt-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-md flex items-center">
                  <Plus className="mr-2 h-4 w-4 text-primary" />
                  Servicios
                </CardTitle>
                <ServicioSelector onServicioSelected={addServicio} />
              </div>
            </CardHeader>
            <CardContent className="py-1">
              {servicios.length > 0 ? (
                <div className="rounded-md shadow-sm border border-border">
                  <div className="max-h-32 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50%] py-1 text-xs">Descripción</TableHead>
                          <TableHead className="w-[20%] py-1 text-xs">Código</TableHead>
                          <TableHead className="text-right w-[20%] py-1 text-xs">Precio</TableHead>
                          <TableHead className="w-[10%] py-1 text-xs"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="text-xs">
                        {servicios.map((servicio, index) => (
                          <TableRow key={index}>
                            <TableCell className="py-1">{servicio.descripcion}</TableCell>
                            <TableCell className="py-1">{servicio.codigo}</TableCell>
                            <TableCell className="text-right py-1">
                              ${servicio.precio.toLocaleString('es-CO')}
                            </TableCell>
                            <TableCell className="py-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeServicio(index)}
                                className="h-6 w-6 text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-end p-2 border-t">
                    <div className="text-primary font-medium text-sm">
                      Total: <span className="text-base">${calculateTotal().toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 text-xs text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                  No hay servicios seleccionados. Agregue servicios usando el botón "+ Agregar Servicio".
                </div>
              )}
            </CardContent>
          </Card>

          {/* Firma Digital */}
          <Card className="shadow-sm border-primary/20">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-md flex items-center">
                <Pen className="mr-2 h-4 w-4 text-primary" /> 
                Firma Digital
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-3">
              <div className="border rounded-md bg-white">
                <SignatureCanvas 
                  onSignatureChange={setSignatureData} 
                  initialSignature={orden?.firma}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onCancel} type="button" size="sm">
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 gap-1" size="sm">
              <Plus className="h-3 w-3" />
              {orden ? 'Actualizar' : 'Guardar'} Orden
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OrdenForm;
