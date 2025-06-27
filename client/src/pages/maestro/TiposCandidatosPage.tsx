import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const tipoCandidatoSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  descripcion: z.string().optional(),
});

const documentoTipoSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  descripcion: z.string().optional(),
  requerido: z.boolean().default(false),
});

type TipoCandidatoForm = z.infer<typeof tipoCandidatoSchema>;
type DocumentoTipoForm = z.infer<typeof documentoTipoSchema>;

export default function TiposCandidatosPage() {
  const [showTipoDialog, setShowTipoDialog] = useState(false);
  const [showDocumentoDialog, setShowDocumentoDialog] = useState(false);
  const [editingTipo, setEditingTipo] = useState<any>(null);
  const [editingDocumento, setEditingDocumento] = useState<any>(null);
  const [selectedTipo, setSelectedTipo] = useState<any>(null);
  const [showDocumentosConfig, setShowDocumentosConfig] = useState(false);

  const queryClient = useQueryClient();

  // Queries
  const { data: tiposCandidatos = [], isLoading: loadingTipos } = useQuery({
    queryKey: ['/api/maestro/tipos-candidatos'],
    queryFn: () => fetch('/api/maestro/tipos-candidatos').then(res => res.json()),
  });

  const { data: documentosTipo = [], isLoading: loadingDocumentos } = useQuery({
    queryKey: ['/api/maestro/documentos-tipo'],
    queryFn: () => fetch('/api/maestro/documentos-tipo').then(res => res.json()),
  });

  const { data: documentosRequeridos = [], isLoading: loadingRequeridos } = useQuery({
    queryKey: ['/api/maestro/tipos-candidatos-documentos', selectedTipo?.id],
    queryFn: () => selectedTipo ? fetch(`/api/maestro/tipos-candidatos-documentos/${selectedTipo.id}`).then(res => res.json()) : [],
    enabled: !!selectedTipo,
  });

  // Forms
  const tipoForm = useForm<TipoCandidatoForm>({
    resolver: zodResolver(tipoCandidatoSchema),
    defaultValues: { nombre: '', descripcion: '' },
  });

  const documentoForm = useForm<DocumentoTipoForm>({
    resolver: zodResolver(documentoTipoSchema),
    defaultValues: { nombre: '', descripcion: '', requerido: false },
  });

  // Mutations
  const createTipoMutation = useMutation({
    mutationFn: (data: TipoCandidatoForm) => 
      fetch('/api/maestro/tipos-candidatos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/maestro/tipos-candidatos'] });
      setShowTipoDialog(false);
      tipoForm.reset();
      toast.success('Tipo de candidato creado exitosamente');
    },
    onError: () => toast.error('Error al crear tipo de candidato'),
  });

  const createDocumentoMutation = useMutation({
    mutationFn: (data: DocumentoTipoForm) => 
      fetch('/api/maestro/documentos-tipo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/maestro/documentos-tipo'] });
      setShowDocumentoDialog(false);
      documentoForm.reset();
      toast.success('Tipo de documento creado exitosamente');
    },
    onError: () => toast.error('Error al crear tipo de documento'),
  });

  const updateDocumentosRequeridos = useMutation({
    mutationFn: ({ tipoId, documentos }: { tipoId: number, documentos: any[] }) =>
      fetch(`/api/maestro/tipos-candidatos-documentos/${tipoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentos }),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/maestro/tipos-candidatos-documentos'] });
      toast.success('Configuración actualizada exitosamente');
    },
    onError: () => toast.error('Error al actualizar configuración'),
  });

  const handleTipoSubmit = (data: TipoCandidatoForm) => {
    createTipoMutation.mutate(data);
  };

  const handleDocumentoSubmit = (data: DocumentoTipoForm) => {
    createDocumentoMutation.mutate(data);
  };

  const handleConfigureTipo = (tipo: any) => {
    setSelectedTipo(tipo);
    setShowDocumentosConfig(true);
  };

  const handleToggleDocumento = (documentoId: number, obligatorio: boolean) => {
    const updatedDocumentos = [...documentosRequeridos];
    const index = updatedDocumentos.findIndex(d => d.documentoTipoId === documentoId);
    
    if (index >= 0) {
      if (obligatorio) {
        updatedDocumentos[index].obligatorio = true;
      } else {
        updatedDocumentos.splice(index, 1);
      }
    } else if (obligatorio) {
      updatedDocumentos.push({
        tipoCandidatoId: selectedTipo.id,
        documentoTipoId: documentoId,
        obligatorio: true,
        orden: updatedDocumentos.length,
      });
    }

    updateDocumentosRequeridos.mutate({
      tipoId: selectedTipo.id,
      documentos: updatedDocumentos,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Maestro de Candidatos</h1>
          <p className="text-muted-foreground">
            Configura los tipos de candidatos y documentos requeridos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tipos de Candidatos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Tipos de Candidatos</CardTitle>
              <CardDescription>
                Define los diferentes tipos de candidatos (Ingeniero, Diseñador, etc.)
              </CardDescription>
            </div>
            <Dialog open={showTipoDialog} onOpenChange={setShowTipoDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Tipo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Tipo de Candidato</DialogTitle>
                  <DialogDescription>
                    Define un nuevo tipo de candidato para el sistema
                  </DialogDescription>
                </DialogHeader>
                <Form {...tipoForm}>
                  <form onSubmit={tipoForm.handleSubmit(handleTipoSubmit)} className="space-y-4">
                    <FormField
                      control={tipoForm.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Ingeniero de Sistemas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={tipoForm.control}
                      name="descripcion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Descripción del tipo de candidato" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={createTipoMutation.isPending}>
                        {createTipoMutation.isPending ? 'Creando...' : 'Crear Tipo'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loadingTipos ? (
              <div className="text-center py-4">Cargando...</div>
            ) : (
              <div className="space-y-2">
                {tiposCandidatos.map((tipo: any) => (
                  <div key={tipo.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{tipo.nombre}</h4>
                      {tipo.descripcion && (
                        <p className="text-sm text-muted-foreground">{tipo.descripcion}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={tipo.activo ? "default" : "secondary"}>
                        {tipo.activo ? "Activo" : "Inactivo"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConfigureTipo(tipo)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tipos de Documentos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Tipos de Documentos</CardTitle>
              <CardDescription>
                Define los documentos disponibles en el sistema
              </CardDescription>
            </div>
            <Dialog open={showDocumentoDialog} onOpenChange={setShowDocumentoDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Documento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Tipo de Documento</DialogTitle>
                  <DialogDescription>
                    Define un nuevo tipo de documento para el sistema
                  </DialogDescription>
                </DialogHeader>
                <Form {...documentoForm}>
                  <form onSubmit={documentoForm.handleSubmit(handleDocumentoSubmit)} className="space-y-4">
                    <FormField
                      control={documentoForm.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Hoja de Vida" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={documentoForm.control}
                      name="descripcion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Descripción del documento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={documentoForm.control}
                      name="requerido"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Requerido por defecto
                            </FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Este documento será requerido para todos los tipos de candidatos
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={createDocumentoMutation.isPending}>
                        {createDocumentoMutation.isPending ? 'Creando...' : 'Crear Documento'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loadingDocumentos ? (
              <div className="text-center py-4">Cargando...</div>
            ) : (
              <div className="space-y-2">
                {documentosTipo.map((documento: any) => (
                  <div key={documento.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{documento.nombre}</h4>
                      {documento.descripcion && (
                        <p className="text-sm text-muted-foreground">{documento.descripcion}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {documento.requerido && (
                        <Badge variant="default">Por defecto</Badge>
                      )}
                      <Badge variant={documento.activo ? "default" : "secondary"}>
                        {documento.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Configuración de Documentos por Tipo */}
      <Dialog open={showDocumentosConfig} onOpenChange={setShowDocumentosConfig}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Configurar Documentos - {selectedTipo?.nombre}
            </DialogTitle>
            <DialogDescription>
              Selecciona qué documentos son requeridos para este tipo de candidato
            </DialogDescription>
          </DialogHeader>
          {selectedTipo && (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Requerido</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentosTipo.map((documento: any) => {
                    const isRequerido = documentosRequeridos.some(
                      (dr: any) => dr.documentoTipoId === documento.id
                    );
                    return (
                      <TableRow key={documento.id}>
                        <TableCell className="font-medium">{documento.nombre}</TableCell>
                        <TableCell>{documento.descripcion || '-'}</TableCell>
                        <TableCell>
                          <Switch
                            checked={isRequerido}
                            onCheckedChange={(checked) => 
                              handleToggleDocumento(documento.id, checked)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}