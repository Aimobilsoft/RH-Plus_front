import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect, type Option } from "@/components/ui/multi-select";

// Schema de validación para el formulario
const usuarioSchema = z.object({
  identificacion: z.string().min(6, "Identificación debe tener al menos 6 caracteres"),
  primerNombre: z.string().min(2, "Primer nombre requerido"),
  segundoNombre: z.string().optional(),
  primerApellido: z.string().min(2, "Primer apellido requerido"),
  segundoApellido: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email("Email inválido"),
  username: z.string().min(3, "Username debe tener al menos 3 caracteres"),
  password: z.string()
    .min(8, "Contraseña debe tener al menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Contraseña debe incluir mayúsculas, minúsculas y números"),
  perfilIds: z.array(z.number()).min(1, "Debe seleccionar al menos un perfil"),
});

type FormData = z.infer<typeof usuarioSchema>;

interface Perfil {
  id: number;
  nombre: string;
  descripcion?: string;
}

const CrearUsuarioPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPerfiles, setSelectedPerfiles] = useState<number[]>([]);

  // Query para obtener perfiles disponibles
  const { data: perfiles = [], isLoading: loadingPerfiles } = useQuery<Perfil[]>({
    queryKey: ["/api/perfiles"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(usuarioSchema),
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
    },
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;
  const passwordValue = watch("password");

  // Mutation para crear usuario
  const createUsuarioMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("/api/usuarios", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "✅ Usuario creado exitosamente",
        description: "El nuevo usuario ha sido registrado en el sistema.",
        className: "bg-green-50 border-green-200",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/usuarios"] });
      setLocation("/seguridad/usuarios");
    },
    onError: (error: any) => {
      toast({
        title: "❌ Error al crear usuario",
        description: error.message || "No se pudo crear el usuario. Verifica los datos e intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const formDataWithPerfiles = {
      ...data,
      perfilIds: selectedPerfiles,
    };
    createUsuarioMutation.mutate(formDataWithPerfiles);
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
            <UserPlus className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Registro de Usuarios
              </h1>
              <p className="text-gray-600">
                Complete la información del nuevo usuario
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
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••••"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
                <PasswordStrengthIndicator password={passwordValue || ""} />
              </div>

              {/* Perfiles asociados - Multiselect moderno */}
              <div>
                <Label>Perfiles Asociados *</Label>
                <MultiSelect
                  options={perfiles.map(perfil => ({
                    id: perfil.id,
                    value: perfil.nombre.toLowerCase(),
                    label: perfil.nombre,
                    description: perfil.descripcion
                  }))}
                  selected={selectedPerfiles}
                  onSelectionChange={(newSelection) => {
                    setSelectedPerfiles(newSelection);
                    setValue("perfilIds", newSelection);
                  }}
                  placeholder="Seleccionar perfiles para el usuario..."
                  emptyText="No hay perfiles disponibles"
                  isLoading={loadingPerfiles}
                  disabled={loadingPerfiles}
                />
                
                {errors.perfilIds && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.perfilIds.message}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Selecciona uno o más perfiles para definir los permisos del usuario
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
                  disabled={createUsuarioMutation.isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {createUsuarioMutation.isPending ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
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

export default CrearUsuarioPage;