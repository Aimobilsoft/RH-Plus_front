import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle, User, QrCode, Phone } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface CandidatoConQR {
  id: number;
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  qrGenerado: boolean;
  fechaGeneracionQR: string;
}

export default function QrWhatsAppPage() {
  const [candidatos] = useState<CandidatoConQR[]>([
    {
      id: 1,
      cedula: "12345678",
      nombre: "Carlos",
      apellido: "Rodríguez",
      telefono: "+57 300 123 4567",
      email: "carlos.rodriguez@email.com",
      qrGenerado: true,
      fechaGeneracionQR: "2025-01-03"
    },
    {
      id: 2,
      cedula: "87654321",
      nombre: "María",
      apellido: "González",
      telefono: "+57 301 987 6543",
      email: "maria.gonzalez@email.com",
      qrGenerado: true,
      fechaGeneracionQR: "2025-01-03"
    }
  ]);

  const [candidatosSeleccionados, setCandidatosSeleccionados] = useState<number[]>([]);
  const [mensaje, setMensaje] = useState(`Hola {{nombre}},

Tu código QR de certificación está listo. Este código contiene tu información verificada para acceso a las instalaciones de {{empresa}}.

Por favor, manténlo siempre contigo durante tu horario laboral.

Saludos,
Equipo de Recursos Humanos`);
  
  const [isEnviando, setIsEnviando] = useState(false);

  const toggleCandidato = (candidatoId: number) => {
    setCandidatosSeleccionados(prev => 
      prev.includes(candidatoId)
        ? prev.filter(id => id !== candidatoId)
        : [...prev, candidatoId]
    );
  };

  const seleccionarTodos = () => {
    setCandidatosSeleccionados(
      candidatosSeleccionados.length === candidatos.length 
        ? [] 
        : candidatos.map(c => c.id)
    );
  };

  const enviarPorWhatsApp = async () => {
    if (candidatosSeleccionados.length === 0) {
      toast.error('Selecciona al menos un candidato');
      return;
    }

    setIsEnviando(true);

    try {
      for (const candidatoId of candidatosSeleccionados) {
        const candidato = candidatos.find(c => c.id === candidatoId);
        if (candidato) {
          // Personalizar mensaje
          const mensajePersonalizado = mensaje
            .replace(/\{\{nombre\}\}/g, `${candidato.nombre} ${candidato.apellido}`)
            .replace(/\{\{empresa\}\}/g, 'TechCorp Solutions');

          // Simular envío por WhatsApp
          const whatsappUrl = `https://wa.me/${candidato.telefono.replace(/\s+/g, '').replace('+', '')}?text=${encodeURIComponent(mensajePersonalizado)}`;
          
          // Abrir WhatsApp (en un entorno real, esto abriría WhatsApp)
          console.log(`Enviando a ${candidato.nombre}: ${whatsappUrl}`);
          
          // Simular delay
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      toast.success(`QR enviado por WhatsApp a ${candidatosSeleccionados.length} candidato(s)`);
      setCandidatosSeleccionados([]);
    } catch (error) {
      console.error('Error enviando por WhatsApp:', error);
      toast.error('Error al enviar por WhatsApp');
    } finally {
      setIsEnviando(false);
    }
  };

  const previsualizarMensaje = (candidato: CandidatoConQR) => {
    return mensaje
      .replace(/\{\{nombre\}\}/g, `${candidato.nombre} ${candidato.apellido}`)
      .replace(/\{\{empresa\}\}/g, 'TechCorp Solutions');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enviar QR por WhatsApp</h1>
          <p className="text-gray-600">Envía códigos QR a candidatos a través de WhatsApp</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de candidatos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Candidatos con QR
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={seleccionarTodos}
              >
                {candidatosSeleccionados.length === candidatos.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
              </Button>
            </CardTitle>
            <CardDescription>
              Selecciona los candidatos para enviar su código QR por WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {candidatos.map((candidato) => (
                <div
                  key={candidato.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    candidatosSeleccionados.includes(candidato.id) 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={candidatosSeleccionados.includes(candidato.id)}
                      onCheckedChange={() => toggleCandidato(candidato.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {candidato.nombre} {candidato.apellido}
                          </div>
                          <div className="text-sm text-gray-600">
                            Cédula: {candidato.cedula}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <QrCode className="w-3 h-3 mr-1" />
                          QR Listo
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-1" />
                        {candidato.telefono}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        QR generado: {candidato.fechaGeneracionQR}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center text-sm">
              <span>Seleccionados: {candidatosSeleccionados.length} de {candidatos.length}</span>
              <Button
                onClick={enviarPorWhatsApp}
                disabled={candidatosSeleccionados.length === 0 || isEnviando}
                size="lg"
              >
                {isEnviando ? (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2 animate-pulse" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar por WhatsApp ({candidatosSeleccionados.length})
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Editor de mensaje */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Personalizar Mensaje
            </CardTitle>
            <CardDescription>
              Edita el mensaje que se enviará junto con el código QR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mensaje">Mensaje de WhatsApp</Label>
              <Textarea
                id="mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                rows={8}
                placeholder="Escribe tu mensaje aquí..."
              />
              <div className="text-xs text-gray-500">
                Variables disponibles: <code>{'{{nombre}}'}</code>, <code>{'{{empresa}}'}</code>
              </div>
            </div>

            <Separator />

            {/* Vista previa */}
            <div className="space-y-2">
              <Label>Vista Previa del Mensaje</Label>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Vista previa para: {candidatos[0]?.nombre} {candidatos[0]?.apellido}
                </div>
                <div className="text-sm whitespace-pre-wrap bg-white p-3 rounded border">
                  {candidatos.length > 0 && previsualizarMensaje(candidatos[0])}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-blue-900">
                    Información del envío
                  </h4>
                  <p className="text-sm text-blue-800">
                    El mensaje se personalizará automáticamente para cada candidato. 
                    El código QR se adjuntará como imagen al mensaje de WhatsApp.
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