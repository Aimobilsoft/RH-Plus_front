import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Download, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface CandidatoAprobado {
  id: number;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  estado: 'aprobado';
  fechaAprobacion: string;
  empresa: string;
}

export default function QrGenerarPage() {
  const [candidatosAprobados, setCandidatosAprobados] = useState<CandidatoAprobado[]>([
    {
      id: 1,
      cedula: "12345678",
      nombre: "Carlos",
      apellido: "Rodríguez",
      email: "carlos.rodriguez@email.com",
      estado: 'aprobado',
      fechaAprobacion: "2025-01-01",
      empresa: "TechCorp Solutions"
    },
    {
      id: 2,
      cedula: "87654321",
      nombre: "María",
      apellido: "González",
      email: "maria.gonzalez@email.com",
      estado: 'aprobado',
      fechaAprobacion: "2025-01-02",
      empresa: "TechCorp Solutions"
    }
  ]);

  const [selectedCandidato, setSelectedCandidato] = useState<CandidatoAprobado | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generarQR = async (candidato: CandidatoAprobado) => {
    setIsGenerating(true);
    setSelectedCandidato(candidato);
    
    try {
      // Crear la información del QR
      const qrData = {
        cedula: candidato.cedula,
        nombre: `${candidato.nombre} ${candidato.apellido}`,
        email: candidato.email,
        empresa: candidato.empresa,
        fechaGeneracion: new Date().toISOString(),
        valido: true
      };

      // Generar el código QR
      const qrString = JSON.stringify(qrData);
      const qrCodeDataURL = await QRCode.toDataURL(qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setQrCodeUrl(qrCodeDataURL);
      toast.success(`QR generado para ${candidato.nombre} ${candidato.apellido}`);
    } catch (error) {
      console.error('Error generando QR:', error);
      toast.error('Error al generar el código QR');
    } finally {
      setIsGenerating(false);
    }
  };

  const descargarQR = () => {
    if (!qrCodeUrl || !selectedCandidato) return;

    const link = document.createElement('a');
    link.download = `QR_${selectedCandidato.cedula}_${selectedCandidato.nombre}_${selectedCandidato.apellido}.png`;
    link.href = qrCodeUrl;
    link.click();
    
    toast.success('QR descargado exitosamente');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generar Códigos QR</h1>
          <p className="text-gray-600">Genera códigos QR para candidatos aprobados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de candidatos aprobados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Candidatos Aprobados
            </CardTitle>
            <CardDescription>
              Selecciona un candidato para generar su código QR
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {candidatosAprobados.length > 0 ? (
                candidatosAprobados.map((candidato) => (
                  <div
                    key={candidato.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedCandidato?.id === candidato.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedCandidato(candidato)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {candidato.nombre} {candidato.apellido}
                        </div>
                        <div className="text-sm text-gray-600">
                          Cédula: {candidato.cedula}
                        </div>
                        <div className="text-sm text-gray-600">
                          Email: {candidato.email}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Aprobado
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {candidato.fechaAprobacion}
                        </div>
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        generarQR(candidato);
                      }}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating && selectedCandidato?.id === candidato.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generando...
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4 mr-2" />
                          Generar QR
                        </>
                      )}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No hay candidatos aprobados</p>
                  <p className="text-sm">Los candidatos aprobados aparecerán aquí</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Visualización del QR */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="w-5 h-5 mr-2" />
              Código QR Generado
            </CardTitle>
            <CardDescription>
              Código QR con información del candidato
            </CardDescription>
          </CardHeader>
          <CardContent>
            {qrCodeUrl && selectedCandidato ? (
              <div className="space-y-4">
                <div className="text-center">
                  <img 
                    src={qrCodeUrl} 
                    alt="Código QR" 
                    className="mx-auto border rounded-lg shadow-sm"
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Información incluida:</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Cédula:</strong> {selectedCandidato.cedula}</p>
                    <p><strong>Nombre:</strong> {selectedCandidato.nombre} {selectedCandidato.apellido}</p>
                    <p><strong>Email:</strong> {selectedCandidato.email}</p>
                    <p><strong>Empresa:</strong> {selectedCandidato.empresa}</p>
                    <p><strong>Fecha generación:</strong> {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <Button 
                  onClick={descargarQR}
                  className="w-full"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar QR
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Selecciona un candidato</p>
                <p className="text-sm">El código QR aparecerá aquí una vez generado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}