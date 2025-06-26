
import { useState } from "react";
import { Calendar, CheckCircle, Clock, UserCheck, XCircle } from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

// Define appointment status types
type AppointmentStatus = 'pendiente' | 'en_recepcion' | 'en_consultorio' | 'inasistencia' | 'finalizada';

// Define appointment interface
interface Appointment {
  id: number;
  aspiranteNombre: string;
  fecha: string;
  hora: string;
  especialista: string;
  especialidad: string;
  ordenId: number;
  estado: AppointmentStatus;
}

// Mock data for appointments
const mockAppointments: Appointment[] = [
  {
    id: 1,
    aspiranteNombre: "Juan Pérez",
    fecha: "2025-05-20",
    hora: "09:00",
    especialista: "Dr. Carlos Rodríguez",
    especialidad: "Salud Ocupacional",
    ordenId: 101,
    estado: "pendiente"
  },
  {
    id: 2,
    aspiranteNombre: "María López",
    fecha: "2025-05-20",
    hora: "10:30",
    especialista: "Dra. Ana Torres",
    especialidad: "Medicina General",
    ordenId: 102,
    estado: "en_recepcion"
  },
  {
    id: 3,
    aspiranteNombre: "Pedro González",
    fecha: "2025-05-20",
    hora: "11:45",
    especialista: "Dr. Juan Martínez",
    especialidad: "Psicología Ocupacional",
    ordenId: 103,
    estado: "en_consultorio"
  },
  {
    id: 4,
    aspiranteNombre: "Carla Sánchez",
    fecha: "2025-05-21",
    hora: "08:15",
    especialista: "Dra. Laura Sánchez",
    especialidad: "Salud Ocupacional",
    ordenId: 104,
    estado: "inasistencia"
  },
  {
    id: 5,
    aspiranteNombre: "Roberto Díaz",
    fecha: "2025-05-21",
    hora: "14:00",
    especialista: "Dr. Carlos Rodríguez",
    especialidad: "Salud Ocupacional",
    ordenId: 105,
    estado: "finalizada"
  }
];

const CitasProgramadasPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Function to get status badge based on appointment status
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "pendiente":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case "en_recepcion":
        return <Badge variant="outline" className="bg-green-100 text-green-800">En Recepción</Badge>;
      case "en_consultorio":
        return <Badge variant="outline" className="bg-green-100 text-green-800">En Consultorio</Badge>;
      case "inasistencia":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Inasistencia</Badge>;
      case "finalizada":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Finalizada</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  // Function to update appointment status
  const updateAppointmentStatus = (id: number, newStatus: AppointmentStatus) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, estado: newStatus } : appointment
    ));
    toast.success(`Estado de cita actualizado a: ${getStatusText(newStatus)}`);
  };

  // Function to get readable status text
  const getStatusText = (status: AppointmentStatus): string => {
    const statusMap: Record<AppointmentStatus, string> = {
      pendiente: "Pendiente",
      en_recepcion: "En Recepción",
      en_consultorio: "En Consultorio",
      inasistencia: "Inasistencia",
      finalizada: "Finalizada"
    };
    return statusMap[status] || "Desconocido";
  };

  // Function to filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    let matchesDate = true;
    let matchesStatus = true;

    if (selectedDate) {
      matchesDate = appointment.fecha === selectedDate;
    }

    if (selectedStatus) {
      matchesStatus = appointment.estado === selectedStatus;
    }

    return matchesDate && matchesStatus;
  });

  // Function to clear all filters
  const clearFilters = () => {
    setSelectedDate("");
    setSelectedStatus("");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Citas Programadas</h1>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Fecha</label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Estado</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_recepcion">En Recepción</SelectItem>
                  <SelectItem value="en_consultorio">En Consultorio</SelectItem>
                  <SelectItem value="inasistencia">Inasistencia</SelectItem>
                  <SelectItem value="finalizada">Finalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters}>
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="px-6">
          <div className="flex justify-between items-center">
            <CardTitle>Listado de Citas</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-xs">Pendientes: {appointments.filter(a => a.estado === 'pendiente').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <UserCheck className="h-4 w-4 text-blue-500" />
                <span className="text-xs">En Recepción: {appointments.filter(a => a.estado === 'en_recepcion').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs">En Consultorio: {appointments.filter(a => a.estado === 'en_consultorio').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-xs">Inasistencia: {appointments.filter(a => a.estado === 'inasistencia').length}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Orden ID</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Especialista</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.id}</TableCell>
                      <TableCell>{appointment.ordenId}</TableCell>
                      <TableCell>{appointment.aspiranteNombre}</TableCell>
                      <TableCell>{appointment.fecha}</TableCell>
                      <TableCell>{appointment.hora}</TableCell>
                      <TableCell>{appointment.especialidad}</TableCell>
                      <TableCell>{appointment.especialista}</TableCell>
                      <TableCell>{getStatusBadge(appointment.estado)}</TableCell>
                      <TableCell className="text-right">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                              Cambiar Estado
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-2">
                            <div className="flex flex-col space-y-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="justify-start"
                                onClick={() => updateAppointmentStatus(appointment.id, 'pendiente')}
                              >
                                <Clock className="mr-2 h-4 w-4" /> Pendiente
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="justify-start"
                                onClick={() => updateAppointmentStatus(appointment.id, 'en_recepcion')}
                              >
                                <UserCheck className="mr-2 h-4 w-4" /> En Recepción
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="justify-start"
                                onClick={() => updateAppointmentStatus(appointment.id, 'en_consultorio')}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" /> En Consultorio
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="justify-start text-red-600"
                                onClick={() => updateAppointmentStatus(appointment.id, 'inasistencia')}
                              >
                                <XCircle className="mr-2 h-4 w-4" /> Inasistencia
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="justify-start text-gray-600"
                                onClick={() => updateAppointmentStatus(appointment.id, 'finalizada')}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" /> Finalizada
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      No se encontraron citas con los filtros seleccionados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CitasProgramadasPage;
