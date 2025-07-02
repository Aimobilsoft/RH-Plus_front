import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator";
import { Checkbox } from "@/components/ui/checkbox";

// Schema de validación para el formulario de edición
const editUsuarioSchema = z.object({
  identificacion: z.string().min(6, "Identificación debe tener al menos 6 caracteres"),
  primerNombre: z.string().min(2, "Primer nombre requerido"),
  segundoNombre: z.string().optional(),
  primerApellido: z.string().min(2, "Primer apellido requerido"),
  segundoApellido: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email("Email inválido"),
  username: z.string().min(3, "Username debe tener al menos 3 caracteres"),
  password: z.string().optional().refine((password) => {
    if (!password || password === "") return true; // Permitir contraseña vacía (no cambiar)
    return password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
  }, "Contraseña debe tener al menos 8 caracteres con mayúsculas, minúsculas y números"),
  perfilIds: z.array(z.number()).min(1, "Debe seleccionar al menos un perfil"),
  activo: z.boolean().default(true),
});

type FormData = z.infer<typeof editUsuarioSchema>;

interface Perfil {
  id: number;
  nombre: string;
  descripcion?: string;
}

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
  perfiles: Array<{
    id: number;
    nombre: string;
    descripcion?: string;
  }>;
}

interface EditarUsuarioPageProps {
  id: string;
}

const EditarUsuarioPage = ({ id }: EditarUsuarioPageProps) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPerfiles, setSelectedPerfiles] = useState<number[]>([]);
  const userId = parseInt(id);

  // Query para obtener el usuario
  const { data: usuario, isLoading: loadingUsuario } = useQuery<Usuario>({
    queryKey: ["/api/usuarios", userId],
    queryFn: async () => {
      const usuarios = await apiRequest("/api/usuarios");
      const user = usuarios.find((u: Usuario) => u.id === userId);
      if (!user) throw new Error("Usuario no encontrado");
      return user;
    },
  });

  // Query para obtener perfiles disponibles
  const { data: perfiles = [], isLoading: loadingPerfiles } = useQuery<Perfil[]>({
    queryKey: ["/api/perfiles"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(editUsuarioSchema),
    defaultValues: {
      identificacion: "",
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      telefono: "",
      email: "",
      username: "",
      password: "",
      perfilIds: [],
      activo: true,
    },
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = form;
  const passwordValue = watch("password");

  // Cargar datos del usuario cuando esté disponible
  useEffect(() => {
    if (usuario) {
      reset({
        identificacion: usuario.identificacion,
        primerNombre: usuario.primerNombre,
        segundoNombre: usuario.segundoNombre || "",
        primerApellido: usuario.primerApellido,
        segundoApellido: usuario.segundoApellido || "",
        telefono: usuario.telefono || "",
        email: usuario.email,
        username: usuario.username,
        password: "",
        perfilIds: usuario.perfiles.map(p => p.id),
        activo: usuario.activo,
      });
      setSelectedPerfiles(usuario.perfiles.map(p => p.id));
    }
  }, [usuario, reset]);

  // Mutation para actualizar usuario
  const updateUsuarioMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const updateData = { ...data };
      // Si no se proporciona contraseña, no enviarla
      if (!updateData.password || updateData.password === "") {
        delete updateData.password;
      }
      
      return await apiRequest(`/api/usuarios/${userId}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Usuario actualizado",
        description: "El usuario ha sido actualizado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/usuarios"] });
      setLocation("/seguridad/usuarios");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el usuario.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const formDataWithPerfiles = {
      ...data,
      perfilIds: selectedPerfiles,
    };
    updateUsuarioMutation.mutate(formDataWithPerfiles);
  };

  const handlePerfilChange = (perfilId: number, checked: boolean) => {
    let newSelectedPerfiles: number[];
    if (checked) {
      newSelectedPerfiles = [...selectedPerfiles, perfilId];
    } else {
      newSelectedPerfiles = selectedPerfiles.filter(id => id !== perfilId);
    }
    setSelectedPerfiles(newSelectedPerfiles);
    setValue("perfilIds", newSelectedPerfiles);
  };

  const handleVolver = () => {
    setLocation("/seguridad/usuarios");
  };

  if (loadingUsuario) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Usuario no encontrado
          </h1>
          <Button onClick={handleVolver}>Volver a usuarios</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleVolver}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div className="flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Editar Usuario
              </h1>
              <p className="text-gray-600">
                Modifica la información del usuario
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Información personal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="identificacion">Identificación *</Label>
                  <Input
                    id="identificacion"
                    placeholder="00000000"
                    {...register("identificacion")}
                    className={errors.identificacion ? "border-red-500" : ""}
                  />
                  {errors.identificacion && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.identificacion.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="primerNombre">1er Nombre *</Label>
                  <Input
                    id="primerNombre"
                    placeholder="Primer nombre"
                    {...register("primerNombre")}
                    className={errors.primerNombre ? "border-red-500" : ""}
                  />
                  {errors.primerNombre && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.primerNombre.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="segundoNombre">2do Nombre</Label>
                  <Input
                    id="segundoNombre"
                    placeholder="Segundo nombre"
                    {...register("segundoNombre")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primerApellido">1er Apellido *</Label>
                  <Input
                    id="primerApellido"
                    placeholder="Primer apellido"
                    {...register("primerApellido")}
                    className={errors.primerApellido ? "border-red-500" : ""}
                  />
                  {errors.primerApellido && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.primerApellido.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="segundoApellido">2do Apellido</Label>
                  <Input
                    id="segundoApellido"
                    placeholder="Segundo apellido"
                    {...register("segundoApellido")}
                  />
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    placeholder="### ##-##"
                    {...register("telefono")}
                  />
                </div>
              </div>

              {/* Información de contacto y acceso */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Correo Electrónico"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="username">Usuario *</Label>
                  <Input
                    id="username"
                    placeholder="Usuario"
                    {...register("username")}
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Contraseña con indicador de fortaleza */}
              <div>
                <Label htmlFor="password">Nueva Contraseña (opcional)</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Dejar vacío para mantener la actual"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
                {passwordValue && (
                  <PasswordStrengthIndicator password={passwordValue} />
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Deja este campo vacío si no deseas cambiar la contraseña
                </p>
              </div>

              {/* Estado del usuario */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activo"
                  {...register("activo")}
                />
                <Label htmlFor="activo">Usuario activo</Label>
              </div>

              {/* Perfiles asociados - Multiselect */}
              <div>
                <Label>Perfiles Asociados *</Label>
                <div className="border rounded-lg p-4 mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {loadingPerfiles ? (
                    <div className="text-center py-4">
                      <span className="text-gray-500">Cargando perfiles...</span>
                    </div>
                  ) : perfiles.length === 0 ? (
                    <div className="text-center py-4">
                      <span className="text-gray-500">No hay perfiles disponibles</span>
                    </div>
                  ) : (
                    perfiles.map((perfil) => (
                      <div key={perfil.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`perfil-${perfil.id}`}
                          checked={selectedPerfiles.includes(perfil.id)}
                          onCheckedChange={(checked) => handlePerfilChange(perfil.id, checked as boolean)}
                        />
                        <Label 
                          htmlFor={`perfil-${perfil.id}`}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          <span className="font-medium">{perfil.nombre}</span>
                          {perfil.descripcion && (
                            <span className="text-gray-500 ml-2">- {perfil.descripcion}</span>
                          )}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
                {errors.perfilIds && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.perfilIds.message}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Selecciona uno o más perfiles para el usuario
                </p>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVolver}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updateUsuarioMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {updateUsuarioMutation.isPending ? (
                    "Actualizando..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Actualizar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarUsuarioPage;