import { z } from "zod";

export const createEmpresaSchema = z.object({
  tipo_documento: z.string().min(1, "El tipo de documento es requerido"),
  nit_base: z.string().min(1, "El NIT es requerido").max(9, "El NIT no puede tener más de 9 dígitos"),
  nit_verification: z.string(),
  nit: z.string(),
  regimen_tributario: z.string().min(1, "El régimen tributario es requerido"),
  razon_social: z.string().min(1, "La razón social es requerida"),
  direccion: z.string().min(1, "La dirección es requerida"),
  ciudad: z.string().min(1, "La ciudad es requerida"),
  ciudad_nombre: z.string().optional(),
  departamento_nombre: z.string().optional(),
  telefono: z.string().min(1, "El teléfono es requerido"),
  email: z.string().email("Correo electrónico inválido"),
  representante_legal: z.string().min(1, "El representante legal es requerido"),
  actividad_economica: z.string().min(1, "La actividad económica es requerida"),
  actividad_nombre: z.string().optional(),
  numero_empleados: z.number().min(1, "Debe tener al menos 1 empleado"),
  activo: z.boolean().default(true),
  tipo_empresa: z.string().default("prestador"),
  campos_visibles: z.object({
    cargo: z.boolean().default(true),
    salario: z.boolean().default(true),
    celular: z.boolean().default(true),
    correo: z.boolean().default(true),
    fecha_ingreso: z.boolean().default(true),
    direccion: z.boolean().default(true),
    jornada_laboral: z.boolean().default(true)
  }).optional(),
  documentos: z.array(z.object({
    tipo: z.string(),
    archivo: z.any(),
    nombre: z.string()
  })).optional()
});

export type CreateEmpresaDTO = z.infer<typeof createEmpresaSchema>;

export interface DocumentoEmpresa {
  id: number;
  empresa_id: number;
  tipo: string;
  nombre_archivo: string;
  url_archivo: string;
  fecha_carga: string;
}