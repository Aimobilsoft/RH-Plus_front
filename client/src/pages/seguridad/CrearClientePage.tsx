import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const clienteSchema = z.object({
  nombreCompleto: z.string().min(2, "Nombre completo requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Contraseña debe tener al menos 8 caracteres").optional(),
  empresa: z.string().min(2, "Empresa requerida"),
  regional: z.string().min(1, "Regional requerida"),
  sucursal: z.string().min(1, "Sucursal requerida"),
});

type ClienteForm = z.infer<typeof clienteSchema>;

const CrearClientePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClienteForm>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombreCompleto: "",
      email: "",
      password: "",
      empresa: "",
      regional: "",
      sucursal: "",
    },
  });

  const regionales = [
    { value: "bogota", label: "Bogotá" },
    { value: "medellin", label: "Medellín" },
    { value: "cali", label: "Cali" },
    { value: "barranquilla", label: "Barranquilla" },
    { value: "bucaramanga", label: "Bucaramanga" },
    { value: "cartagena", label: "Cartagena" },
  ];

  const sucursales = {
    bogota: [
      { value: "centro", label: "Centro" },
      { value: "norte", label: "Norte" },
      { value: "sur", label: "Sur" },
      { value: "occidente", label: "Occidente" },
    ],
    medellin: [
      { value: "centro", label: "Centro" },
      { value: "norte", label: "Norte" },
      { value: "sur", label: "Sur" },
      { value: "oriente", label: "Oriente" },
    ],
    cali: [
      { value: "centro", label: "Centro" },
      { value: "norte", label: "Norte" },
      { value: "sur", label: "Sur" },
    ],
    barranquilla: [
      { value: "centro", label: "Centro" },
      { value: "norte", label: "Norte" },
      { value: "metropolitana", label: "Metropolitana" },
    ],
    bucaramanga: [
      { value: "centro", label: "Centro" },
      { value: "norte", label: "Norte" },
      { value: "sur", label: "Sur" },
    ],
    cartagena: [
      { value: "centro", label: "Centro" },
      { value: "norte", label: "Norte" },
      { value: "sur", label: "Sur" },
    ],
  };

  const selectedRegional = form.watch("regional");
  const availableSucursales = selectedRegional ? sucursales[selectedRegional as keyof typeof sucursales] || [] : [];

  const onSubmit = async (data: ClienteForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Cliente creado exitosamente",
          description: "El nuevo usuario cliente ha sido registrado en el sistema",
        });
        navigate('/seguridad/perfiles');
      } else {
        const error = await response.json();
        toast({
          title: "Error al crear cliente",
          description: error.message || "Ha ocurrido un error inesperado",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating cliente:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container p-6">
      <div className="page-header mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/seguridad/perfiles">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-yellow-600" />
            <h1 className="text-2xl font-bold">Crear Cliente</h1>
          </div>
        </div>
        <p className="text-gray-600 mt-2">
          Crea un nuevo usuario cliente con acceso a solicitudes de ingreso y gestión de candidatos
        </p>
      </div>

      <Card className="max-w-2xl mx-auto border-yellow-200">
        <CardHeader className="bg-yellow-50">
          <CardTitle className="flex items-center space-x-2 text-yellow-800">
            <Building className="h-5 w-5" />
            <span>Información del Cliente</span>
          </CardTitle>
          <CardDescription>
            Complete los datos del nuevo usuario cliente. La contraseña es opcional; si no se proporciona, se generará una temporal.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-yellow-800 border-b border-yellow-200 pb-2">
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
                  <Input
                    id="nombreCompleto"
                    {...form.register("nombreCompleto")}
                    placeholder="Ej: María Torres Gómez"
                    className={form.formState.errors.nombreCompleto ? "border-red-500" : ""}
                  />
                  {form.formState.errors.nombreCompleto && (
                    <p className="text-red-500 text-sm">{form.formState.errors.nombreCompleto.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="maria.torres@empresa.com"
                    className={form.formState.errors.email ? "border-red-500" : ""}
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña (Opcional)</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  placeholder="Dejar vacío para generar contraseña temporal"
                  className={form.formState.errors.password ? "border-red-500" : ""}
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
                )}
                <p className="text-sm text-gray-500">
                  Si no se proporciona, se generará una contraseña temporal que deberá cambiar en el primer acceso.
                </p>
              </div>
            </div>

            {/* Información Empresarial */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-yellow-800 border-b border-yellow-200 pb-2">
                Información Empresarial
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa *</Label>
                <Input
                  id="empresa"
                  {...form.register("empresa")}
                  placeholder="Ej: TechCorp S.A.S."
                  className={form.formState.errors.empresa ? "border-red-500" : ""}
                />
                {form.formState.errors.empresa && (
                  <p className="text-red-500 text-sm">{form.formState.errors.empresa.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regional">Regional *</Label>
                  <Select 
                    value={form.watch("regional")} 
                    onValueChange={(value) => {
                      form.setValue("regional", value);
                      form.setValue("sucursal", ""); // Reset sucursal when regional changes
                    }}
                  >
                    <SelectTrigger className={form.formState.errors.regional ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar regional" />
                    </SelectTrigger>
                    <SelectContent>
                      {regionales.map((regional) => (
                        <SelectItem key={regional.value} value={regional.value}>
                          {regional.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.regional && (
                    <p className="text-red-500 text-sm">{form.formState.errors.regional.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sucursal">Sucursal *</Label>
                  <Select 
                    value={form.watch("sucursal")} 
                    onValueChange={(value) => form.setValue("sucursal", value)}
                    disabled={!selectedRegional}
                  >
                    <SelectTrigger className={form.formState.errors.sucursal ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSucursales.map((sucursal) => (
                        <SelectItem key={sucursal.value} value={sucursal.value}>
                          {sucursal.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.sucursal && (
                    <p className="text-red-500 text-sm">{form.formState.errors.sucursal.message}</p>
                  )}
                  {!selectedRegional && (
                    <p className="text-sm text-gray-500">Primero seleccione una regional</p>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link to="/seguridad/perfiles">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Creando..." : "Crear Cliente"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrearClientePage;