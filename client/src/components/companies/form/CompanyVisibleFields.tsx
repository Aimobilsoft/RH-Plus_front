import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateEmpresaDTO } from "@/types/empresa";

interface CompanyVisibleFieldsProps {
  form: UseFormReturn<CreateEmpresaDTO>;
}

export function CompanyVisibleFields({ form }: CompanyVisibleFieldsProps) {
  const visibleFields = [
    {
      id: "cargo",
      label: "Cargo",
      description: "Permitir capturar el cargo del aspirante"
    },
    {
      id: "salario",
      label: "Salario",
      description: "Permitir capturar el salario del aspirante"
    },
    {
      id: "celular",
      label: "Celular",
      description: "Permitir capturar el número de celular del aspirante"
    },
    {
      id: "correo",
      label: "Correo",
      description: "Permitir capturar el correo electrónico del aspirante"
    },
    {
      id: "fecha_ingreso",
      label: "Fecha de Ingreso",
      description: "Permitir capturar la fecha de ingreso del aspirante"
    },
    {
      id: "direccion",
      label: "Dirección",
      description: "Permitir capturar la dirección del aspirante"
    },
    {
      id: "jornada_laboral",
      label: "Jornada Laboral",
      description: "Permitir capturar la jornada laboral del aspirante"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-green-600">
          Campos Visibles en Órdenes
        </CardTitle>
        <CardDescription>
          Selecciona los campos que estarán visibles al crear órdenes para esta empresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleFields.map((field) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`campos_visibles.${field.id}` as any}
              render={({ field: formField }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={formField.value}
                      onCheckedChange={formField.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      {field.label}
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      {field.description}
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}