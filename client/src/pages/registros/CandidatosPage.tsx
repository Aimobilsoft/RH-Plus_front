import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApiData } from '@/hooks/useApiData';
import { User, Search, Plus, Edit, Trash2, DatabaseIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DatosPersonalesForm } from '@/components/candidatos/DatosPersonalesForm';
import { EducacionTab } from '@/components/candidatos/EducacionTab';
import { ExperienciaLaboralTab } from '@/components/candidatos/ExperienciaLaboralTab';
import { api } from '@/services/api';

interface EducacionAPI {
  id?: number;
  candidato_id?: number;
  nivel_educativo: string;
  institucion: string;
  titulo: string;
  graduacion: string;
}

interface ExperienciaLaboralAPI {
  id?: number;
  candidato_id?: number;
  empresa: string;
  cargo: string;
  fecha_inicio: string;
  fecha_fin: string;
  responsabilidades: string;
  salario: string | number;
}

interface Educacion {
  id?: number;
  nivelEducativo: string;
  institucion: string;
  titulo: string;
  fechaGraduacion: string;
}

interface ExperienciaLaboral {
  id?: number;
  empresa: string;
  fechaInicio: string;
  fechaFin: string;
  cargo: string;
  responsabilidades: string;
  salario: string | number;
}

interface CandidatoAPI {
  id: number;
  numero_documento: string;
  tipo_documento: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo_electronico: string;
  empresa: string;
  ciudad: string;
  direccion: string;
  horario_trabajo?: string;
  cargo_aspirado?: string;
  sector_economico?: string;
  eps?: string;
  arl?: string;
  fondo_pension?: string;
  nivel_educativo_main?: string;
  remuneracion?: string | number;
  fecha_nacimiento?: string;
  sexo?: string;
  estado_civil?: string;
  grupo_sanguineo?: string;
  nombres_emergencia?: string;
  telefono_emergencia?: string;
  correo_emergencia?: string;
}

interface Candidato {
  id: number;
  identificacion: string;
  tipoDocumento: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  empresa: string;
  ciudad: string;
  direccion: string;
  horarioTrabajo?: string;
  cargoAspira?: string;
  actividadEconomica?: string;
  eps?: string;
  arl?: string;
  fondoPensiones?: string;
  nivelEducativo?: string;
  remuneracionSalarial?: string | number;
  fechaNacimiento?: string;
  sexo?: string;
  estadoCivil?: string;
  grupoSanguineo?: string;
  contactoEmergenciaNombre?: string;
  contactoEmergenciaCelular?: string;
  contactoEmergenciaCorreo?: string;
  educacion?: Educacion[];
  experienciaLaboral?: ExperienciaLaboral[];
}

const CandidatosPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Candidato>>({
    identificacion: '',
    tipoDocumento: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    empresa: '',
    ciudad: '',
    direccion: '',
    educacion: [],
    experienciaLaboral: []
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [candidatosList, setCandidatosList] = useState<(Candidato | CandidatoAPI)[]>([]);
  const [activeTab, setActiveTab] = useState('datos-personales');
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Datos simulados mientras se configura la API
  const mockCandidatos: Candidato[] = [
    { id: 1, identificacion: '1234567890', tipoDocumento: 'CC', nombre: 'Juan', apellido: 'Pérez', telefono: '3101234567', correo: 'juan@ejemplo.com', empresa: 'Empresa ABC', ciudad: 'Bogotá', direccion: 'Calle 123' },
    { id: 2, identificacion: '0987654321', tipoDocumento: 'CE', nombre: 'María', apellido: 'González', telefono: '3209876543', correo: 'maria@ejemplo.com', empresa: 'Industrial XYZ', ciudad: 'Medellín', direccion: 'Carrera 45' },
    { id: 3, identificacion: '5678901234', tipoDocumento: 'TI', nombre: 'Carlos', apellido: 'Rodríguez', telefono: '3112345678', correo: 'carlos@ejemplo.com', empresa: 'Servicios 123', ciudad: 'Cali', direccion: 'Avenida 67' },
  ];

  // Hook para consumir la API
  const {
    data: apiResponse,
    isLoading,
    error,
    fetchData,
    createData,
    updateData,
    deleteData,
    isFetched
  } = useApiData<any>('/candidatos', mockCandidatos, {
    showSuccessToast: true,
    successMessage: 'Datos de candidatos cargados correctamente',
    errorMessage: 'Error al cargar los datos de candidatos',
    autoFetch: false
  });

  // Procesar datos de API y actualizar lista de candidatos
  useEffect(() => {
    if (apiResponse) {
      console.log('Processing API response:', apiResponse);
      
      // Verificar si tenemos datos en diferentes estructuras posibles
      let extractedData: (Candidato | CandidatoAPI)[] = [];
      
      if (Array.isArray(apiResponse)) {
        extractedData = apiResponse;
      } else if (apiResponse.filas && Array.isArray(apiResponse.filas)) {
        extractedData = apiResponse.filas;
      } else if (apiResponse.resultado && Array.isArray(apiResponse.resultado)) {
        // Extraer datos del primer elemento si es un array de arrays
        if (Array.isArray(apiResponse.resultado[0])) {
          extractedData = apiResponse.resultado[0];
        } else {
          extractedData = apiResponse.resultado;
        }
      } else {
        // Fallback a usar mockCandidatos si no hay datos de la API
        extractedData = mockCandidatos;
      }
      
      console.log('Extracted candidatos data:', extractedData);
      setCandidatosList(extractedData);
    }
  }, [apiResponse, mockCandidatos]);

  // Cargar datos solo cuando el componente se monta por primera vez
  useEffect(() => {
    if (!isFetched) {
      console.log('Fetching candidatos data once on mount');
      fetchData().catch(error => {
        console.error('Error fetching candidatos:', error);
        // En caso de error, usar datos simulados
        setCandidatosList(mockCandidatos);
      });
    }
  }, [fetchData, isFetched, mockCandidatos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validaciones básicas
      if (!formData.identificacion || !formData.nombre || !formData.apellido) {
        toast({
          title: "Error de validación",
          description: "Por favor complete los campos requeridos",
          variant: "destructive",
        });
        return;
      }

      if (editingId) {
        // Actualizando candidato existente
        await updateData(editingId, formData);
        toast({
          title: "Éxito",
          description: "Candidato actualizado correctamente",
        });
      } else {
        // Creando nuevo candidato
        await createData(formData);
        toast({
          title: "Éxito",
          description: "Candidato registrado correctamente",
        });
      }

      // Recargar datos después de crear/actualizar
      await fetchData();
      
      setDialogOpen(false);
      setFormData({
        identificacion: '',
        tipoDocumento: '',
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        empresa: '',
        ciudad: '',
        direccion: '',
        educacion: [],
        experienciaLaboral: []
      });
      setEditingId(null);
    } catch (error) {
      console.error('Error al procesar candidato:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el candidato",
        variant: "destructive",
      });
    }
  };

  const fetchCandidatoDetails = async (id: number) => {
    setIsLoadingDetails(true);
    try {
      console.log(`Fetching details for candidato ID: ${id}`);
      const response = await api.post('/candidatos/by/', { id });
      console.log("Candidato details response:", response);
      
      if (response && typeof response === 'object') {
        // Fix: Access filas safely with optional chaining and type assertion
        const responseObj = response as any;
        const filas = responseObj.filas || [];
        
        // Extract education and experience arrays from response
        const educacionData: EducacionAPI[] = Array.isArray(filas[0]) ? filas[0] : [];
        const experienciaData: ExperienciaLaboralAPI[] = Array.isArray(filas[1]) ? filas[1] : [];
        
        console.log("Extracted education data:", educacionData);
        console.log("Extracted experience data:", experienciaData);
        
        // Transform API data to match component structure
        const formattedEducacion = educacionData.map(edu => ({
          id: edu.id,
          nivelEducativo: edu.nivel_educativo,
          institucion: edu.institucion,
          titulo: edu.titulo,
          fechaGraduacion: edu.graduacion ? new Date(edu.graduacion).toISOString().split('T')[0] : ''
        }));
        
        const formattedExperiencia = experienciaData.map(exp => ({
          id: exp.id,
          empresa: exp.empresa,
          fechaInicio: exp.fecha_inicio ? new Date(exp.fecha_inicio).toISOString().split('T')[0] : '',
          fechaFin: exp.fecha_fin ? new Date(exp.fecha_fin).toISOString().split('T')[0] : '',
          cargo: exp.cargo,
          responsabilidades: exp.responsabilidades,
          salario: exp.salario
        }));
        
        return {
          educacion: formattedEducacion,
          experienciaLaboral: formattedExperiencia
        };
      } else {
        console.warn("Unexpected response format for candidato details:", response);
        return {
          educacion: [],
          experienciaLaboral: []
        };
      }
    } catch (error) {
      console.error('Error fetching candidato details:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles del candidato",
        variant: "destructive",
      });
      return {
        educacion: [],
        experienciaLaboral: []
      };
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleEdit = async (candidato: Candidato | CandidatoAPI) => {
    try {
      // Initialize basic data from candidato object based on its structure
      const baseData = 'numero_documento' in candidato ? {
        id: candidato.id,
        identificacion: candidato.numero_documento || '',
        tipoDocumento: candidato.tipo_documento || '',
        nombre: candidato.nombres || '',
        apellido: candidato.apellidos || '',
        telefono: candidato.telefono || '',
        correo: candidato.correo_electronico || '',
        empresa: candidato.empresa || '',
        ciudad: candidato.ciudad || '',
        direccion: candidato.direccion || '',
        horarioTrabajo: candidato.horario_trabajo || '',
        cargoAspira: candidato.cargo_aspirado || '',
        actividadEconomica: candidato.sector_economico || '',
        eps: candidato.eps || '',
        arl: candidato.arl || '',
        fondoPensiones: candidato.fondo_pension || '',
        nivelEducativo: candidato.nivel_educativo_main || '',
        remuneracionSalarial: candidato.remuneracion || '',
        fechaNacimiento: candidato.fecha_nacimiento ? new Date(candidato.fecha_nacimiento).toISOString().split('T')[0] : '',
        sexo: candidato.sexo || '',
        estadoCivil: candidato.estado_civil || '',
        grupoSanguineo: candidato.grupo_sanguineo || '',
        contactoEmergenciaNombre: candidato.nombres_emergencia || '',
        contactoEmergenciaCelular: candidato.telefono_emergencia || '',
        contactoEmergenciaCorreo: candidato.correo_emergencia || '',
        educacion: [],
        experienciaLaboral: []
      } : {
        ...candidato
      };
      
      setFormData(baseData);
      setEditingId(candidato.id);
      setDialogOpen(true);
      setActiveTab('datos-personales');
      
      // Then fetch education and experience data from API
      const details = await fetchCandidatoDetails(candidato.id);
      
      // Update form data with fetched details
      setFormData(prev => ({
        ...prev,
        educacion: details.educacion,
        experienciaLaboral: details.experienciaLaboral
      }));
    } catch (error) {
      console.error('Error preparing candidato for edit:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información completa del candidato",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteData(id);
      toast({
        title: "Éxito",
        description: "Candidato eliminado correctamente",
      });
      // Recargar datos después de eliminar
      await fetchData();
    } catch (error) {
      console.error('Error al eliminar candidato:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el candidato",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Ahora filtramos la lista local que ya es un array
  const filteredCandidatos = candidatosList.filter((candidato: any) => 
    (candidato.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     candidato.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     candidato.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     candidato.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     candidato.identificacion?.includes(searchTerm) ||
     candidato.numero_documento?.includes(searchTerm) ||
     candidato.empresa?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page-container p-6">
      <div className="page-header mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <User className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Candidatos</h1>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Candidato" : "Registrar Nuevo Candidato"}
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[75vh]">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="datos-personales">Datos Personales</TabsTrigger>
                      <TabsTrigger value="educacion">Educación</TabsTrigger>
                      <TabsTrigger value="experiencia-laboral">Experiencia Laboral</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="datos-personales" className="mt-4">
                      <DatosPersonalesForm 
                        formData={formData} 
                        onChange={handleInputChange}
                      />
                    </TabsContent>
                    
                    <TabsContent value="educacion" className="mt-4">
                      {isLoadingDetails ? (
                        <div className="text-center py-4">
                          <span className="text-sm text-muted-foreground">Cargando información de educación...</span>
                        </div>
                      ) : (
                        <EducacionTab 
                          educacion={formData.educacion || []} 
                          onChange={(educacion) => setFormData(prev => ({ ...prev, educacion }))}
                        />
                      )}
                    </TabsContent>
                    
                    <TabsContent value="experiencia-laboral" className="mt-4">
                      {isLoadingDetails ? (
                        <div className="text-center py-4">
                          <span className="text-sm text-muted-foreground">Cargando información de experiencia laboral...</span>
                        </div>
                      ) : (
                        <ExperienciaLaboralTab 
                          experienciaLaboral={formData.experienciaLaboral || []} 
                          onChange={(experienciaLaboral) => setFormData(prev => ({ ...prev, experienciaLaboral }))}
                        />
                      )}
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {editingId ? "Actualizar" : "Registrar"}
                    </Button>
                  </div>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="mb-4 flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar candidatos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          {isLoading && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <DatabaseIcon className="h-4 w-4 animate-spin" />
              <span className="text-sm">Cargando...</span>
            </div>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Identificación</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead className="hidden md:table-cell">Teléfono</TableHead>
              <TableHead className="hidden md:table-cell">Correo</TableHead>
              <TableHead className="hidden md:table-cell">Empresa</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidatos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  <div className="flex flex-col items-center space-y-2">
                    <User className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm">No hay datos disponibles en este momento</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCandidatos.map((candidato: any) => (
                <TableRow key={candidato.id}>
                  <TableCell className="font-medium">{candidato.numero_documento || candidato.identificacion}</TableCell>
                  <TableCell>{candidato.nombres || candidato.nombre}</TableCell>
                  <TableCell>{candidato.apellidos || candidato.apellido}</TableCell>
                  <TableCell className="hidden md:table-cell">{candidato.telefono}</TableCell>
                  <TableCell className="hidden md:table-cell">{candidato.correo_electronico || candidato.correo}</TableCell>
                  <TableCell className="hidden md:table-cell">{candidato.empresa}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(candidato)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(candidato.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CandidatosPage;