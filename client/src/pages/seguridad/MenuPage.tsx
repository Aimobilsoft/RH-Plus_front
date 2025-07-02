import React, { useState, useEffect } from "react";
import { Plus, Trash2, ChevronRight, ChevronDown, Folder, FileText, Settings, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Schema for the permission form
const permissionSchema = z.object({
  nombreVista: z.string().min(1, "El nombre de la vista es requerido"),
  ruta: z.string().min(1, "La ruta es requerida"),
  acciones: z.array(z.object({
    codigo: z.string().min(1, "El código es requerido"),
    nombre: z.string().min(1, "El nombre es requerido"),
    tipo: z.string().min(1, "El tipo es requerido")
  })).default([])
});

// Schema for adding new nodes
const addNodeSchema = z.object({
  name: z.string().min(1, "El nombre del nodo es requerido"),
  tipo: z.enum(["folder", "file"]).default("folder"),
  parentId: z.number().optional()
});

// Schema for node editing
const editNodeSchema = z.object({
  name: z.string().min(1, "El nombre del nodo es requerido")
});

type PermissionForm = z.infer<typeof permissionSchema>;
type AddNodeForm = z.infer<typeof addNodeSchema>;
type EditNodeForm = z.infer<typeof editNodeSchema>;

// Define interfaces for type safety
interface MenuNodeData {
  id: number;
  name: string;
  tipo: string;
  parentId: number | null;
  order: number | null;
  children?: MenuNodeData[];
  expanded?: boolean;
}

interface PermissionData {
  permission?: {
    id: number;
    nodeId: number;
    nombreVista: string;
    ruta: string;
  };
  actions: Array<{
    id: number;
    codigo: string;
    nombre: string;
  }>;
}

const MenuPage = () => {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);
  const [isCreatePermissionModalOpen, setIsCreatePermissionModalOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch menu nodes
  const { data: nodes = [], isLoading } = useQuery({
    queryKey: ['menu-nodes'],
    queryFn: async () => {
      const response = await fetch('/api/menu-nodes');
      if (!response.ok) throw new Error('Failed to fetch nodes');
      return response.json();
    }
  });

  // Fetch permission data for selected node
  const { data: permissionData } = useQuery({
    queryKey: ['menu-permissions', selectedNode],
    queryFn: async () => {
      if (!selectedNode) return null;
      const response = await fetch(`/api/menu-permissions/node/${selectedNode}`);
      if (!response.ok) throw new Error('Failed to fetch permissions');
      return response.json();
    },
    enabled: !!selectedNode && selectedNodeType === 'file'
  });

  const form = useForm<PermissionForm>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      nombreVista: "",
      ruta: "",
      acciones: []
    }
  });

  const addNodeForm = useForm<AddNodeForm>({
    resolver: zodResolver(addNodeSchema),
    defaultValues: {
      name: "",
      tipo: "folder",
      parentId: undefined
    }
  });

  const editNodeForm = useForm<EditNodeForm>({
    resolver: zodResolver(editNodeSchema),
    defaultValues: {
      name: ""
    }
  });

  // Create node mutation
  const createNodeMutation = useMutation({
    mutationFn: async (data: AddNodeForm) => {
      const response = await fetch('/api/menu-nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create node');
      return response.json();
    },
    onSuccess: (newNode, variables) => {
      // Si se creó como hijo de un nodo padre, expandir automáticamente el padre
      if (variables.parentId) {
        setExpandedNodes(prev => new Set([...prev, variables.parentId!]));
      }
      // Forzar actualización de la query de nodos
      queryClient.invalidateQueries({ queryKey: ['menu-nodes'] });
      queryClient.refetchQueries({ queryKey: ['menu-nodes'] });
      setIsAddNodeModalOpen(false);
      addNodeForm.reset();
      
      toast({
        title: "Éxito",
        description: `Nodo "${newNode.name}" creado correctamente`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo crear el nodo. Intente nuevamente.",
        variant: "destructive",
      });
    }
  });

  // Delete node mutation
  const deleteNodeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/menu-nodes/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete node');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-nodes'] });
      setSelectedNode(null);
      setSelectedNodeType(null);
      
      toast({
        title: "Éxito",
        description: "Nodo eliminado correctamente",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el nodo. Intente nuevamente.",
        variant: "destructive",
      });
    }
  });

  // Update node mutation
  const updateNodeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EditNodeForm }) => {
      const response = await fetch(`/api/menu-nodes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update node');
      return response.json();
    },
    onSuccess: (updatedNode) => {
      queryClient.invalidateQueries({ queryKey: ['menu-nodes'] });
      
      toast({
        title: "Éxito",
        description: `Nodo "${updatedNode.name}" actualizado correctamente`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el nodo. Intente nuevamente.",
        variant: "destructive",
      });
    }
  });

  // Save permissions mutation
  const savePermissionsMutation = useMutation({
    mutationFn: async (data: PermissionForm & { nodeId: number }) => {
      const response = await fetch('/api/menu-permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to save permissions');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-permissions', selectedNode] });
      
      toast({
        title: "Éxito",
        description: "Permisos guardados correctamente",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudieron guardar los permisos. Intente nuevamente.",
        variant: "destructive",
      });
    }
  });

  // Transform flat nodes into tree structure
  const buildTree = (nodes: any[]): MenuNodeData[] => {
    const nodeMap = new Map();
    const roots: MenuNodeData[] = [];

    // Create map of all nodes
    nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] });
    });

    // Build tree structure
    nodes.forEach(node => {
      const nodeData = nodeMap.get(node.id);
      if (node.parentId === null || node.parentId === undefined) {
        roots.push(nodeData);
      } else {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children.push(nodeData);
        }
      }
    });

    return roots;
  };

  const treeData = buildTree(nodes);

  const toggleExpanded = (nodeId: number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const selectNode = (nodeId: number, nodeType: string, nodeName: string) => {
    setSelectedNode(nodeId);
    setSelectedNodeType(nodeType);
    
    if (nodeType === 'folder') {
      // Load node data for editing
      editNodeForm.reset({ name: nodeName });
    }
  };

  // Load permission data into form when it changes
  useEffect(() => {
    if (permissionData && permissionData.permission) {
      form.reset({
        nombreVista: permissionData.permission.nombreVista,
        ruta: permissionData.permission.ruta,
        acciones: (permissionData.actions || []).map((action: any) => ({
          ...action,
          tipo: action.tipo || "Accion"
        }))
      });
    } else if (selectedNodeType === 'file') {
      // Reset form for new permissions
      form.reset({
        nombreVista: "",
        ruta: "",
        acciones: []
      });
    }
  }, [permissionData, selectedNodeType, form]);

  const addAction = () => {
    const currentActions = form.getValues("acciones");
    form.setValue("acciones", [...currentActions, { codigo: "", nombre: "", tipo: "" }]);
  };

  const removeAction = (index: number) => {
    const currentActions = form.getValues("acciones");
    form.setValue("acciones", currentActions.filter((_, i) => i !== index));
  };

  const onSubmitPermissions = (data: PermissionForm) => {
    if (selectedNode) {
      savePermissionsMutation.mutate({ ...data, nodeId: selectedNode });
    }
  };

  const onSubmitAddNode = (data: AddNodeForm) => {
    const nodeData = {
      ...data,
      parentId: data.parentId && selectedNode ? selectedNode : undefined
    };
    createNodeMutation.mutate(nodeData);
  };

  const onSubmitEditNode = (data: EditNodeForm) => {
    if (selectedNode) {
      updateNodeMutation.mutate({ id: selectedNode, data });
    }
  };

  const deleteSelectedNode = () => {
    if (selectedNode) {
      deleteNodeMutation.mutate(selectedNode);
    }
  };

  const renderTreeNode = (node: MenuNodeData): React.ReactNode => (
    <div key={node.id} className="border-b border-gray-100 last:border-0">
      <div 
        className={`flex items-center py-2 px-3 hover:bg-gray-50 cursor-pointer ${
          selectedNode === node.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
        }`}
        onClick={() => selectNode(node.id, node.tipo, node.name)}
      >
        <div className="flex items-center flex-1 min-w-0">
          {node.children && node.children.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              className="p-0 h-auto mr-1"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.id);
              }}
            >
              {expandedNodes.has(node.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </Button>
          )}
          {node.tipo === "folder" ? <Folder size={16} className="mr-2" /> : <FileText size={16} className="mr-2" />}
          <span className="text-sm truncate">{node.name}</span>
        </div>
      </div>
      
      {expandedNodes.has(node.id) && node.children && (
        <div className="ml-4">
          {node.children.map(child => renderTreeNode(child))}
        </div>
      )}
    </div>
  );

  const renderRightPanel = () => {
    if (!selectedNode) {
      return (
        <div className="text-center text-gray-500 py-8">
          Selecciona un elemento del árbol de menús para ver su configuración
        </div>
      );
    }

    if (selectedNodeType === 'folder') {
      // Show node edit form for folders
      return (
        <Form {...editNodeForm}>
          <form onSubmit={editNodeForm.handleSubmit(onSubmitEditNode)} className="space-y-4">
            <FormField
              control={editNodeForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Módulo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del módulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                💾 Guardar
              </Button>
            </div>
          </form>
        </Form>
      );
    }

    if (selectedNodeType === 'file') {
      // Show permission management form for files
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitPermissions)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombreVista"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Vista *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la vista" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ruta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ruta *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ruta del formulario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-center w-full">LISTADO DE ACCIONES RELACIONADAS</h3>
              </div>
              
              {/* Tabla estilo del diseño */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Código</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Nombre</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.watch("acciones").map((_, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <FormField
                            control={form.control}
                            name={`acciones.${index}.codigo`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="Código"
                                    className="h-8 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <FormField
                            control={form.control}
                            name={`acciones.${index}.nombre`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="Nombre de la acción"
                                    className="h-8 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <FormField
                            control={form.control}
                            name={`acciones.${index}.tipo`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-8 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                                      <SelectValue placeholder="Tipo" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Menu">Menu</SelectItem>
                                    <SelectItem value="Accion">Accion</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              type="button"
                              size="sm"
                              className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white border-0 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => removeAction(index)}
                              className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white border-0 rounded"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={addAction}
                className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Agregar
              </Button>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="submit" 
                className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm px-6 py-2 rounded text-sm font-medium transition-colors"
              >
                Guardar
              </Button>
              <Button 
                type="button" 
                className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-sm px-6 py-2 rounded text-sm font-medium transition-colors"
              >
                Inactivar
              </Button>
            </div>
          </form>
        </Form>
      );
    }

    return null;
  };

  if (isLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mr-4">Gestión de Menús</h1>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          ❈ Arrastra y suelta los elementos hasta organizar el menú de la manera deseado...
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 mb-6">
        <Dialog open={isAddNodeModalOpen} onOpenChange={setIsAddNodeModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus size={16} className="mr-1" />
              Nodo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Nodo</DialogTitle>
            </DialogHeader>
            <Form {...addNodeForm}>
              <form onSubmit={addNodeForm.handleSubmit(onSubmitAddNode)} className="space-y-4">
                <FormField
                  control={addNodeForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Nodo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el nombre del nodo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addNodeForm.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Nodo</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="folder">📁 Módulo</SelectItem>
                            <SelectItem value="file">📄 Formulario</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {selectedNode && selectedNodeType === 'folder' && (
                  <FormField
                    control={addNodeForm.control}
                    name="parentId"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value === selectedNode}
                            onChange={(e) => field.onChange(e.target.checked ? selectedNode : undefined)}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Agregar como hijo del nodo seleccionado
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsAddNodeModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Agregar
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              size="sm" 
              variant="destructive"
              disabled={!selectedNode}
            >
              <Trash2 size={16} className="mr-1" />
              Eliminar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar nodo del menú?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente el nodo seleccionado y todos sus permisos y acciones asociadas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteSelectedNode}
                className="bg-red-600 hover:bg-red-700"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isCreatePermissionModalOpen} onOpenChange={setIsCreatePermissionModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Settings size={16} className="mr-1" />
              Gestión de Permisos
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Gestión de Permisos</DialogTitle>
            </DialogHeader>
            {/* Mostrar lista de nodos de tipo "file" disponibles */}
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Selecciona un formulario para configurar sus permisos:
              </div>
              <div className="max-h-64 overflow-y-auto border rounded-md">
                {nodes.filter((node: any) => node.tipo === 'file').length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No hay formularios disponibles. Crea primero un nodo de tipo "Formulario".
                  </div>
                ) : (
                  nodes.filter((node: any) => node.tipo === 'file').map((node: any) => (
                    <div 
                      key={node.id}
                      className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 ${
                        selectedNode === node.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => {
                        selectNode(node.id, node.tipo, node.name);
                        setIsCreatePermissionModalOpen(false);
                      }}
                    >
                      <FileText size={16} className="mr-2 text-gray-500" />
                      <span className="text-sm">{node.name}</span>
                    </div>
                  ))
                )}
              </div>
              {selectedNode && selectedNodeType === 'file' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center text-green-800 text-sm">
                    <FileText size={16} className="mr-2" />
                    Formulario seleccionado: {nodes.find((n: any) => n.id === selectedNode)?.name}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Puedes configurar los permisos en el panel derecho
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-6">
        {/* Tree View - Left Side */}
        <div className="col-span-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Estructura del Menú</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto border rounded-md">
                {treeData.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No hay nodos creados. Usa el botón "Nodo" para agregar elementos.
                  </div>
                ) : (
                  treeData.map(node => renderTreeNode(node))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Panel - Right Side */}
        <div className="col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedNodeType === 'folder' ? 'Configuración del Módulo' : 
                 selectedNodeType === 'file' ? 'Gestión de Permisos' : 'Configuración'}
              </CardTitle>
              <CardDescription>
                {selectedNode ? 
                  (selectedNodeType === 'folder' ? 'Edita la información del módulo seleccionado' : 
                   selectedNodeType === 'file' ? 'Configura los permisos del formulario seleccionado' : 
                   'Configuración del elemento seleccionado') : 
                  'Selecciona un elemento del árbol para ver su configuración'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderRightPanel()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;