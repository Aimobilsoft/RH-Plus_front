import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Datos mock
const regionales = [
  { id: 1, nombre: 'NOROCCIDENTE', estado: 1 },
  { id: 2, nombre: 'CENTRO', estado: 1 },
  { id: 3, nombre: 'CENTRO ORIENTE', estado: 1 },
  { id: 4, nombre: 'COSTA', estado: 1 },
  { id: 5, nombre: 'CASA MATRIZ', estado: 1 },
  { id: 6, nombre: 'NORTE', estado: 1 },
  { id: 7, nombre: 'SUROCCIDENTE', estado: 1 }
];

const zonas = [
  { id: 1, region_id: 1, nombre: 'ANTIOQUIA', estado: 1 },
  { id: 2, region_id: 4, nombre: 'ATLANTICO', estado: 1 },
  { id: 3, region_id: 2, nombre: 'BOGOTA', estado: 1 },
  { id: 12, region_id: 7, nombre: 'CAUCA', estado: 1 },
  { id: 13, region_id: 7, nombre: 'QUINDIO', estado: 1 },
  { id: 16, region_id: 7, nombre: 'VALLE DEL CAUCA', estado: 1 }
];

const sucursales = [
  { id: 1, nombre: 'BG - Chapinero', zona_id: 3, estado: 1 },
  { id: 2, nombre: 'BG - Kennedy', zona_id: 3, estado: 1 },
  { id: 3, nombre: 'CL - Cali Norte Ideo', zona_id: 16, estado: 1 },
  { id: 4, nombre: 'CL - Imbanaco', zona_id: 16, estado: 1 },
  { id: 5, nombre: 'PL - Palmira', zona_id: 16, estado: 1 },
  { id: 6, nombre: 'CAUCA CENTRAL', zona_id: 12, estado: 1 }
];

interface CascadingSelectsProps {
  onSelectionChange?: (regionId: number | null, zonaId: number | null, sucursalId: number | null) => void;
  initialValues?: {
    regionId?: number;
    zonaId?: number;
    sucursalId?: number;
  };
  disabled?: boolean;
}

const CascadingSelects = ({ onSelectionChange, initialValues, disabled = false }: CascadingSelectsProps) => {
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(initialValues?.regionId || null);
  const [selectedZonaId, setSelectedZonaId] = useState<number | null>(initialValues?.zonaId || null);
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | null>(initialValues?.sucursalId || null);

  // Filtrar datos activos
  const activeRegionales = regionales.filter(r => r.estado === 1);
  const activeZonas = zonas.filter(z => z.estado === 1 && z.region_id === selectedRegionId);
  const activeSucursales = sucursales.filter(s => s.estado === 1 && s.zona_id === selectedZonaId);

  // Manejar cambio de regional
  const handleRegionalChange = (value: string) => {
    const regionId = parseInt(value);
    setSelectedRegionId(regionId);
    setSelectedZonaId(null); // Reset zona
    setSelectedSucursalId(null); // Reset sucursal
  };

  // Manejar cambio de zona
  const handleZonaChange = (value: string) => {
    const zonaId = parseInt(value);
    setSelectedZonaId(zonaId);
    setSelectedSucursalId(null); // Reset sucursal
  };

  // Manejar cambio de sucursal
  const handleSucursalChange = (value: string) => {
    const sucursalId = parseInt(value);
    setSelectedSucursalId(sucursalId);
  };

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedRegionId, selectedZonaId, selectedSucursalId);
    }
  }, [selectedRegionId, selectedZonaId, selectedSucursalId, onSelectionChange]);

  return (
    <div className="space-y-4">
      {/* Regional Select */}
      <div className="space-y-2">
        <Label htmlFor="regional">Regional *</Label>
        <Select 
          value={selectedRegionId?.toString() || ""} 
          onValueChange={handleRegionalChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una regional" />
          </SelectTrigger>
          <SelectContent>
            {activeRegionales.map((regional) => (
              <SelectItem key={regional.id} value={regional.id.toString()}>
                {regional.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Zona Select */}
      <div className="space-y-2">
        <Label htmlFor="zona">Zona *</Label>
        <Select 
          value={selectedZonaId?.toString() || ""} 
          onValueChange={handleZonaChange}
          disabled={disabled || !selectedRegionId}
        >
          <SelectTrigger className={!selectedRegionId ? "opacity-50" : ""}>
            <SelectValue placeholder="Seleccione una zona" />
          </SelectTrigger>
          <SelectContent>
            {activeZonas.map((zona) => (
              <SelectItem key={zona.id} value={zona.id.toString()}>
                {zona.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!selectedRegionId && (
          <p className="text-sm text-gray-500">Primero seleccione una regional</p>
        )}
      </div>

      {/* Sucursal Select */}
      <div className="space-y-2">
        <Label htmlFor="sucursal">Sucursal *</Label>
        <Select 
          value={selectedSucursalId?.toString() || ""} 
          onValueChange={handleSucursalChange}
          disabled={disabled || !selectedZonaId}
        >
          <SelectTrigger className={!selectedZonaId ? "opacity-50" : ""}>
            <SelectValue placeholder="Seleccione una sucursal" />
          </SelectTrigger>
          <SelectContent>
            {activeSucursales.map((sucursal) => (
              <SelectItem key={sucursal.id} value={sucursal.id.toString()}>
                {sucursal.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!selectedZonaId && (
          <p className="text-sm text-gray-500">Primero seleccione una zona</p>
        )}
      </div>

      {/* Debug info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
          <p><strong>Selección actual:</strong></p>
          <p>Regional ID: {selectedRegionId || 'No seleccionada'}</p>
          <p>Zona ID: {selectedZonaId || 'No seleccionada'}</p>
          <p>Sucursal ID: {selectedSucursalId || 'No seleccionada'}</p>
        </div>
      )}
    </div>
  );
};

export default CascadingSelects;