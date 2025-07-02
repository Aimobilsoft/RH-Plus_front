import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";

// Schema para el formulario de perfil
const perfilSchema = z.object({
  codigo: z.number(),
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  permisos: z.array(z.object({
    menuNodeId: z.number(),
    menuNodeName: z.string(),
    acciones: z.array(z.number()).default([])
  })).default([])
});

type PerfilForm = z.infer<typeof perfilSchema>;

const PerfilesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState<any>(null);
  
  const queryClient = useQueryClient();

  // Fetch perfiles
  const { data: perfiles = [], isLoading } = useQuery({
    queryKey: ['perfiles'],
    queryFn: async () => {
      const response = await fetch('/api/perfiles');
      if (!response.ok) throw new Error('Failed to fetch perfiles');
      return response.json();
    }
  });

  // Fetch menu nodes (vistas) with permissions
  const { data: menuNodes = [] } = useQuery({
    queryKey: ['menu-nodes-with-permissions'],
    queryFn: async () => {
      const response = await fetch('/api/menu-nodes');
      if (!response.ok) throw new Error('Failed to fetch menu nodes');
      const nodes = await response.json();
      
      // Filter only file type nodes (forms/views)
      return nodes.filter((node: any) => node.tipo === 'file');
    }
  });

  // Fetch actions for a specific menu node
  const getActionsForNode = async (nodeId: number) => {
    const response = await fetch(`/api/menu-permissions/node/${nodeId}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.actions || [];
  };

  const form = useForm<PerfilForm>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      codigo: 0,
      nombre: "",
      descripcion: "",
      permisos: []
    }
  });

  const { fields: permisosFields, append: appendPermiso, remove: removePermiso } = useFieldArray({
    control: form.control,
    name: "permisos"
  });

  // Create/Update perfil mutation
  const savePerfilMutation = useMutation({
    mutationFn: async (data: PerfilForm) => {
      const url = editingPerfil ? `/api/perfiles/${editingPerfil.id}` : '/api/perfiles';
      const method = editingPerfil ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to save perfil');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfiles'] });
      setIsModalOpen(false);
      setEditingPerfil(null);
      form.reset();
    }
  });

  // Delete perfil mutation
  const deletePerfilMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/perfiles/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete perfil');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfiles'] });
    }
  });

  const onSubmit = (data: PerfilForm) => {
    savePerfilMutation.mutate(data);
  };

  const handleEdit = (perfil: any) => {
    setEditingPerfil(perfil);
    form.reset({
      codigo: perfil.id,
      nombre: perfil.nombre,
      descripcion: perfil.descripcion || "",
      permisos: [] // TODO: Cargar permisos existentes
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este perfil?')) {
      deletePerfilMutation.mutate(id);
    }
  };

  const addPermiso = async (menuNodeId: number, menuNodeName: string) => {
    const exists = permisosFields.find(p => p.menuNodeId === menuNodeId);
    if (!exists) {
      appendPermiso({
        menuNodeId,
        menuNodeName,
        acciones: []
      });
    }
  };

  if (isLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Perfiles</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingPerfil(null);
                form.reset({
                  codigo: perfiles.length + 1,
                  nombre: "",
                  descripcion: "",
                  permisos: []
                });
              }}
              className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Perfil
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPerfil ? 'Editar Perfil' : 'Registro de Perfiles'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={String(field.value).padStart(2, '0')}
                            disabled
                            className="bg-red-50 text-red-600 font-semibold"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del perfil" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sección de permisos y acciones */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">LISTADO DE PERMISOS Y ACCIONES RELACIONADAS</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700 border-b pb-2">
                    <div>Código</div>
                    <div>Nombre</div>
                    <div>Acciones</div>
                  </div>

                  {/* Select para agregar nueva vista */}
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Select onValueChange={(value) => {
                        const nodeId = parseInt(value);
                        const node = menuNodes.find((n: any) => n.id === nodeId);
                        if (node) {
                          addPermiso(nodeId, node.name);
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar vista..." />
                        </SelectTrigger>
                        <SelectContent>
                          {menuNodes.map((node: any) => (
                            <SelectItem key={node.id} value={String(node.id)}>
                              {node.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      className="bg-green-500 hover:bg-green-600 text-white border-0 rounded px-4 py-2"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Lista de permisos agregados */}
                  {permisosFields.map((campo, index) => (
                    <PermisoRow
                      key={campo.id}
                      campo={campo}
                      index={index}
                      form={form}
                      onRemove={() => removePermiso(index)}
                      getActionsForNode={getActionsForNode}
                    />
                  ))}
                </div>

                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descripción del perfil..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingPerfil(null);
                      form.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm px-6 py-2 rounded text-sm font-medium transition-colors"
                    disabled={savePerfilMutation.isPending}
                  >
                    {savePerfilMutation.isPending ? 'Guardando...' : 'Guardar'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de perfiles */}
      <Card>
        <CardHeader>
          <CardTitle>Perfiles del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Código</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Nombre</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Descripción</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {perfiles.map((perfil: any) => (
                  <tr key={perfil.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{String(perfil.id).padStart(2, '0')}</td>
                    <td className="py-3 px-4 font-medium">{perfil.nombre}</td>
                    <td className="py-3 px-4 text-gray-600">{perfil.descripcion || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(perfil)}
                          className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white border-0 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(perfil.id)}
                          className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white border-0 rounded"
                          disabled={deletePerfilMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {perfiles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay perfiles registrados
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente para cada fila de permiso
const PermisoRow = ({ campo, index, form, onRemove, getActionsForNode }: any) => {
  const [actions, setActions] = useState<any[]>([]);
  const [loadingActions, setLoadingActions] = useState(false);

  React.useEffect(() => {
    const loadActions = async () => {
      setLoadingActions(true);
      try {
        const nodeActions = await getActionsForNode(campo.menuNodeId);
        setActions(nodeActions);
      } catch (error) {
        console.error('Error loading actions:', error);
      } finally {
        setLoadingActions(false);
      }
    };

    loadActions();
  }, [campo.menuNodeId]);

  const handleActionToggle = (actionId: number, checked: boolean) => {
    const currentActions = form.getValues(`permisos.${index}.acciones`) || [];
    let newActions;
    
    if (checked) {
      newActions = [...currentActions, actionId];
    } else {
      newActions = currentActions.filter((id: number) => id !== actionId);
    }
    
    form.setValue(`permisos.${index}.acciones`, newActions);
  };

  return (
    <div className="grid grid-cols-3 gap-4 py-2 border-b">
      <div className="font-mono text-sm">{String(campo.menuNodeId).padStart(2, '0')}</div>
      <div className="font-medium">{campo.menuNodeName}</div>
      <div className="space-y-1">
        {loadingActions ? (
          <div className="text-sm text-gray-500">Cargando acciones...</div>
        ) : (
          <div className="space-y-2">
            {actions.map((action: any) => (
              <div key={action.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`action-${index}-${action.id}`}
                  checked={form.watch(`permisos.${index}.acciones`)?.includes(action.id)}
                  onCheckedChange={(checked) => handleActionToggle(action.id, checked as boolean)}
                />
                <label 
                  htmlFor={`action-${index}-${action.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {action.nombre} ({action.tipo})
                </label>
              </div>
            ))}
            {actions.length === 0 && (
              <div className="text-sm text-gray-500">No hay acciones configuradas</div>
            )}
          </div>
        )}
        <Button
          type="button"
          size="sm"
          onClick={onRemove}
          className="h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white border-0 rounded mt-2"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default PerfilesPage;