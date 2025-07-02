import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Search, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Link } from "wouter";

interface Usuario {
  id: number;
  identificacion: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  telefono?: string;
  email: string;
  username: string;
  activo: boolean;
  fechaCreacion: string;
  perfiles: Array<{
    id: number;
    nombre: string;
    descripcion?: string;
  }>;
}

const UsuariosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para obtener usuarios
  const { data: usuarios = [], isLoading } = useQuery<Usuario[]>({
    queryKey: ["/api/usuarios"],
  });

  // Mutation para eliminar usuario
  const deleteUsuarioMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/usuarios/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/usuarios"] });
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el usuario.",
        variant: "destructive",
      });
    },
  });

  // Filtrar usuarios basado en búsqueda
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const searchLower = searchTerm.toLowerCase();
    const nombreCompleto = `${usuario.primerNombre} ${usuario.segundoNombre || ""} ${usuario.primerApellido} ${usuario.segundoApellido || ""}`.toLowerCase();
    
    return (
      nombreCompleto.includes(searchLower) ||
      usuario.email.toLowerCase().includes(searchLower) ||
      usuario.username.toLowerCase().includes(searchLower) ||
      usuario.identificacion.includes(searchTerm)
    );
  });

  const handleEliminarUsuario = async (id: number) => {
    deleteUsuarioMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600">
              Administra usuarios del sistema y sus perfiles asignados
            </p>
          </div>
        </div>
        <Link href="/seguridad/usuarios/crear">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Crear Usuario
          </Button>
        </Link>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nombre, email, username o identificación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Usuarios Registrados</span>
            <Badge variant="secondary">{usuariosFiltrados.length} usuarios</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usuariosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No se encontraron usuarios" : "No hay usuarios registrados"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Identificación
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Nombre Completo
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Username
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Teléfono
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Perfiles
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Estado
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {usuario.identificacion}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {`${usuario.primerNombre} ${usuario.segundoNombre || ""} ${usuario.primerApellido} ${usuario.segundoApellido || ""}`.trim()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {usuario.email}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {usuario.username}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {usuario.telefono || "-"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {usuario.perfiles.map((perfil) => (
                            <Badge
                              key={perfil.id}
                              variant="outline"
                              className="text-xs"
                            >
                              {perfil.nombre}
                            </Badge>
                          ))}
                          {usuario.perfiles.length === 0 && (
                            <span className="text-xs text-gray-400">Sin perfiles</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={usuario.activo ? "default" : "secondary"}
                          className={
                            usuario.activo
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {usuario.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-1 justify-end">
                          <Link href={`/seguridad/usuarios/editar/${usuario.id}`}>
                            <Button
                              size="sm"
                              className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white border-0 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white border-0 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  ¿Estás seguro de que deseas eliminar el usuario{" "}
                                  <strong>{usuario.primerNombre} {usuario.primerApellido}</strong>?
                                  Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleEliminarUsuario(usuario.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsuariosPage;