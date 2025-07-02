import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Save } from "lucide-react";
import { toast } from "sonner";
import CascadingSelects from '@/components/CascadingSelects';

export default function TestCascadingSelects() {
  const [selectedData, setSelectedData] = useState<{
    regionId: number | null;
    zonaId: number | null;
    sucursalId: number | null;
  }>({
    regionId: null,
    zonaId: null,
    sucursalId: null,
  });

  const handleSelectionChange = (regionId: number | null, zonaId: number | null, sucursalId: number | null) => {
    setSelectedData({ regionId, zonaId, sucursalId });
  };

  const handleSave = () => {
    if (selectedData.regionId && selectedData.zonaId && selectedData.sucursalId) {
      toast.success(`Datos guardados: Regional ${selectedData.regionId}, Zona ${selectedData.zonaId}, Sucursal ${selectedData.sucursalId}`);
    } else {
      toast.error('Debe completar toda la selección');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Test Selects Encadenados</h1>
            <p className="text-gray-600 mt-2">
              Componente de prueba para Regional → Zona → Sucursal
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <MapPin className="w-5 h-5" />
              Selección de Ubicación
            </CardTitle>
            <CardDescription>
              Seleccione la regional, zona y sucursal de trabajo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Componente de Selects Encadenados */}
              <CascadingSelects 
                onSelectionChange={handleSelectionChange}
              />

              {/* Información de Selección Actual */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Selección Actual:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Regional:</span>
                    <div className="text-gray-600">
                      {selectedData.regionId ? `ID: ${selectedData.regionId}` : 'No seleccionada'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Zona:</span>
                    <div className="text-gray-600">
                      {selectedData.zonaId ? `ID: ${selectedData.zonaId}` : 'No seleccionada'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Sucursal:</span>
                    <div className="text-gray-600">
                      {selectedData.sucursalId ? `ID: ${selectedData.sucursalId}` : 'No seleccionada'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Estado de Validación */}
              <div className={`p-3 rounded-lg ${
                selectedData.regionId && selectedData.zonaId && selectedData.sucursalId 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className={`font-medium ${
                  selectedData.regionId && selectedData.zonaId && selectedData.sucursalId 
                    ? 'text-green-800' 
                    : 'text-yellow-800'
                }`}>
                  {selectedData.regionId && selectedData.zonaId && selectedData.sucursalId 
                    ? '✓ Selección completa' 
                    : 'Selección incompleta'
                  }
                </div>
                <div className={`text-sm mt-1 ${
                  selectedData.regionId && selectedData.zonaId && selectedData.sucursalId 
                    ? 'text-green-600' 
                    : 'text-yellow-600'
                }`}>
                  {selectedData.regionId && selectedData.zonaId && selectedData.sucursalId 
                    ? 'Todos los campos han sido seleccionados correctamente'
                    : 'Complete todos los campos antes de guardar'
                  }
                </div>
              </div>

              {/* Botón de Prueba */}
              <div className="flex justify-end">
                <Button 
                  onClick={handleSave}
                  disabled={!selectedData.regionId || !selectedData.zonaId || !selectedData.sucursalId}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Selección
                </Button>
              </div>

              {/* JSON Debug (desarrollo) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
                  <div className="text-sm font-mono">
                    <div className="text-green-400 mb-2">// JSON Output:</div>
                    <pre>{JSON.stringify(selectedData, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}