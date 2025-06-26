
import React, { useState, useEffect } from "react";
import { 
  format, 
  addDays, 
  subDays,
  startOfWeek, 
  eachHourOfInterval, 
  startOfDay, 
  endOfDay,
  isEqual,
  parseISO,
} from "date-fns";
import { es } from "date-fns/locale";
import { AppointmentModal } from "./AppointmentModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MedicalScheduleProps {
  view: "week" | "day" | "agenda";
}

// Mock data for scheduled appointments
const mockAppointments = [
  {
    id: 1,
    ordenId: 101,
    aspiranteNombre: "Juan Pérez",
    fecha: "2025-05-20T09:00:00",
    observacion: "Examen ocupacional de ingreso",
    especialista: "Dr. Carlos Rodríguez",
    especialidad: "Salud Ocupacional"
  },
  {
    id: 2,
    ordenId: 102,
    aspiranteNombre: "María Gómez",
    fecha: "2025-05-21T10:00:00",
    observacion: "Control anual",
    especialista: "Dra. Ana Torres",
    especialidad: "Salud Ocupacional"
  }
];

// Mock data for specialists
const mockEspecialistas = [
  { id: 1, nombre: "Dr. Carlos Rodríguez", especialidadId: 1 },
  { id: 2, nombre: "Dra. Ana Torres", especialidadId: 1 },
  { id: 3, nombre: "Dr. Juan Martínez", especialidadId: 2 },
  { id: 4, nombre: "Dra. Laura Sánchez", especialidadId: 3 }
];

// Mock data for specialties
const mockEspecialidades = [
  { id: 1, nombre: "Salud Ocupacional" },
  { id: 2, nombre: "Medicina General" },
  { id: 3, nombre: "Psicología Ocupacional" }
];

const MedicalSchedule = ({ view }: MedicalScheduleProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState<string>("");
  const [selectedEspecialista, setSelectedEspecialista] = useState<string>("");
  const [filteredEspecialistas, setFilteredEspecialistas] = useState(mockEspecialistas);
  
  // Update filtered specialists when specialty changes
  useEffect(() => {
    if (selectedEspecialidad) {
      const especialidadId = parseInt(selectedEspecialidad);
      const filtered = mockEspecialistas.filter(esp => esp.especialidadId === especialidadId);
      setFilteredEspecialistas(filtered);
      setSelectedEspecialista(""); // Reset selected specialist
    } else {
      setFilteredEspecialistas(mockEspecialistas);
    }
  }, [selectedEspecialidad]);
  
  // Generate days and hours based on view
  let daysToShow = 7; // Default for week view
  if (view === "day") {
    daysToShow = 1;
  } else if (view === "agenda") {
    daysToShow = 3; // Show 3 days in agenda view
  }
  
  const weekStart = view === "day" 
    ? currentDate 
    : startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  
  // Generate days to display
  const displayDays = Array.from({ length: daysToShow }, (_, i) => addDays(weekStart, i));
  
  // Generate hours of the day
  const dayHours = eachHourOfInterval({
    start: startOfDay(currentDate),
    end: endOfDay(addDays(currentDate, 1))
  }).slice(6, 20); // Only show hours from 6am to 7pm
  
  // Filter appointments by selected specialist
  const filteredAppointments = selectedEspecialista 
    ? mockAppointments.filter(app => app.especialista === mockEspecialistas.find(e => e.id === parseInt(selectedEspecialista))?.nombre)
    : mockAppointments;
  
  // Check if an appointment exists at a specific day and hour
  const getAppointment = (day: Date, hour: Date) => {
    return filteredAppointments.find(appointment => {
      const appointmentDate = parseISO(appointment.fecha);
      return (
        format(appointmentDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd") && 
        format(appointmentDate, "HH:00") === format(hour, "HH:00")
      );
    });
  };
  
  const handleCellClick = (day: Date, hour: Date) => {
    setSelectedDate(day);
    setSelectedHour(format(hour, "HH:mm"));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedHour(null);
  };

  // Helper to check if a day is today
  const isToday = (date: Date) => {
    return format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  };

  return (
    <div className="space-y-4">
      {/* Specialty and Specialist Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Especialidad</label>
          <Select 
            value={selectedEspecialidad} 
            onValueChange={setSelectedEspecialidad}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una especialidad" />
            </SelectTrigger>
            <SelectContent>
              {mockEspecialidades.map((especialidad) => (
                <SelectItem key={especialidad.id} value={especialidad.id.toString()}>
                  {especialidad.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Especialista</label>
          <Select 
            value={selectedEspecialista} 
            onValueChange={setSelectedEspecialista}
            disabled={filteredEspecialistas.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un especialista" />
            </SelectTrigger>
            <SelectContent>
              {filteredEspecialistas.map((especialista) => (
                <SelectItem key={especialista.id} value={especialista.id.toString()}>
                  {especialista.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Schedule */}
      <div className="border rounded-md overflow-hidden">
        <div className="grid grid-cols-8 border-b">
          {/* Empty cell for hour column */}
          <div className="border-r bg-muted p-2 text-center font-medium">
            Hora
          </div>
          
          {/* Weekday headers */}
          {displayDays.map((day, index) => (
            <div 
              key={index}
              className={`p-2 text-center font-medium border-r last:border-r-0 
                ${isToday(day) ? "bg-primary/10" : "bg-muted"}`}
              style={{ gridColumn: view === "day" ? "span 7" : "span 1" }}
            >
              <div>{format(day, "EEE d/M", { locale: es })}</div>
            </div>
          ))}
        </div>
        
        {/* Schedule grid */}
        <div className="grid grid-cols-8">
          {/* Time slots */}
          {dayHours.map((hour, hourIndex) => (
            <React.Fragment key={hourIndex}>
              {/* Hour column */}
              <div className="border-r border-b p-2 text-center text-sm text-muted-foreground">
                {format(hour, "h:mm a")}
              </div>
              
              {/* Days columns */}
              {displayDays.map((day, dayIndex) => {
                const appointment = getAppointment(day, hour);
                const isHighlighted = selectedEspecialista && !appointment;
                const colSpan = view === "day" ? 7 : 1;
                
                return (
                  <div
                    key={dayIndex}
                    onClick={() => handleCellClick(day, hour)}
                    className={`border-r border-b last:border-r-0 min-h-[60px] p-1 cursor-pointer relative
                      ${appointment ? "bg-green-50" : isHighlighted ? "bg-green-50/30" : ""}`}
                    style={{ gridColumn: `span ${colSpan}` }}
                  >
                    {appointment && (
                      <div className="absolute inset-1 bg-green-100 rounded p-1 text-xs overflow-hidden text-green-800 shadow-sm">
                        <div className="font-bold">{appointment.aspiranteNombre}</div>
                        <div className="truncate">{appointment.observacion}</div>
                        <div className="mt-1 text-[10px] text-green-600">{appointment.especialista}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Modal for creating appointments */}
      {isModalOpen && selectedDate && selectedHour && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          date={selectedDate}
          time={selectedHour}
          especialistaId={selectedEspecialista ? parseInt(selectedEspecialista) : undefined}
        />
      )}
    </div>
  );
};

export default MedicalSchedule;
