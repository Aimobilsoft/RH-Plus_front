import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Eye, 
  Users, 
  Plus,
  Filter,
  MoreHorizontal,
  MessageCircle,
  Mail,
  Check,
  X,
  Clock,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Candidato {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  numeroDocumento: string;
  tipoDocumento: string;
  telefono?: string;
  cargoAspirado?: string;
  estado: string;
  notasAprobacion?: string;
  fechaRegistro: string;
  completado: boolean;
  fechaNacimiento?: string;
  direccion?: string;
  ciudad?: string;
  eps?: string;
  arl?: string;
  nivelEducativo?: string;
}

interface QrConfig {
  renovacion: string;
  mensaje: string;
}

export default function CandidatosEmpresa() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [filteredCandidatos, setFilteredCandidatos] = useState<Candidato[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [qrConfig, setQrConfig] = useState<QrConfig>({ renovacion: '30-dias', mensaje: '' });
  
  // Estados para modales
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);
  const [approvalAction, setApprovalAction] = useState<'aprobar' | 'rechazar'>('aprobar');
  const [notas, setNotas] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    loadCandidatos();
    loadQrConfig();
  }, []);

  useEffect(() => {
    filterCandidatos();
  }, [candidatos, searchTerm, filterEstado]);

  const loadCandidatos = async () => {
    try {
      const response = await fetch('/api/empresa/candidatos');
      if (response.ok) {
        const data = await response.json();
        setCandidatos(data);
      } else {
        throw new Error('Error al cargar candidatos');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar la lista de candidatos');
    } finally {
      setIsLoading(false);
    }
  };

  const loadQrConfig = async () => {
    try {
      const response = await fetch('/api/empresa/qr/config');
      if (response.ok) {
        const config = await response.json();
        setQrConfig(config);
      }
    } catch (error) {
      console.error('Error loading QR config:', error);
    }
  };

  const filterCandidatos = () => {
    let filtered = candidatos;

    if (searchTerm) {
      filtered = filtered.filter(candidato => 
        candidato.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidato.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidato.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidato.numeroDocumento.includes(searchTerm)
      );
    }

    if (filterEstado !== 'todos') {
      filtered = filtered.filter(candidato => candidato.estado === filterEstado);
    }

    setFilteredCandidatos(filtered);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aprobado</Badge>;
      case 'rechazado':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rechazado</Badge>;
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const handleQuickSendWhatsApp = async (candidato: Candidato) => {
    try {
      const mensaje = qrConfig.mensaje || `Hola ${candidato.nombres} ${candidato.apellidos}, tu código QR de certificación está listo.`;
      const telefono = candidato.telefono?.replace(/\D/g, '') || '';
      
      if (!telefono) {
        toast.error('Este candidato no tiene número de teléfono registrado');
        return;
      }

      const whatsappUrl = `https://wa.me/57${telefono}?text=${encodeURIComponent(mensaje)}`;
      
      console.log(`Enviando a ${candidato.nombres}: ${whatsappUrl}`);
      window.open(whatsappUrl, '_blank');
      
      toast.success(`QR enviado por WhatsApp a ${candidato.nombres}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al enviar por WhatsApp');
    }
  };

  const handleQuickSendEmail = async (candidato: Candidato) => {
    try {
      const asunto = 'Tu código QR de certificación está listo';
      const mensaje = qrConfig.mensaje || `Hola ${candidato.nombres} ${candidato.apellidos},\n\nTu código QR de certificación está listo. Este código contiene tu información verificada.\n\nSaludos,\nEquipo de Recursos Humanos`;
      
      const emailUrl = `mailto:${candidato.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`;
      
      window.open(emailUrl, '_blank');
      
      toast.success(`QR enviado por email a ${candidato.nombres}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al enviar por email');
    }
  };

  const handleApprovalSubmit = async () => {
    if (!selectedCandidato) return;

    try {
      const response = await fetch(`/api/empresa/candidatos/${selectedCandidato.id}/approval`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: approvalAction === 'aprobar' ? 'aprobado' : 'rechazado',
          notasAprobacion: notas,
        }),
      });

      if (response.ok) {
        toast.success(`Candidato ${approvalAction === 'aprobar' ? 'aprobado' : 'rechazado'} exitosamente`);
        setShowApprovalModal(false);
        setSelectedCandidato(null);
        setNotas('');
        loadCandidatos();
      } else {
        throw new Error('Error al actualizar candidato');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el estado del candidato');
    }
  };

  const calcularProgresoPerfil = (candidato: Candidato) => {
    const camposRequeridos = [
      'nombres', 'apellidos', 'fechaNacimiento', 'telefono', 'direccion', 
      'ciudad', 'cargoAspirado', 'eps', 'arl', 'nivelEducativo'
    ];
    
    const camposCompletos = camposRequeridos.filter(campo => {
      const valor = candidato[campo as keyof Candidato];
      return valor && valor.toString().trim() !== '';
    });
    
    return Math.round((camposCompletos.length / camposRequeridos.length) * 100);
  };

  const openApprovalModal = (candidato: Candidato, action: 'aprobar' | 'rechazar') => {
    setSelectedCandidato(candidato);
    setApprovalAction(action);
    setNotas(candidato.notasAprobacion || '');
    setShowApprovalModal(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando candidatos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidatos</h1>
          <p className="text-gray-600">Gestiona y revisa los candidatos de tu empresa</p>
        </div>
        <Button onClick={() => navigate('/empresa/candidatos/crear')} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Crear Candidato</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, email o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterEstado} onValueChange={setFilterEstado}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="pendiente">Pendientes</SelectItem>
            <SelectItem value="aprobado">Aprobados</SelectItem>
            <SelectItem value="rechazado">Rechazados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-2xl font-bold">{candidatos.length}</p>
                <p className="text-xs text-muted-foreground">Total Candidatos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div className="ml-2">
                <p className="text-2xl font-bold">{candidatos.filter(c => c.estado === 'pendiente').length}</p>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500" />
              <div className="ml-2">
                <p className="text-2xl font-bold">{candidatos.filter(c => c.estado === 'aprobado').length}</p>
                <p className="text-xs text-muted-foreground">Aprobados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <X className="h-4 w-4 text-red-500" />
              <div className="ml-2">
                <p className="text-2xl font-bold">{candidatos.filter(c => c.estado === 'rechazado').length}</p>
                <p className="text-xs text-muted-foreground">Rechazados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidates List */}
      <div className="grid gap-4">
        {filteredCandidatos.length > 0 ? (
          filteredCandidatos.map((candidato) => (
            <Card key={candidato.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {candidato.nombres} {candidato.apellidos}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{candidato.tipoDocumento}: {candidato.numeroDocumento}</span>
                          <span>{candidato.email}</span>
                          {candidato.telefono && <span>{candidato.telefono}</span>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getEstadoBadge(candidato.estado)}
                        {candidato.completado && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Completo
                          </Badge>
                        )}
                      </div>
                    </div>

                    {candidato.cargoAspirado && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Cargo aspirado:</strong> {candidato.cargoAspirado}
                      </p>
                    )}

                    {/* Progreso del perfil */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Progreso del perfil</span>
                        <span className="text-sm text-gray-600">{calcularProgresoPerfil(candidato)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${calcularProgresoPerfil(candidato)}%` }}
                        ></div>
                      </div>
                    </div>

                    {candidato.notasAprobacion && (
                      <div className="bg-gray-50 p-3 rounded-md mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Notas de aprobación:</p>
                        <p className="text-sm text-gray-600">{candidato.notasAprobacion}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      Registrado: {new Date(candidato.fechaRegistro).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {/* Botones de envío rápido */}
                    {candidato.telefono && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickSendWhatsApp(candidato)}
                        className="flex items-center space-x-1 text-green-600 border-green-300 hover:bg-green-50"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSendEmail(candidato)}
                      className="flex items-center space-x-1 text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/empresa/candidatos/${candidato.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        
                        {/* Botones de aprobación en el menú desplegable */}
                        {candidato.estado === 'pendiente' && (
                          <>
                            <DropdownMenuItem onClick={() => openApprovalModal(candidato, 'aprobar')}>
                              <Check className="w-4 h-4 mr-2 text-green-600" />
                              <span className="text-green-600">Aprobar candidato</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => openApprovalModal(candidato, 'rechazar')}>
                              <X className="w-4 h-4 mr-2 text-red-600" />
                              <span className="text-red-600">Rechazar candidato</span>
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        {candidato.estado !== 'pendiente' && (
                          <DropdownMenuItem onClick={() => openApprovalModal(candidato, candidato.estado === 'aprobado' ? 'rechazar' : 'aprobar')}>
                            <FileText className="w-4 h-4 mr-2" />
                            Cambiar estado
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay candidatos</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterEstado !== 'todos' 
                  ? 'No se encontraron candidatos con los filtros aplicados.' 
                  : 'Aún no has creado ningún candidato.'}
              </p>
              {!searchTerm && filterEstado === 'todos' && (
                <Button onClick={() => navigate('/empresa/candidatos/crear')}>
                  Crear primer candidato
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de aprobación */}
      <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'aprobar' ? 'Aprobar' : 'Rechazar'} candidato
            </DialogTitle>
            <DialogDescription>
              {selectedCandidato && (
                <>
                  {approvalAction === 'aprobar' ? 'Aprobar' : 'Rechazar'} a{' '}
                  <strong>{selectedCandidato.nombres} {selectedCandidato.apellidos}</strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="notas">
                Notas {approvalAction === 'aprobar' ? 'de aprobación' : 'de rechazo'}
              </Label>
              <Textarea
                id="notas"
                placeholder={
                  approvalAction === 'aprobar'
                    ? 'Ej: Candidato aprobado. Debe subir certificado médico antes del primer día...'
                    : 'Ej: Falta documentación requerida. Debe completar curso de seguridad...'
                }
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleApprovalSubmit}
              className={approvalAction === 'aprobar' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {approvalAction === 'aprobar' ? 'Aprobar' : 'Rechazar'} candidato
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}