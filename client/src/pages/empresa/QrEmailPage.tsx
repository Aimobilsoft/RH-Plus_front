import React, { useState } from 'react';
import { Send, Mail, CheckCircle, User, QrCode, Paperclip } from 'lucide-react';
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
  email: string;
  telefono: string;
  qrGenerado: boolean;
  fechaGeneracionQR: string;
}

export default function QrEmailPage() {
  const [candidatos] = useState<CandidatoConQR[]>([
    {
      id: 1,
      cedula: "12345678",
      nombre: "Carlos",
      apellido: "Rodríguez",
      email: "carlos.rodriguez@email.com",
      telefono: "+57 300 123 4567",
      qrGenerado: true,
      fechaGeneracionQR: "2025-01-03"
    },
    {
      id: 2,
      cedula: "87654321",
      nombre: "María",
      apellido: "González",
      email: "maria.gonzalez@email.com",
      telefono: "+57 301 987 6543",
      qrGenerado: true,
      fechaGeneracionQR: "2025-01-03"
    }
  ]);

  const [candidatosSeleccionados, setCandidatosSeleccionados] = useState<number[]>([]);
  const [asunto, setAsunto] = useState('Tu código QR de certificación - {{empresa}}');
  const [mensaje, setMensaje] = useState(`Estimado/a {{nombre}},

Esperamos que te encuentres bien.

Nos complace informarte que tu código QR de certificación ha sido generado exitosamente. Este código contiene tu información verificada y te permitirá acceder a las instalaciones de {{empresa}} de manera segura y eficiente.

**Información incluida en el QR:**
- Nombre completo: {{nombre}}
- Cédula de identidad: {{cedula}}
- Email de contacto: {{email}}
- Empresa: {{empresa}}
- Fecha de generación: {{fecha}}

**Instrucciones importantes:**
1. Guarda este código QR en tu teléfono móvil
2. Preséntalo siempre al ingresar a las instalaciones
3. Manténlo actualizado según las políticas de renovación
4. No compartas este código con terceros

En caso de que tengas alguna pregunta o requieras asistencia, no dudes en contactarnos.

Atentamente,
Equipo de Recursos Humanos
{{empresa}}`);
  
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

  const enviarPorEmail = async () => {
    if (candidatosSeleccionados.length === 0) {
      toast.error('Selecciona al menos un candidato');
      return;
    }

    setIsEnviando(true);

    try {
      for (const candidatoId of candidatosSeleccionados) {
        const candidato = candidatos.find(c => c.id === candidatoId);
        if (candidato) {
          // Personalizar asunto y mensaje
          const asuntoPersonalizado = asunto
            .replace(/\{\{empresa\}\}/g, 'TechCorp Solutions')
            .replace(/\{\{nombre\}\}/g, `${candidato.nombre} ${candidato.apellido}`);

          const mensajePersonalizado = mensaje
            .replace(/\{\{nombre\}\}/g, `${candidato.nombre} ${candidato.apellido}`)
            .replace(/\{\{cedula\}\}/g, candidato.cedula)
            .replace(/\{\{email\}\}/g, candidato.email)
            .replace(/\{\{empresa\}\}/g, 'TechCorp Solutions')
            .replace(/\{\{fecha\}\}/g, new Date().toLocaleDateString());

          // Simular envío por email
          console.log(`Enviando email a ${candidato.email}:`);
          console.log(`Asunto: ${asuntoPersonalizado}`);
          console.log(`Mensaje: ${mensajePersonalizado}`);
          
          // Simular delay
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }

      toast.success(`QR enviado por email a ${candidatosSeleccionados.length} candidato(s)`);
      setCandidatosSeleccionados([]);
    } catch (error) {
      console.error('Error enviando por email:', error);
      toast.error('Error al enviar por email');
    } finally {
      setIsEnviando(false);
    }
  };

  const previsualizarMensaje = (candidato: CandidatoConQR) => {
    return {
      asunto: asunto
        .replace(/\{\{empresa\}\}/g, 'TechCorp Solutions')
        .replace(/\{\{nombre\}\}/g, `${candidato.nombre} ${candidato.apellido}`),
      mensaje: mensaje
        .replace(/\{\{nombre\}\}/g, `${candidato.nombre} ${candidato.apellido}`)
        .replace(/\{\{cedula\}\}/g, candidato.cedula)
        .replace(/\{\{email\}\}/g, candidato.email)
        .replace(/\{\{empresa\}\}/g, 'TechCorp Solutions')
        .replace(/\{\{fecha\}\}/g, new Date().toLocaleDateString())
    };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enviar QR por Email</h1>
          <p className="text-gray-600">Envía códigos QR a candidatos a través de correo electrónico</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de candidatos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
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
              Selecciona los candidatos para enviar su código QR por email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {candidatos.map((candidato) => (
                <div
                  key={candidato.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    candidatosSeleccionados.includes(candidato.id) 
                      ? 'border-blue-500 bg-blue-50' 
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
                        <Mail className="w-4 h-4 mr-1" />
                        {candidato.email}
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
                onClick={enviarPorEmail}
                disabled={candidatosSeleccionados.length === 0 || isEnviando}
                size="lg"
              >
                {isEnviando ? (
                  <>
                    <Mail className="w-4 h-4 mr-2 animate-pulse" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar por Email ({candidatosSeleccionados.length})
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Editor de email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Personalizar Email
            </CardTitle>
            <CardDescription>
              Edita el asunto y contenido del email que se enviará
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asunto">Asunto del Email</Label>
              <Input
                id="asunto"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                placeholder="Asunto del email..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensaje">Contenido del Email</Label>
              <Textarea
                id="mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                rows={12}
                placeholder="Escribe el contenido del email aquí..."
              />
              <div className="text-xs text-gray-500">
                Variables disponibles: <code>{'{{nombre}}'}</code>, <code>{'{{cedula}}'}</code>, <code>{'{{email}}'}</code>, <code>{'{{empresa}}'}</code>, <code>{'{{fecha}}'}</code>
              </div>
            </div>

            <Separator />

            {/* Vista previa */}
            <div className="space-y-2">
              <Label>Vista Previa del Email</Label>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="text-sm font-medium text-gray-700 mb-3">
                  Vista previa para: {candidatos[0]?.nombre} {candidatos[0]?.apellido}
                </div>
                
                {candidatos.length > 0 && (
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border">
                      <div className="text-xs text-gray-500 mb-1">Asunto:</div>
                      <div className="font-medium text-sm">
                        {previsualizarMensaje(candidatos[0]).asunto}
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border">
                      <div className="text-xs text-gray-500 mb-1">Contenido:</div>
                      <div className="text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {previsualizarMensaje(candidatos[0]).mensaje}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Paperclip className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-blue-900">
                    Archivos adjuntos
                  </h4>
                  <p className="text-sm text-blue-800">
                    El código QR se adjuntará automáticamente como imagen PNG al email. 
                    El email se personalizará para cada candidato seleccionado.
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