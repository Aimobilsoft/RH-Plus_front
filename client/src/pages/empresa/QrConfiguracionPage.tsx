import React, { useState } from 'react';
import { Settings, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface QrConfig {
  periodoRenovacion: '15_dias' | '30_dias' | '6_meses' | '1_año';
  renovacionAutomatica: boolean;
  notificacionVencimiento: boolean;
  diasNotificacionPrevia: number;
}

export default function QrConfiguracionPage() {
  const [config, setConfig] = useState<QrConfig>({
    periodoRenovacion: '30_dias',
    renovacionAutomatica: true,
    notificacionVencimiento: true,
    diasNotificacionPrevia: 7
  });

  const [isLoading, setIsLoading] = useState(false);

  const periodoOptions = [
    { value: '15_dias', label: '15 días', descripcion: 'Renovación cada 15 días' },
    { value: '30_dias', label: '30 días', descripcion: 'Renovación mensual' },
    { value: '6_meses', label: '6 meses', descripcion: 'Renovación semestral' },
    { value: '1_año', label: '1 año', descripcion: 'Renovación anual' }
  ];

  const notificacionOptions = [
    { value: 1, label: '1 día antes' },
    { value: 3, label: '3 días antes' },
    { value: 7, label: '7 días antes' },
    { value: 15, label: '15 días antes' }
  ];

  const guardarConfiguracion = async () => {
    setIsLoading(true);
    
    try {
      // Simular guardado (aquí iría la llamada a la API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const resetearConfiguracion = () => {
    setConfig({
      periodoRenovacion: '30_dias',
      renovacionAutomatica: true,
      notificacionVencimiento: true,
      diasNotificacionPrevia: 7
    });
    toast.success('Configuración restablecida');
  };

  const getPeriodoLabel = (value: string) => {
    return periodoOptions.find(option => option.value === value)?.label || value;
  };

  const getPeriodoDescripcion = (value: string) => {
    return periodoOptions.find(option => option.value === value)?.descripcion || '';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración de QR</h1>
          <p className="text-gray-600">Gestiona la renovación y configuración de códigos QR</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={resetearConfiguracion}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Restablecer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración principal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Configuración de Renovación
            </CardTitle>
            <CardDescription>
              Establece los períodos de renovación para los códigos QR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Período de renovación */}
            <div className="space-y-2">
              <Label htmlFor="periodo">Período de Renovación</Label>
              <Select
                value={config.periodoRenovacion}
                onValueChange={(value: any) => setConfig({ ...config, periodoRenovacion: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el período" />
                </SelectTrigger>
                <SelectContent>
                  {periodoOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-gray-500">{option.descripcion}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600">
                Los códigos QR serán válidos por {getPeriodoLabel(config.periodoRenovacion)}
              </p>
            </div>

            <Separator />

            {/* Renovación automática */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Renovación Automática</Label>
                <p className="text-sm text-gray-600">
                  Renovar automáticamente códigos QR antes del vencimiento
                </p>
              </div>
              <Switch
                checked={config.renovacionAutomatica}
                onCheckedChange={(checked) => setConfig({ ...config, renovacionAutomatica: checked })}
              />
            </div>

            <Separator />

            {/* Notificaciones */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones de Vencimiento</Label>
                  <p className="text-sm text-gray-600">
                    Recibir notificaciones antes del vencimiento
                  </p>
                </div>
                <Switch
                  checked={config.notificacionVencimiento}
                  onCheckedChange={(checked) => setConfig({ ...config, notificacionVencimiento: checked })}
                />
              </div>

              {config.notificacionVencimiento && (
                <div className="space-y-2">
                  <Label>Días de Anticipación</Label>
                  <Select
                    value={config.diasNotificacionPrevia.toString()}
                    onValueChange={(value) => setConfig({ ...config, diasNotificacionPrevia: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificacionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button 
                onClick={guardarConfiguracion}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Guardar Configuración
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vista previa de configuración */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Resumen de Configuración
            </CardTitle>
            <CardDescription>
              Vista previa de la configuración actual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Período de renovación:</span>
                <Badge variant="outline">
                  {getPeriodoLabel(config.periodoRenovacion)}
                </Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Renovación automática:</span>
                <Badge variant={config.renovacionAutomatica ? "default" : "secondary"}>
                  {config.renovacionAutomatica ? "Activada" : "Desactivada"}
                </Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Notificaciones:</span>
                <Badge variant={config.notificacionVencimiento ? "default" : "secondary"}>
                  {config.notificacionVencimiento ? "Activadas" : "Desactivadas"}
                </Badge>
              </div>

              {config.notificacionVencimiento && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Anticipación:</span>
                  <Badge variant="outline">
                    {config.diasNotificacionPrevia} días
                  </Badge>
                </div>
              )}
            </div>

            <Separator />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-blue-900">
                    Información importante
                  </h4>
                  <p className="text-sm text-blue-800">
                    {getPeriodoDescripcion(config.periodoRenovacion)}. 
                    {config.renovacionAutomatica && " La renovación se realizará automáticamente."}
                    {config.notificacionVencimiento && ` Recibirás notificaciones ${config.diasNotificacionPrevia} días antes del vencimiento.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-green-900">
                    Estado actual
                  </h4>
                  <p className="text-sm text-green-800">
                    Configuración aplicada a todos los códigos QR nuevos y existentes.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}